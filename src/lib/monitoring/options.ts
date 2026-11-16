import { createBeforeSend } from './policy.cjs';

export const monitoringEnabled = process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true';
export const monitoringOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: monitoringEnabled,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development',
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  sampleRate: 1,
  maxBreadcrumbs: 0,
  // Omit tracing/replay/profiling sample rates entirely: even a zero rate can
  // install their integrations. No console/log forwarding in the free setup.
  dataCollection: {
    userInfo: false, cookies: false, httpHeaders: false, httpBodies: [],
    urlQueryParams: false, databaseQueryData: false, queues: false,
    stackFrameVariables: false, frameContextLines: 0,
    genAI: { inputs: false, outputs: false },
  },
  beforeSend: createBeforeSend(),
  beforeSendLog: () => null,
  beforeSendMetric: () => null,
  initialScope: { tags: { service: 'website' } },
};
