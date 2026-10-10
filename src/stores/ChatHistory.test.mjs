import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { create } from "zustand";

function compile(file, dependencies) {
  const source = ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(source, { module: testModule, exports: testModule.exports, require: name => {
    if (name in dependencies) return dependencies[name];
    throw new Error(`Unexpected dependency: ${name}`);
  } });
  return testModule.exports;
}

function setup(request) {
  const storeModule = compile("./ChatStore.tsx", { zustand: { create } });
  const store = storeModule.useChatStore;
  store.getState().setSelectedChatId("group");
  const callbacks = [];
  const effects = [];
  const stateUpdates = [];
  const react = {
    useCallback: callback => { callbacks.push(callback); return callback; },
    useRef: current => ({ current }),
    useState: value => [value, next => stateUpdates.push(next)],
    useEffect: effect => effects.push(effect),
    useMemo: factory => factory(),
  };
  const hook = Object.assign(() => store.getState(), { getState: store.getState });
  const { ChatList } = compile("../app/[locale]/dashboard/chat/components/ChatList.tsx", {
    react, "react/jsx-runtime": { jsx: () => null, jsxs: () => null },
    "next-intl": { useLocale: () => "en" }, "./ChatBottomBar": {},
    "@/components/cards/MessageCard": {},
    "@/stores/ChatStore": { ...storeModule, useChatStore: hook },
    "@/components/auth-provider": { useAuth: () => ({ user: { _id: "tester" }, token: "test-only" }) },
    "@/app/lib/utils": { axiosInstance: request },
    "@/lib/safety-contract": { safetyCopy: { en: { error: "Retry", retry: "Retry" } } },
    "@/components/ui/button": {},
  });
  ChatList();
  return { store, fetch: callbacks[0], effects, stateUpdates };
}

test("failed older history preserves messages and enables retry", async () => {
  const app = setup(async () => { throw new Error("offline"); });
  app.store.getState().setMessages([{ _id: "visible", chat: "group" }]);
  await app.fetch(2, "older");
  assert.equal(app.store.getState().messages[0]._id, "visible");
  assert.ok(app.stateUpdates.includes(2));
});

test("initial history cannot discard a message received while the request was pending", async () => {
  let resolve;
  const app = setup(() => new Promise(done => { resolve = done; }));
  const pending = app.fetch(1, "initial");
  app.store.getState().addMessage({ _id: "live", chat: "group" });
  resolve({ data: { data: [{ _id: "older", chat: "group" }] } });
  await pending;
  assert.equal(app.store.getState().messages.map(m => m._id).join(), "older,live");
});

test("older history cannot revert a live edit", async () => {
  const app = setup(async () => ({ data: { data: [{ _id: "same", text: "outdated" }] } }));
  app.store.getState().setMessages([{ _id: "same", text: "edited" }]);
  await app.fetch(2, "older");
  assert.equal(app.store.getState().messages[0].text, "edited");
});

test("a response from a previous visit cannot overwrite the reopened conversation", async () => {
  let resolve;
  const app = setup(() => new Promise(done => { resolve = done; }));
  const pending = app.fetch(1, "initial");
  app.store.getState().setSelectedChatId("direct");
  app.store.getState().setSelectedChatId("group");
  app.store.getState().setMessages([{ _id: "current" }]);
  resolve({ data: { data: [{ _id: "stale" }] } });
  await pending;
  assert.equal(app.store.getState().messages[0]._id, "current");
});
