import test from 'node:test';
import assert from 'node:assert/strict';
import { isExpectedError, createBeforeSend } from '../src/lib/monitoring/policy.cjs';
const event = (handled = true) => ({
  event_id: 'a'.repeat(32), tags: { operation: 'chat.picker', private: 'DO_NOT_SEND' },
  user: { email: 'DO_NOT_SEND' }, request: { url: 'https://example.invalid/?token=DO_NOT_SEND', data: 'DO_NOT_SEND' },
  extra: { payload: 'DO_NOT_SEND' }, breadcrumbs: [{ message: 'DO_NOT_SEND' }],
  exception: { values: [{ type: 'TypeError', value: 'DO_NOT_SEND',
    mechanism: { type: 'generic', handled, data: { secret: 'DO_NOT_SEND' } },
    stacktrace: { frames: [{ filename: 'app:///src/test.ts', function: 'openPicker', lineno: 7,
      vars: { secret: 'DO_NOT_SEND' }, context_line: 'DO_NOT_SEND' }] },
  }] },
});
test('known validation/auth/cancellation is ignored; bugs and operational 500s survive', () => {
  for (const statusCode of [400, 401, 403, 404, 405, 406, 407, 409, 422, 429]) {
    assert.equal(isExpectedError({ statusCode, isOperational: true }), true);
  }
  assert.equal(isExpectedError({ statusCode: 500, isOperational: true }), false);
  assert.equal(isExpectedError({ name: 'TypeError', statusCode: 400 }), false);
  assert.equal(isExpectedError({ code: 'ERR_DOCUMENT_PICKER_CANCELED' }), true);
  assert.equal(isExpectedError({ code: 'ERR_MISSING_VIEW_CONTROLLER' }), false);
  for (const message of ['COMMENT_IMAGES_LIMIT', 'couponExceeded', 'couponWrongScope']) {
    assert.equal(isExpectedError(new Error(message)), true);
  }
});
test('outbound event has useful stack frames but no private error/context payloads', () => {
  const result = createBeforeSend()(event());
  assert.ok(result);
  assert.equal(JSON.stringify(result).includes('DO_NOT_SEND'), false);
  assert.equal(result.exception.values[0].stacktrace.frames[0].lineno, 7);
});
test('handled storms are bounded; fatal errors and distinct bugs remain reportable', () => {
  let now = 0;
  const beforeSend = createBeforeSend(() => now);
  for (let i = 0; i < 5; i++) assert.ok(beforeSend(event()));
  assert.equal(beforeSend(event()), null);
  assert.ok(beforeSend(event(false)));
  now = 300001;
  assert.ok(beforeSend(event()));
});
test('captured expected errors are filtered before transport', () => {
  assert.equal(createBeforeSend()(event(), { originalException: { name: 'ApiRequestError', status: 422 } }), null);
});
