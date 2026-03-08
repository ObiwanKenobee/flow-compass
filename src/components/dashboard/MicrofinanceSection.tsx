import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { microfinanceData, disbursementFunnel, cohortPerformance } from '@/data/mockExtendedData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="insight-card text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-3">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono text-foreground">{p.value}{typeof p.value === 'number' && p.dataKey === 'defaultRate' ? '%' : p.dataKey === 'impactScore' ? '' : 'M'}</span>
        </div>
      ))}
    </div>
  );
};

const LendingDensityMap = () => (
  <div>
    <h3 className="text-xs font-medium text-muted-foreground mb-3">Geographic Lending Density</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {microfinanceData.map((m, i) => (
        <motion.div
          key={m.region}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="kpi-card"
        >
          <div className="text-xs font-medium text-foreground mb-1.5">{m.region}</div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Loans</span>
              <span className="font-mono text-foreground">{m.activeLoans.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Size</span>
              <span className="font-mono text-foreground">${m.avgLoanSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Repayment</span>
              <span className={`font-mono ${m.repaymentRate >= 90 ? 'text-healthy' : m.repaymentRate >= 85 ? 'text-warning' : 'text-critical'}`}>
                {m.repaymentRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Women</span>
              <span className="font-mono text-foreground">{m.womenBorrowers}%</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {m.resilienceLinked && (
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-healthy/10 text-healthy">Resilience-Linked</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const DisbursementFunnelChart = () => (
  <div>
    <h3 className="text-xs font-medium text-muted-foreground mb-3">Disbursement Pipeline ($M)</h3>
    <div className="space-y-1.5">
      {disbursementFunnel.map((stage, i) => {
        const dropoff = i > 0 ? disbursementFunnel[i - 1].pct - stage.pct : 0;
        return (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3"
          >
            <span className="text-[10px] text-muted-foreground w-24 text-right">{stage.stage}</span>
            <div className="flex-1 h-6 bg-secondary rounded-sm overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stage.pct}%` }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`h-full rounded-sm ${stage.pct > 70 ? 'bg-flow-healthy/60' : stage.pct > 50 ? 'bg-flow-warning/50' : 'bg-flow-critical/50'}`}
              />
            </div>
            <div className="flex items-center gap-2 w-20">
              <span className="font-mono text-xs text-foreground">${stage.value}M</span>
              {dropoff > 0 && <span className="text-[9px] font-mono text-critical">-{dropoff.toFixed(1)}%</span>}
            </div>
          </motion.div>
        );
      })}
    </div>
    <div className="mt-3 insight-card">
      <p className="text-[10px] text-warning">⚠ Only 38.5% of committed capital reaches impact verification — 61.5% leaks or stalls in the pipeline.</p>
    </div>
  </div>
);

const CohortChart = () => (
  <div>
    <h3 className="text-xs font-medium text-muted-foreground mb-3">Cohort Performance</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={cohortPerformance} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
        <XAxis dataKey="cohort" tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 9 }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
        <YAxis tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="disbursed" stroke="hsl(210, 70%, 55%)" strokeWidth={2} dot={{ r: 3 }} name="Disbursed" />
        <Line type="monotone" dataKey="repaid" stroke="hsl(152, 60%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Repaid" />
        <Line type="monotone" dataKey="defaultRate" stroke="hsl(0, 72%, 50%)" strokeWidth={1.5} dot={{ r: 3 }} name="Default Rate" />
      </LineChart>
    </ResponsiveContainer>
    <div className="mt-2 insight-card">
      <p className="text-[10px] text-critical">⚠ Default rates rising since Q4 2024 — correlates with climate shock frequency increase in South Asia & East Africa.</p>
    </div>
  </div>
);

export const MicrofinanceSection = () => {
  return (
    <div className="section-panel">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-foreground">Microfinance Flows</h2>
        <p className="text-xs text-muted-foreground">Local capital circulation into communities — lending density, pipeline health, cohort trends</p>
      </div>

      <div className="space-y-6">
        <LendingDensityMap />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DisbursementFunnelChart />
          <CohortChart />
        </div>
      </div>
    </div>
  );
};
