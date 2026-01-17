// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

try {
  Sentry.init({
    dsn: "https://60bc0710689f5a329b882177ac29e698@o4510155459002369.ingest.de.sentry.io/4510155462541392",

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
} catch (error) {
  // Log error but don't crash if Sentry initialization fails
  console.error('Failed to initialize Sentry edge config:', error);
}
