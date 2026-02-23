declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void
    umami?: {
      track?: (event: string, data?: Record<string, string | number | boolean>) => void
    }
  }
}

type AnalyticsProps = Record<string, string | number | boolean>

export function trackEvent(eventName: string, props?: AnalyticsProps) {
  if (typeof window === 'undefined') return

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, props ? { props } : undefined)
    return
  }

  if (window.umami?.track) {
    window.umami.track(eventName, props)
  }
}
