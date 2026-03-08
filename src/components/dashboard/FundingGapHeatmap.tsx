import { motion } from 'framer-motion';
import type { FundingGap } from '@/hooks/use-dashboard-data';

const columns = ['adaptation', 'biodiversity', 'food_systems', 'clean_energy', 'health_resilience'] as const;
const columnLabels: Record<typeof columns[number], string> = {
  adaptation: 'Adaptation',
  biodiversity: 'Biodiversity',
  food_systems: 'Food Systems',
  clean_energy: 'Clean Energy',
  health_resilience: 'Health Resilience',
};

const urgencyBadge = {
  low: 'bg-stable/10 text-stable',
  medium: 'bg-stable/10 text-stable',
  high: 'bg-warning/10 text-warning',
  critical: 'bg-critical/10 text-critical',
};

const getCellColor = (value: number) => {
  if (value >= 80) return 'bg-flow-critical/80';
  if (value >= 60) return 'bg-flow-warning/60';
  if (value >= 40) return 'bg-flow-warning/30';
  if (value >= 20) return 'bg-flow-healthy/20';
  return 'bg-flow-healthy/10';
};

const getCellText = (value: number) => {
  if (value >= 60) return 'text-foreground';
  return 'text-muted-foreground';
};

interface FundingGapHeatmapProps {
  fundingGaps: FundingGap[];
}

export const FundingGapHeatmap = ({ fundingGaps }: FundingGapHeatmapProps) => {
  return (
    <div className="section-panel">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Funding Gap Intelligence</h2>
        <p className="text-xs text-muted-foreground">Capital deficit by region and impact sector (% underfunded)</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium w-[220px]">Region</th>
              {columns.map((col) => (
                <th key={col} className="text-center py-2 px-2 text-muted-foreground font-medium">{columnLabels[col]}</th>
              ))}
              <th className="text-center py-2 px-2 text-muted-foreground font-medium">Urgency</th>
            </tr>
          </thead>
          <tbody>
            {fundingGaps.map((row, i) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-border/50 hover:bg-accent/50 transition-colors"
              >
                <td className="py-2 pr-4 text-foreground font-medium">{row.region}</td>
                {columns.map((col) => (
                  <td key={col} className="py-2 px-1 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-7 rounded ${getCellColor(row[col])} ${getCellText(row[col])}`}>
                      <span className="font-mono text-[11px]">{row[col]}%</span>
                    </div>
                  </td>
                ))}
                <td className="py-2 px-2 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${urgencyBadge[row.urgency]}`}>
                    {row.urgency}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
