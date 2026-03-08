import { motion } from 'framer-motion';
import { climateFundData } from '@/data/mockEconomicData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stages = ['pledged', 'approved', 'contracted', 'released', 'deployed', 'verified'] as const;

const stageColors = [
  'bg-flow-stable/30', 'bg-flow-stable/50', 'bg-flow-warning/40',
  'bg-flow-warning/60', 'bg-flow-healthy/50', 'bg-flow-healthy/80',
];

// Co-financing leverage data
const leverageData = climateFundData.map(f => ({
  fund: f.fund.split(' ').slice(0, 2).join(' '),
  leverage: +(f.pledged / (f.deployed || 1)).toFixed(1),
  deployed: f.deployed,
  utilization: +((f.deployed / f.pledged) * 100).toFixed(1),
}));

// Geographic concentration (mock)
const geoConcentration = [
  { name: 'East Africa', value: 28, color: 'hsl(152, 60%, 45%)' },
  { name: 'South Asia', value: 24, color: 'hsl(210, 70%, 55%)' },
  { name: 'Latin America', value: 18, color: 'hsl(38, 92%, 50%)' },
  { name: 'Southeast Asia', value: 15, color: 'hsl(280, 60%, 55%)' },
  { name: 'West Africa', value: 10, color: 'hsl(0, 72%, 50%)' },
  { name: 'Pacific Islands', value: 5, color: 'hsl(180, 50%, 45%)' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="insight-card text-xs">
      <p className="font-medium text-foreground">{payload[0].payload.fund || payload[0].name}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey || p.name} className="flex justify-between gap-3">
          <span className="text-muted-foreground">{p.name}</span>
          <span className="font-mono text-foreground">{p.value}{typeof p.value === 'number' && p.dataKey === 'utilization' ? '%' : p.dataKey === 'leverage' ? 'x' : ''}</span>
        </div>
      ))}
    </div>
  );
};

export const ClimateFundPipeline = () => {
  return (
    <div className="section-panel">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Climate Fund Intelligence</h2>
        <p className="text-xs text-muted-foreground">Pipeline tracking · Co-financing leverage · Geographic concentration</p>
      </div>

      {/* Pipeline */}
      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-[140px_repeat(6,1fr)] gap-1.5 text-[10px] text-muted-foreground font-medium">
          <div>Fund</div>
          {stages.map((s) => (
            <div key={s} className="text-center capitalize">{s}</div>
          ))}
        </div>

        {climateFundData.map((fund, i) => {
          const maxVal = fund.pledged;
          return (
            <motion.div key={fund.fund} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="grid grid-cols-[140px_repeat(6,1fr)] gap-1.5 items-center group hover:bg-accent/30 rounded py-1 px-1 transition-colors"
            >
              <div className="text-[11px] text-foreground font-medium truncate">{fund.fund}</div>
              {stages.map((stage, si) => {
                const val = fund[stage];
                const pct = (val / maxVal) * 100;
                const dropoff = si > 0 ? Math.round(((fund[stages[si - 1]] - val) / fund[stages[si - 1]]) * 100) : 0;
                return (
                  <div key={stage} className="flex flex-col items-center gap-0.5">
                    <div className="w-full h-4 bg-secondary rounded-sm overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.06 + si * 0.05, duration: 0.5 }}
                        className={`h-full rounded-sm ${stageColors[si]}`}
                      />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="font-mono text-[9px] text-foreground">{val >= 1000 ? `${(val / 1000).toFixed(1)}B` : `${val}M`}</span>
                      {dropoff > 0 && <span className="text-[8px] text-critical font-mono">-{dropoff}%</span>}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* Co-financing Leverage + Geographic Concentration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Leverage Ratios */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Co-Financing Leverage Ratio</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={leverageData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis type="number" tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
              <YAxis type="category" dataKey="fund" tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 8 }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="leverage" fill="hsl(210, 70%, 55%)" opacity={0.7} name="Leverage (x)" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-1 space-y-0.5">
            {leverageData.map(l => (
              <div key={l.fund} className="flex items-center justify-between text-[9px]">
                <span className="text-muted-foreground">{l.fund}</span>
                <div className="flex gap-2">
                  <span className={`font-mono ${l.utilization > 50 ? 'text-healthy' : l.utilization > 25 ? 'text-warning' : 'text-critical'}`}>
                    {l.utilization}% utilized
                  </span>
                  <span className="font-mono text-foreground">{l.leverage}x leverage</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Concentration */}
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">Geographic Concentration</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={geoConcentration} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={55} strokeWidth={0}>
                  {geoConcentration.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.8} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              {geoConcentration.map(g => (
                <div key={g.name} className="flex items-center gap-2 text-[10px]">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }} />
                  <span className="text-foreground flex-1">{g.name}</span>
                  <span className="font-mono text-muted-foreground">{g.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 insight-card">
            <p className="text-[10px] text-warning">
              ⚠ HHI concentration index at 0.72 — top 3 regions absorb 70% of climate fund capital. Diversification needed.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 insight-card">
        <p className="text-[10px] text-warning">
          ⚠ Loss & Damage Fund: 97.5% of pledged capital remains undeployed. Verification at 0.6% of pledged amount.
        </p>
      </div>
    </div>
  );
};
