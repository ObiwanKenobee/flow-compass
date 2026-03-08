import { motion } from 'framer-motion';
import { climateFundData } from '@/data/mockEconomicData';

const stages = ['pledged', 'approved', 'contracted', 'released', 'deployed', 'verified'] as const;

const stageColors = [
  'bg-flow-stable/30',
  'bg-flow-stable/50',
  'bg-flow-warning/40',
  'bg-flow-warning/60',
  'bg-flow-healthy/50',
  'bg-flow-healthy/80',
];

export const ClimateFundPipeline = () => {
  return (
    <div className="section-panel">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Climate Fund Pipeline</h2>
        <p className="text-xs text-muted-foreground">Capital movement: Pledged → Approved → Contracted → Released → Deployed → Verified ($M)</p>
      </div>

      <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-[180px_repeat(6,1fr)] gap-2 text-[10px] text-muted-foreground font-medium">
          <div>Fund</div>
          {stages.map((s) => (
            <div key={s} className="text-center capitalize">{s}</div>
          ))}
        </div>

        {climateFundData.map((fund, i) => {
          const maxVal = fund.pledged;
          return (
            <motion.div
              key={fund.fund}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-[180px_repeat(6,1fr)] gap-2 items-center group hover:bg-accent/30 rounded py-1.5 px-1 transition-colors"
            >
              <div className="text-xs text-foreground font-medium truncate">{fund.fund}</div>
              {stages.map((stage, si) => {
                const val = fund[stage];
                const pct = (val / maxVal) * 100;
                const dropoff = si > 0 ? Math.round(((fund[stages[si - 1]] - val) / fund[stages[si - 1]]) * 100) : 0;
                return (
                  <div key={stage} className="flex flex-col items-center gap-0.5">
                    <div className="w-full h-5 bg-secondary rounded-sm overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.06 + si * 0.05, duration: 0.5 }}
                        className={`h-full rounded-sm ${stageColors[si]}`}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[10px] text-foreground">{val >= 1000 ? `${(val / 1000).toFixed(1)}B` : `${val}M`}</span>
                      {dropoff > 0 && (
                        <span className="text-[9px] text-critical font-mono">-{dropoff}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border">
        <div className="insight-card">
          <p className="text-xs text-warning">
            ⚠ Loss & Damage Fund: 97.5% of pledged capital remains undeployed. Verification at 0.6% of pledged amount.
          </p>
        </div>
      </div>
    </div>
  );
};
