import * as Sentry from '@sentry/nextjs';

export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('../sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('../sentry.edge.config');
    }
  } catch (error) {
    // Log error but don't crash the app if Sentry initialization fails
    console.error('Failed to initialize Sentry:', error);
  }
}

export const onRequestError = Sentry.captureRequestError;
