import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source = ts.transpileModule(readFileSync(new URL('../lib/chat-timeline-core.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const testModule = { exports: {} };
vm.runInNewContext(source, { module: testModule, exports: testModule.exports, AbortController, setTimeout, clearTimeout });
const { ChatTimeline } = testModule.exports;
const row = (n, version = 0) => ({ _id: String(n), text: String(n), createdAt: new Date(n * 1000).toISOString(), _cursor: String(n), chatVersion: version });
const page = (start = 480, end = 519) => ({ data: Array.from({ length: end - start + 1 }, (_, i) => row(start + i)), olderCursor: String(start), newerCursor: String(end), latestCursor: '1000', hasOlder: start > 1, hasNewer: end < 1000 });
const sync = async () => ({ data: [], removedIds: [], latest: null });

test('failed older history preserves the visible section and enables retry', async () => {
  let fail = false;
  const timeline = new ChatTimeline({ page: async options => { if (options.before && fail) throw Error('offline'); return options.before ? page(440, 479) : page(); }, sync, accessDenied: () => false });
  await timeline.open('500'); fail = true;
  await timeline.olderPage();
  assert.equal(timeline.getSnapshot().rows[0]._id, '480');
  assert.ok(timeline.getSnapshot().olderError);
  fail = false; await timeline.olderPage();
  assert.equal(timeline.getSnapshot().rows[0]._id, '440');
});
test('older cursor boundaries do not shift after 50 inserts; latest is one direct request', async () => {
  const calls = [];
  const timeline = new ChatTimeline({ page: async options => { calls.push(options); return options.around ? page() : options.before ? page(440, 479) : page(1011, 1050); }, sync, accessDenied: () => false });
  await timeline.open('500'); await timeline.olderPage();
  assert.equal(calls[1].before, '480');
  await timeline.jumpLatest();
  assert.equal(calls.length, 3);
  assert.equal(timeline.getSnapshot().rows[0]._id, '1011');
});
test('overlapping history cannot revert a record with a newer version', async () => {
  const timeline = new ChatTimeline({ page: async options => options.before ? page(479, 500) : page(), sync: async () => ({ data: [{ ...row(500, 2), text: 'edited' }], removedIds: [], latest: null }), accessDenied: () => false });
  await timeline.open('500'); await timeline.revalidate(); await timeline.olderPage();
  const rows = timeline.getSnapshot().rows;
  assert.equal(rows.find(m => m._id === '500').text, 'edited');
  assert.equal(new Set(rows.map(m => m._id)).size, rows.length);
});
test('account reset discards responses from the previous account', async () => {
  let resolve;
  const timeline = new ChatTimeline({ page: () => new Promise(done => { resolve = done; }), sync, accessDenied: () => false });
  const pending = timeline.open('500'); timeline.clear(); resolve(page()); await pending;
  assert.equal(timeline.getSnapshot().rows.length, 0);
});

test('reopening an evicted notification target fetches its original section again', async () => {
  const calls = [];
  const timeline = new ChatTimeline({
    page: async options => { calls.push(options); return options.after ? page(Number(options.after) + 1, Number(options.after) + 40) : page(); },
    sync, accessDenied: () => false,
  });
  await timeline.open('500');
  for (let i = 0; i < 8; i++) await timeline.newerPage();
  assert.ok(!timeline.getSnapshot().rows.some(row => row._id === '500'));
  const count = calls.length;
  await timeline.open('500');
  assert.equal(calls.length, count + 1);
  assert.equal(calls.at(-1).around, '500');
  assert.ok(timeline.getSnapshot().rows.some(row => row._id === '500'));
});

test('foreground and socket reconnect share revalidation without another history load', async () => {
  let finish, pages = 0, syncs = 0;
  const timeline = new ChatTimeline({
    page: async () => { pages++; return page(); },
    sync: async () => { syncs++; return new Promise(resolve => { finish = resolve; }); }, accessDenied: () => false,
  });
  const unsubscribe = timeline.subscribe(() => {});
  try {
    await timeline.open('500'); const rows = timeline.getSnapshot().rows;
    timeline.invalidate(false);
    const resumed = timeline.open('500');
    timeline.invalidate();
    const connected = timeline.revalidate();
    assert.equal(syncs, 1); assert.equal(timeline.getSnapshot().rows, rows);
    finish({ data: [{ ...row(500, 1), text: 'changed while away' }], removedIds: ['499'], latest: null });
    await Promise.all([resumed, connected]);
    assert.equal(pages, 1); assert.equal(timeline.getSnapshot().valid, true);
    assert.equal(timeline.getSnapshot().rows.find(row => row._id === '500').text, 'changed while away');
    assert.ok(!timeline.getSnapshot().rows.some(row => row._id === '499'));
  } finally { unsubscribe(); timeline.dispose(); }
});
