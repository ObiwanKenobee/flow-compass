import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { KpiData } from '@/data/mockEconomicData';

const statusColors = {
  healthy: 'border-healthy\/30 glow-healthy',
  warning: 'border-warning\/30 glow-warning',
  critical: 'border-critical\/30 glow-critical',
  stable: 'border-l-flow-stable',
};

const badgeColors = {
  healthy: 'bg-healthy\/10 text-healthy',
  warning: 'bg-warning\/10 text-warning',
  critical: 'bg-critical\/10 text-critical',
  stable: 'bg-stable\/10 text-stable',
};

const Sparkline = ({ data, status }: { data: number[]; status: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 80;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');

  const strokeColor = status === 'critical' ? 'hsl(0, 72%, 50%)' : status === 'warning' ? 'hsl(38, 92%, 50%)' : 'hsl(152, 60%, 45%)';

  return (
    <svg width={w} height={h} className="opacity-60">
      <polyline fill="none" stroke={strokeColor} strokeWidth="1.5" points={points} />
    </svg>
  );
};

export const KpiCard = ({ data, index }: { data: KpiData; index: number }) => {
  const isPositiveDelta = data.deltaDirection === 'up';
  const deltaIsGood = (data.status === 'healthy' && isPositiveDelta) || (data.status !== 'critical');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`kpi-card ${statusColors[data.status]} border-l-2 flex flex-col gap-2 min-w-[200px]`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-muted-foreground leading-tight">{data.label}</span>
        {data.badge && (
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${badgeColors[data.status]}`}>
            {data.badge}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-xl font-semibold text-foreground">{data.value}</div>
          <div className={`flex items-center gap-1 text-xs font-mono ${deltaIsGood ? 'text-healthy' : 'text-critical'}`}>
            {isPositiveDelta ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {data.delta}
          </div>
        </div>
        <Sparkline data={data.sparkline} status={data.status} />
      </div>

      <div className="flex items-center gap-1 mt-1">
        <div className="h-1 flex-1 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/60"
            style={{ width: `${data.confidence}%` }}
          />
        </div>
        <span className="text-[9px] text-muted-foreground font-mono">{data.confidence}%</span>
      </div>
    </motion.div>
  );
};
