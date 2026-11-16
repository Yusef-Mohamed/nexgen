/* eslint-disable @typescript-eslint/no-require-imports -- standalone Node CommonJS smoke test */
// Tests the Next.js server SDK and privacy policy, without starting the website.
const Sentry = require('@sentry/nextjs');
const { createBeforeSend } = require('../src/lib/monitoring/policy.cjs');
if (!process.env.NEXT_PUBLIC_SENTRY_DSN) throw new Error('Set NEXT_PUBLIC_SENTRY_DSN first.');
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, environment: 'monitoring-test',
  defaultIntegrations: false, maxBreadcrumbs: 0,
  beforeSend: createBeforeSend(), beforeSendLog: () => null, beforeSendMetric: () => null,
});
const id = Sentry.captureException(new Error('Synthetic monitoring test'), {
  tags: { service: 'website', operation: 'monitoring.smoke' },
});
Sentry.flush(3000).then(() => {
  console.log('Submitted synthetic event:', id);
  console.log('Verify receipt in Sentry; flush alone does not prove ingestion.');
});
