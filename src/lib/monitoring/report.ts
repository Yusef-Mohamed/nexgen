import { isExpectedError, safeTags } from './policy.cjs';

type Reporter = (error: Error, tags: Record<string, string>) => void;
let reporter: Reporter | undefined;
const captured = new WeakSet<object>();
export function registerReporter(next: Reporter) { reporter = next; }
export function reportUnexpected(error: unknown, context: Record<string, unknown> = {}) {
  if (!reporter || isExpectedError(error)) return;
  const details = error as { errorId?: string; requestId?: string; status?: number; code?: string;
    isAxiosError?: boolean; response?: { status?: number; headers?: Record<string, string> } } | null;
  const status = details?.status ?? details?.response?.status;
  const errorId = details?.errorId ?? details?.response?.headers?.['x-error-id'];
  // A captured Backend exception owns this failure. Gateway/unreported failures
  // still get a client report; request IDs alone do not imply it was captured.
  if (status && status >= 500 && errorId && /^[a-f0-9]{32}$/i.test(errorId)) return;
  if (details?.isAxiosError && !details.response && ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'].includes(details.code || '')) return;
  if (error && typeof error === 'object') {
    if (captured.has(error)) return;
    captured.add(error);
  }
  try { reporter(error instanceof Error ? error : new Error('Unexpected failure'), safeTags({
    ...context, status, request_id: details?.requestId ?? details?.response?.headers?.['x-request-id'],
  })); }
  catch { /* Reporting must not break the user action. */ }
}
