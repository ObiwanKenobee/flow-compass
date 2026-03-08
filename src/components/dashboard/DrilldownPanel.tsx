import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, MapPin, TrendingUp, TrendingDown, Shield, AlertTriangle } from 'lucide-react';
import type { DrilldownData } from '@/data/mockExtendedData';

interface DrilldownPanelProps {
  data: DrilldownData | null;
  onClose: () => void;
}

const statusDot = {
  healthy: 'bg-healthy',
  warning: 'bg-warning',
  critical: 'bg-critical',
};

export const DrilldownPanel = ({ data, onClose }: DrilldownPanelProps) => {
  return (
    <AnimatePresence>
      {data && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border px-5 py-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    {data.type}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-foreground">{data.title}</h2>
                {data.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{data.subtitle}</p>}
              </div>
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 py-4 space-y-5">
              {/* Metrics Grid */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-2">
                  {data.metrics.map((m) => (
                    <div key={m.label} className="kpi-card py-2.5 px-3">
                      <span className="text-[10px] text-muted-foreground">{m.label}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {m.status && <span className={`w-1.5 h-1.5 rounded-full ${statusDot[m.status]}`} />}
                        <span className="font-mono text-sm text-foreground">{m.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {data.description && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Analysis</h3>
                  <p className="text-xs text-foreground/80 leading-relaxed">{data.description}</p>
                </div>
              )}

              {/* Sectors */}
              {data.sectors && data.sectors.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Sectors</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {data.sectors.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-1 bg-secondary text-secondary-foreground rounded-md">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Dashboards */}
              {data.linkedDashboards && data.linkedDashboards.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Connected Intelligence</h3>
                  <div className="space-y-1">
                    {data.linkedDashboards.map((d) => (
                      <button key={d} className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-secondary/50 hover:bg-accent transition-colors text-xs text-foreground">
                        <span>{d}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Indicators */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Risk Signals</h3>
                <div className="space-y-2">
                  <div className="insight-card flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-foreground/80">Verification backlog detected — average lag exceeds 60 days for this {data.type}.</p>
                  </div>
                  <div className="insight-card flex items-start gap-2">
                    <Shield className="w-3.5 h-3.5 text-healthy mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-foreground/80">Data provenance: 3 independent sources confirmed. Last audit: 14 days ago.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
