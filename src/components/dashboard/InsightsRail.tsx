import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Shield, Lightbulb, RefreshCw, Sparkles } from 'lucide-react';
import { insightsData, type InsightData } from '@/data/mockEconomicData';
import type { AiInsight } from '@/hooks/use-ai-insights';

const typeConfig: Record<InsightData['type'], { icon: typeof AlertTriangle; color: string; bg: string }> = {
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  opportunity: { icon: Lightbulb, color: 'text-healthy', bg: 'bg-healthy/10' },
  risk: { icon: Shield, color: 'text-critical', bg: 'bg-critical/10' },
  trend: { icon: TrendingUp, color: 'text-stable', bg: 'bg-stable/10' },
};

interface InsightsRailProps {
  aiInsights?: AiInsight[];
  aiLoading?: boolean;
  onRefresh?: () => void;
}

export const InsightsRail = ({ aiInsights = [], aiLoading = false, onRefresh }: InsightsRailProps) => {
  const [showAi, setShowAi] = useState(false);
  
  // Switch to AI tab when insights arrive
  useEffect(() => {
    if (aiInsights.length > 0) setShowAi(true);
  }, [aiInsights.length]);

  const displayInsights = showAi && aiInsights.length > 0
    ? aiInsights.map(ai => ({ ...ai, sources: ai.sources || [] }))
    : insightsData;

  return (
    <div className="section-panel">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">AI Intelligence Feed</h2>
          <p className="text-xs text-muted-foreground">
            {showAi ? 'AI-generated from live data' : 'Machine-generated, auditable insights'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-secondary rounded-md p-0.5">
            <button onClick={() => setShowAi(false)}
              className={`px-2 py-0.5 text-[9px] rounded-sm transition-all ${!showAi ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              Static
            </button>
            <button onClick={() => setShowAi(true)}
              className={`px-2 py-0.5 text-[9px] rounded-sm transition-all flex items-center gap-1 ${showAi ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              <Sparkles className="w-2.5 h-2.5" /> AI
            </button>
          </div>
          {onRefresh && (
            <button onClick={onRefresh} disabled={aiLoading}
              className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground disabled:opacity-50">
              <RefreshCw className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse-glow" />
            <span className="text-[10px] text-muted-foreground font-mono">{displayInsights.length} active</span>
          </div>
        </div>
      </div>

      {aiLoading && showAi ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <p className="text-xs text-muted-foreground">Generating AI insights from live data...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayInsights.map((insight, i) => {
            const config = typeConfig[insight.type] || typeConfig.trend;
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
                        <p className="text-[10px] text-primary/80">→ {insight.action}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
