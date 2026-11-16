import * as Sentry from '@sentry/nextjs';
import { monitoringEnabled, monitoringOptions } from './lib/monitoring/options';
import { registerReporter } from './lib/monitoring/report';

if (monitoringEnabled) {
  try {
    Sentry.init({ ...monitoringOptions, integrations: defaults => defaults.filter(integration =>
      !['Console', 'ConsoleLogs', 'LocalVariables', 'RequestData'].includes(integration.name)) });
    registerReporter((error, tags) => { Sentry.captureException(error, { tags }); });
  } catch {
    console.warn('Error monitoring could not initialize; application startup will continue.');
  }
}
