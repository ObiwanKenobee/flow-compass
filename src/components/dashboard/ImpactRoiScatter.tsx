import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { impactProjects, type ImpactProject } from '@/data/mockEconomicData';
import type { DrilldownData } from '@/data/mockExtendedData';

const riskColors = {
  low: 'hsl(152, 60%, 45%)',
  medium: 'hsl(38, 92%, 50%)',
  high: 'hsl(0, 72%, 50%)',
};

interface ImpactRoiScatterProps {
  onDrilldown?: (data: DrilldownData) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="insight-card text-xs max-w-[200px]">
      <p className="font-semibold text-foreground mb-1">{d.name}</p>
      <div className="space-y-0.5 text-muted-foreground">
        <p>Financial Return: <span className="font-mono text-foreground">{d.financialReturn}%</span></p>
        <p>Impact Return: <span className="font-mono text-foreground">{d.impactReturn}</span></p>
        <p>Capital: <span className="font-mono text-foreground">${d.capitalDeployed}M</span></p>
        <p>Region: {d.region}</p>
        <p>Verified: {d.verified ? '✓ Yes' : '✗ No'}</p>
      </div>
      <p className="text-[9px] text-primary mt-1">Click for full analysis →</p>
    </div>
  );
};

const buildProjectDrilldown = (p: ImpactProject): DrilldownData => ({
  type: 'project',
  id: p.name,
  title: p.name,
  subtitle: `${p.region} · ${p.sector}`,
  metrics: [
    { label: 'Financial Return', value: `${p.financialReturn}%`, status: p.financialReturn > 8 ? 'healthy' : p.financialReturn > 5 ? 'warning' : 'critical' },
    { label: 'Impact Score', value: `${p.impactReturn}`, status: p.impactReturn > 8 ? 'healthy' : p.impactReturn > 6 ? 'warning' : 'critical' },
    { label: 'Capital Deployed', value: `$${p.capitalDeployed}M` },
    { label: 'Risk Tier', value: p.riskTier, status: p.riskTier === 'low' ? 'healthy' : p.riskTier === 'medium' ? 'warning' : 'critical' },
    { label: 'Verification', value: p.verified ? 'Verified' : 'Unverified', status: p.verified ? 'healthy' : 'warning' },
    { label: 'Combined Score', value: `${(p.financialReturn + p.impactReturn).toFixed(1)}` },
  ],
  sectors: [p.sector, p.region],
  description: p.impactReturn > 8
    ? `${p.name} is a high-impact project delivering ${p.impactReturn} impact score with ${p.financialReturn}% financial return. Capital of $${p.capitalDeployed}M is well-deployed across ${p.sector} in ${p.region}.`
    : `${p.name} shows moderate performance. Consider rebalancing capital allocation or strengthening verification pipelines.`,
  linkedDashboards: ['Regenerative Impact Dashboard', 'Regional Risk Intelligence', 'Verification Pipeline'],
});

export const ImpactRoiScatter = ({ onDrilldown }: ImpactRoiScatterProps) => {
  const handleClick = (data: any) => {
    if (onDrilldown && data) {
      onDrilldown(buildProjectDrilldown(data));
    }
  };

  return (
    <div className="section-panel">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Impact-Adjusted ROI</h2>
        <p className="text-xs text-muted-foreground">Financial return vs impact return · Bubble size = capital deployed · Click for details</p>
      </div>

      <div className="flex gap-3 mb-3 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: riskColors.low }} /> Low Risk</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: riskColors.medium }} /> Medium Risk</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: riskColors.high }} /> High Risk</span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
          <XAxis type="number" dataKey="financialReturn" name="Financial Return" unit="%"
            tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'hsl(220, 15%, 18%)' }}
            label={{ value: 'Financial Return %', position: 'bottom', fill: 'hsl(215, 15%, 50%)', fontSize: 10 }}
          />
          <YAxis type="number" dataKey="impactReturn" name="Impact Return"
            tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'hsl(220, 15%, 18%)' }}
            label={{ value: 'Impact Score', angle: -90, position: 'insideLeft', fill: 'hsl(215, 15%, 50%)', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={impactProjects} onClick={handleClick} cursor="pointer">
            {impactProjects.map((entry, index) => (
              <Cell key={index} fill={riskColors[entry.riskTier]} opacity={entry.verified ? 0.8 : 0.4}
                r={Math.sqrt(entry.capitalDeployed) * 1.5} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Leaderboard */}
      <div className="mt-4 border-t border-border pt-3">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">Top Projects by Combined Score</h3>
        <div className="space-y-1">
          {[...impactProjects]
            .sort((a, b) => (b.financialReturn + b.impactReturn) - (a.financialReturn + a.impactReturn))
            .slice(0, 5)
            .map((p, i) => (
              <div
                key={p.name}
                onClick={() => onDrilldown?.(buildProjectDrilldown(p))}
                className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground w-4">{i + 1}</span>
                  <span className="text-foreground">{p.name}</span>
                  {!p.verified && <span className="text-[9px] px-1 rounded bg-warning/10 text-warning">Unverified</span>}
                </div>
                <div className="flex gap-3 font-mono text-[11px]">
                  <span className="text-healthy">{p.impactReturn}</span>
                  <span className="text-muted-foreground">{p.financialReturn}%</span>
                  <span className="text-foreground">${p.capitalDeployed}M</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
