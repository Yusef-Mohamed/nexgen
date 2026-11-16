// Kept local to each independently deployed application. Never serialize raw errors,
// request bodies, query keys, auth state, or arbitrary context into telemetry.
const expectedCodes = new Set([
  'ACCOUNT_INACTIVE', 'IDENTITY_VERIFICATION_REQUIRED', 'EMAIL_VERIFICATION_REQUIRED',
  'CHAT_AUTH_REQUIRED', 'CHAT_MEMBERSHIP_REQUIRED', 'CHAT_RATE_LIMITED',
  'ERR_CANCELED', 'ERR_DOCUMENT_PICKER_CANCELED', 'SIGN_IN_CANCELLED',
  'COMMENT_IMAGES_LIMIT', 'couponExceeded', 'couponWrongScope',
]);
function isExpectedError(error) {
  if (!error || typeof error !== 'object') return false;
  if (expectedCodes.has(error.code) || expectedCodes.has(error.message)) return true;
  if (['AbortError', 'CanceledError', 'JsonWebTokenError', 'TokenExpiredError'].includes(error.name)) return true;
  if (error.name === 'ApiRequestError' && ['network', 'timeout', 'cancelled'].includes(error.reason)) return true;
  const status = Number(error.statusCode ?? error.status ?? error.response?.status);
  // Only known API/operational responses are treated as expected client errors.
  // A programming exception with a 4xx property is still a bug.
  return status >= 400 && status < 500 &&
    (error.isOperational === true || error.name === 'ApiRequestError' || error.isAxiosError === true);
}
function label(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9_.:/()\[\]-]{1,120}$/.test(value) ? value : undefined;
}
function safeTags(input = {}) {
  const result = {};
  for (const key of ['service', 'operation', 'route', 'method', 'status', 'code', 'locale']) {
    const value = label(String(input[key] ?? ''));
    if (value) result[key] = value;
  }
  if (typeof input.request_id === 'string' && /^[a-f0-9-]{36}$/i.test(input.request_id)) result.request_id = input.request_id;
  return result;
}
function safeFilename(value) {
  if (typeof value !== 'string') return undefined;
  const file = value.replace(/\\/g, '/').split(/[?#]/)[0];
  // Keep bundle URLs/Debug IDs usable, but discard local user-directory prefixes.
  return file.replace(/^.*\/(Users|home)\/[^/]+\//i, 'app:///').slice(0, 300);
}
function sanitizeEvent(event) {
  const tags = safeTags(event.tags);
  const clean = {};
  for (const key of ['event_id', 'timestamp', 'platform', 'level', 'release', 'dist', 'environment', 'sdk', 'debug_meta']) {
    if (event[key] !== undefined) clean[key] = event[key];
  }
  clean.tags = tags;
  clean.exception = { values: (event.exception?.values || []).map(value => ({
    type: label(value.type) || 'Error',
    // Error messages can embed emails, chat text, provider responses, or file paths.
    value: `${label(value.type) || 'Error'} in ${tags.operation || 'application'}`,
    ...(value.mechanism ? { mechanism: {
      type: label(value.mechanism.type) || 'generic', handled: value.mechanism.handled !== false,
    } } : {}),
    ...(value.stacktrace ? { stacktrace: { frames: (value.stacktrace.frames || []).map(frame => ({
      filename: safeFilename(frame.filename), function: label(frame.function),
      lineno: frame.lineno, colno: frame.colno, in_app: frame.in_app,
    })) } } : {}),
  })) };
  if (!clean.exception.values.length) return null;
  // Device/build details are useful; identities, OS usernames and arbitrary contexts are not.
  clean.contexts = {};
  for (const [name, keys] of Object.entries({
    os: ['name', 'version'], browser: ['name', 'version'],
    device: ['manufacturer', 'model', 'family', 'arch', 'simulator'],
    app: ['app_version', 'app_build', 'app_identifier'], runtime: ['name', 'version'],
  })) {
    if (!event.contexts?.[name]) continue;
    clean.contexts[name] = Object.fromEntries(keys.filter(key =>
      ['string', 'boolean', 'number'].includes(typeof event.contexts[name][key]),
    ).map(key => [key, event.contexts[name][key]]));
  }
  return clean;
}
function createBeforeSend(clock = Date.now) {
  const recent = new Map();
  return (event, hint = {}) => {
    const fatal = event.level === 'fatal' || event.exception?.values?.some(value => value.mechanism?.handled === false);
    if (!fatal && isExpectedError(hint.originalException)) return null;
    const clean = sanitizeEvent(event);
    if (!clean || fatal) return clean;
    const key = JSON.stringify([clean.tags.operation, clean.exception]);
    const now = clock();
    let bucket = recent.get(key);
    if (!bucket || now - bucket.started >= 300000) {
      if (recent.size >= 100) recent.delete(recent.keys().next().value);
      bucket = { started: now, count: 0 };
      recent.set(key, bucket);
    }
    // Preserve five occurrences per window to reduce handled-error storms.
    // This is not a monthly quota cap. Unhandled exceptions bypass this limiter.
    return ++bucket.count <= 5 ? clean : null;
  };
}
module.exports = { isExpectedError, safeTags, sanitizeEvent, createBeforeSend };
