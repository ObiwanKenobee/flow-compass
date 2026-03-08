import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Shield, Lightbulb } from 'lucide-react';
import { insightsData, type InsightData } from '@/data/mockEconomicData';

const typeConfig: Record<InsightData['type'], { icon: typeof AlertTriangle; color: string; bg: string }> = {
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning\/10' },
  opportunity: { icon: Lightbulb, color: 'text-healthy', bg: 'bg-healthy\/10' },
  risk: { icon: Shield, color: 'text-critical', bg: 'bg-critical\/10' },
  trend: { icon: TrendingUp, color: 'text-stable', bg: 'bg-stable\/10' },
};

export const InsightsRail = () => {
  return (
    <div className="section-panel">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Intelligence Feed</h2>
          <p className="text-xs text-muted-foreground">Machine-generated, auditable insights</p>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse-glow" />
          <span className="text-[10px] text-muted-foreground font-mono">5 active</span>
        </div>
      </div>

      <div className="space-y-3">
        {insightsData.map((insight, i) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="insight-card group hover:border-primary/20 transition-colors"
            >
              <div className="flex gap-2.5">
                <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${config.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{insight.text}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-12 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary/60 rounded-full" style={{ width: `${insight.confidence}%` }} />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground">{insight.confidence}%</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">
                      {insight.sources.join(' · ')}
                    </span>
                  </div>

                  {insight.action && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-[10px] text-primary/80">
                        → {insight.action}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
