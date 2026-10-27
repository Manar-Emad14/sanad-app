import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Sanad Dev ErrorBoundary] Uncaught error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  private handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  private handleHardReset = (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('sanad_notification_settings')
        localStorage.removeItem('sanad_focus_track_id')
        if ('caches' in window) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key))
          })
        }
      } catch (e) {
        console.warn('Reset error:', e)
      }
      window.location.href = '/'
    }
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const isArabic = typeof document !== 'undefined' ? document.documentElement.dir === 'rtl' : true

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100 font-sans">
          <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-extrabold text-white">
                {isArabic ? 'سند المُبرمج • استرداد آمن للواجهة' : 'Sanad Dev • Safe Recovery'}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isArabic
                  ? 'تم رصد استثناء غير متوقع أثناء تشغيل الواجهة. بياناتك ومواقيتك محفوظة بأمان.'
                  : 'An unexpected exception occurred during render. Your data and settings are safely preserved.'}
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-[11px] font-mono text-amber-300/90 overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isArabic ? 'إعادة تشغيل التطبيق' : 'Reload Application'}</span>
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                className="py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isArabic ? 'إعادة ضبط الكاش' : 'Clear Cache & Reset'}</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
