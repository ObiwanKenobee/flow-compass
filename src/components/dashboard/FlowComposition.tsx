import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { flowTimeSeriesData, sankeyData } from '@/data/mockEconomicData';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="insight-card text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono text-foreground">${p.value}M</span>
        </div>
      ))}
    </div>
  );
};

// Simple Sankey-like visualization
const SankeySimple = () => {
  const sources = useMemo(() => {
    const unique = [...new Set(sankeyData.filter(d => ['Sovereign Climate Fund', 'DFI Capital', 'Philanthropy', 'Carbon Markets', 'Private Capital'].includes(d.source)).map(d => d.source))];
    return unique;
  }, []);

  const destinations = useMemo(() => {
    const unique = [...new Set(sankeyData.filter(d => ['East Africa', 'West Africa', 'South Asia', 'Southeast Asia', 'Latin America', 'Pacific Islands'].includes(d.target)).map(d => d.target))];
    return unique;
  }, []);

  const sourceColors = ['hsl(152, 60%, 45%)', 'hsl(210, 70%, 55%)', 'hsl(38, 92%, 50%)', 'hsl(280, 60%, 55%)', 'hsl(180, 50%, 45%)'];
  const sourceValues = sources.map(s => sankeyData.filter(d => d.source === s).reduce((acc, d) => acc + d.value, 0));
  const destValues = destinations.map(d => sankeyData.filter(l => l.target === d).reduce((acc, l) => acc + l.value, 0));
  const totalValue = sourceValues.reduce((a, b) => a + b, 0);

  return (
    <div className="mt-4">
      <h3 className="text-xs font-medium text-muted-foreground mb-3">Capital Flow Composition</h3>
      <div className="flex justify-between items-start gap-4">
        {/* Sources */}
        <div className="flex flex-col gap-1 w-[140px]">
          <span className="text-[9px] text-muted-foreground mb-1">SOURCES</span>
          {sources.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-1.5"
            >
              <div
                className="h-5 rounded-sm"
                style={{
                  width: `${(sourceValues[i] / totalValue) * 100}%`,
                  minWidth: 8,
                  backgroundColor: sourceColors[i],
                  opacity: 0.7,
                }}
              />
              <span className="text-[9px] text-muted-foreground whitespace-nowrap">{s}</span>
            </motion.div>
          ))}
        </div>

        {/* Flow indicator */}
        <div className="flex-1 flex items-center justify-center">
          <svg width="60" height="80" className="opacity-30">
            <path d="M 5 10 Q 30 40 55 10" fill="none" stroke="hsl(152, 60%, 45%)" strokeWidth="1" strokeDasharray="3 3" className="animate-flow" />
            <path d="M 5 30 Q 30 50 55 30" fill="none" stroke="hsl(210, 70%, 55%)" strokeWidth="1" strokeDasharray="3 3" className="animate-flow" />
            <path d="M 5 50 Q 30 60 55 50" fill="none" stroke="hsl(38, 92%, 50%)" strokeWidth="1" strokeDasharray="3 3" className="animate-flow" />
            <path d="M 5 70 Q 30 70 55 70" fill="none" stroke="hsl(280, 60%, 55%)" strokeWidth="1" strokeDasharray="3 3" className="animate-flow" />
          </svg>
        </div>

        {/* Destinations */}
        <div className="flex flex-col gap-1 w-[140px]">
          <span className="text-[9px] text-muted-foreground mb-1">DESTINATIONS</span>
          {destinations.map((d, i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-1.5 flex-row-reverse"
            >
              <div
                className="h-5 rounded-sm bg-primary/60"
                style={{
                  width: `${(destValues[i] / Math.max(...destValues)) * 100}%`,
                  minWidth: 8,
                }}
              />
              <span className="text-[9px] text-muted-foreground whitespace-nowrap">{d}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FlowComposition = () => {
  return (
    <div className="section-panel">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Flow Composition Over Time</h2>
        <p className="text-xs text-muted-foreground">Capital channel diversification — stacked by instrument type</p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={flowTimeSeriesData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
          <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10 }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
          <YAxis tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="debt" stackId="1" stroke="hsl(210, 70%, 55%)" fill="hsl(210, 70%, 55%)" fillOpacity={0.4} name="Debt Instruments" />
          <Area type="monotone" dataKey="carbon" stackId="1" stroke="hsl(152, 60%, 45%)" fill="hsl(152, 60%, 45%)" fillOpacity={0.4} name="Carbon Finance" />
          <Area type="monotone" dataKey="grants" stackId="1" stroke="hsl(38, 92%, 50%)" fill="hsl(38, 92%, 50%)" fillOpacity={0.3} name="Philanthropic Grants" />
          <Area type="monotone" dataKey="microfinance" stackId="1" stroke="hsl(280, 60%, 55%)" fill="hsl(280, 60%, 55%)" fillOpacity={0.3} name="Microfinance" />
          <Area type="monotone" dataKey="credits" stackId="1" stroke="hsl(180, 50%, 45%)" fill="hsl(180, 50%, 45%)" fillOpacity={0.3} name="Ecosystem Credits" />
          <Area type="monotone" dataKey="insurance" stackId="1" stroke="hsl(340, 60%, 50%)" fill="hsl(340, 60%, 50%)" fillOpacity={0.3} name="Resilience Insurance" />
        </AreaChart>
      </ResponsiveContainer>

      <SankeySimple />
    </div>
  );
};
