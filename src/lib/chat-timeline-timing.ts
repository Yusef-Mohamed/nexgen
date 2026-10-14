// Bounded, memory-only diagnostics. No account/message IDs, text, URLs or tokens
// are included in exported samples. Keys are used only for local correlation.
type Stage = 'tap' | 'navigation' | 'request' | 'response' | 'first-message';
type Source = 'push' | 'inbox' | 'conversation';
type Trace = { sequence: number; source: Source; started: number; stages: Partial<Record<Stage, number>>; rows?: number };
const active = new Map<string, Trace>(), completed: Omit<Trace, 'started'>[] = [];
const requests: { mode: string; duration: number }[] = [];
function publishDiagnostics() {
  if (typeof document !== 'undefined' && process.env.NEXT_PUBLIC_CHAT_TIMING === 'true') {
    document.documentElement.dataset.chatDiagnostics = JSON.stringify({ traces: getChatTimings(), requests });
  }
}
export function recordChatRequest(mode: 'around' | 'before' | 'after' | 'latest' | 'sync', started: number) {
  requests.push({ mode, duration: Math.round((performance.now() - started) * 10) / 10 });
  if (requests.length > 100) requests.shift();
  publishDiagnostics();
}
let sequence = 0;
export function startChatTiming(key: string, source: Source) {
  active.set(key, { sequence: ++sequence, source, started: performance.now(), stages: source === 'conversation' ? {} : { tap: 0 } });
  if (active.size > 5) active.delete(active.keys().next().value!);
}
export function markChatTiming(key: string, stage: Stage, rows?: number) {
  if (!active.has(key)) {
    if (stage !== 'navigation') return;
    startChatTiming(key, 'conversation');
  }
  const trace = active.get(key)!;
  if (stage === 'first-message' && trace.stages.navigation === undefined) return;
  trace.stages[stage] ??= Math.round((performance.now() - trace.started) * 10) / 10;
  if (stage === 'first-message') {
    completed.push({ sequence: trace.sequence, source: trace.source, stages: { ...trace.stages }, rows });
    if (completed.length > 100) completed.shift();
    active.delete(key);
    publishDiagnostics();
  }
}
export function getChatTimings() { return completed.map(sample => ({ ...sample, stages: { ...sample.stages } })); }
export function clearChatTimings() { active.clear(); completed.length = 0; requests.length = 0; publishDiagnostics(); }
