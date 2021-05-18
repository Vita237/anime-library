import type {IPageViewTelemetry} from '@microsoft/applicationinsights-web';
import {ApplicationInsights} from '@microsoft/applicationinsights-web';

let appInsights: ApplicationInsights | null = null;

const TRACKING_ENABLED = !!import.meta.env.VITE_APPLICATION_INSIGHTS;

function getTracker() {
  if (appInsights !== null) {
    return appInsights;
  }

  appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: import.meta.env.VITE_APPLICATION_INSIGHTS,
      enableDebug: import.meta.env.MODE === 'development',
    },
  });

  appInsights.loadAppInsights();

  return appInsights;
}

export function trackPageView(options?: IPageViewTelemetry) {
  if (TRACKING_ENABLED) {
    getTracker().trackPageView(options);
  }
}
