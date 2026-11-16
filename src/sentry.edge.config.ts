import * as Sentry from '@sentry/nextjs';
import { monitoringEnabled, monitoringOptions } from './lib/monitoring/options';

if (monitoringEnabled) {
  try { Sentry.init(monitoringOptions); }
  catch { console.warn('Error monitoring could not initialize; application startup will continue.'); }
}
