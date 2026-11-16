export function isExpectedError(error: unknown): boolean;
export function safeTags(context?: Record<string, unknown>): Record<string, string>;
export function sanitizeEvent<T>(event: T): T | null;
export function createBeforeSend(clock?: () => number): <T>(event: T, hint?: { originalException?: unknown }) => T | null;
