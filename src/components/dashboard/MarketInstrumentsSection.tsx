import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Droplets, Leaf, Shield, Flame, Waves } from 'lucide-react';
import { marketInstruments, creditPriceHistory, type MarketInstrument } from '@/data/mockExtendedData';
import type { DrilldownData } from '@/data/mockExtendedData';

const typeIcons: Record<MarketInstrument['type'], typeof Leaf> = {
  carbon: Flame,
  biodiversity: Leaf,
  water: Droplets,
  adaptation: Shield,
  resilience: Waves,
};

const tierColors = {
  gold: 'bg-flow-warning/20 text-warning border-warning/30',
  silver: 'bg-flow-stable/10 text-stable border-stable/30',
  bronze: 'bg-flow-neutral/10 text-muted-foreground border-border',
  unverified: 'bg-flow-critical/10 text-critical border-critical/30',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="insight-card text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-3">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono text-foreground">${p.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

interface MarketInstrumentsSectionProps {
  onDrilldown?: (data: DrilldownData) => void;
}

export const MarketInstrumentsSection = ({ onDrilldown }: MarketInstrumentsSectionProps) => {
  const handleInstrumentClick = (inst: MarketInstrument) => {
    if (!onDrilldown) return;
    onDrilldown({
      type: 'instrument',
      id: inst.name,
      title: inst.name,
      subtitle: `${inst.type} · ${inst.priceUnit}`,
      metrics: [
        { label: 'Spot Price', value: `$${inst.spotPrice.toFixed(2)}` },
        { label: '30d Change', value: `${inst.change30d > 0 ? '+' : ''}${inst.change30d}%`, status: inst.change30d > 0 ? 'healthy' : 'critical' },
        { label: 'Issued', value: `${(inst.issuedVolume / 1000000).toFixed(1)}M` },
        { label: 'Retired', value: `${(inst.retiredVolume / 1000000).toFixed(1)}M` },
        { label: 'Liquidity', value: `${inst.liquidityDepth}%`, status: inst.liquidityDepth > 60 ? 'healthy' : inst.liquidityDepth > 40 ? 'warning' : 'critical' },
        { label: 'Verification Lag', value: `${inst.verificationLagDays}d`, status: inst.verificationLagDays < 60 ? 'healthy' : inst.verificationLagDays < 120 ? 'warning' : 'critical' },
        { label: 'Impact Linkage', value: `${inst.impactLinkageScore}/100`, status: inst.impactLinkageScore > 80 ? 'healthy' : inst.impactLinkageScore > 60 ? 'warning' : 'critical' },
        { label: 'Trust Tier', value: inst.verificationTier.charAt(0).toUpperCase() + inst.verificationTier.slice(1) },
      ],
      sectors: inst.regionsSupported,
      description: inst.impactLinkageScore < 70
        ? `This instrument shows weak impact linkage (${inst.impactLinkageScore}/100). Verification lag of ${inst.verificationLagDays} days suggests systemic measurement delays. Exercise caution on credibility claims.`
        : `Strong impact-verified instrument with ${inst.impactLinkageScore}/100 linkage score. Verification pipeline running at ${inst.verificationLagDays}-day average. Market depth supports active trading.`,
      linkedDashboards: ['Regenerative Impact Dashboard', 'Biodiversity Intelligence'],
    });
  };

  return (
    <div className="section-panel">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-foreground">Market Instruments & Liquidity</h2>
        <p className="text-xs text-muted-foreground">Ecosystem asset pricing, verification quality, and market depth</p>
      </div>

      {/* Price Trend Chart */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Credit Price Trends ($/unit)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={creditPriceHistory} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 9 }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
            <YAxis tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="mangrove" stroke="hsl(152, 60%, 45%)" strokeWidth={2} dot={false} name="Mangrove" />
            <Line type="monotone" dataKey="soil" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Soil Carbon" />
            <Line type="monotone" dataKey="watershed" stroke="hsl(210, 70%, 55%)" strokeWidth={2} dot={false} name="Watershed" />
            <Line type="monotone" dataKey="peatland" stroke="hsl(280, 60%, 55%)" strokeWidth={1.5} dot={false} name="Peatland" />
            <Line type="monotone" dataKey="redd" stroke="hsl(0, 72%, 50%)" strokeWidth={1.5} dot={false} name="REDD+" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Issuance vs Retirement */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-muted-foreground mb-3">Issuance vs Retirement Volume (M units)</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={marketInstruments.map(i => ({
              name: i.name.split(' ').slice(0, 2).join(' '),
              issued: +(i.issuedVolume / 1000000).toFixed(1),
              retired: +(i.retiredVolume / 1000000).toFixed(1),
            }))}
            margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 8 }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fill: 'hsl(215, 15%, 50%)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'hsl(220, 15%, 18%)' }} />
            <Tooltip />
            <Bar dataKey="issued" fill="hsl(210, 70%, 55%)" opacity={0.7} name="Issued" radius={[2, 2, 0, 0]} />
            <Bar dataKey="retired" fill="hsl(152, 60%, 45%)" opacity={0.7} name="Retired" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Instrument Cards */}
      <h3 className="text-xs font-medium text-muted-foreground mb-3">Instrument Detail</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {marketInstruments.map((inst, i) => {
          const Icon = typeIcons[inst.type];
          return (
            <motion.div
              key={inst.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleInstrumentClick(inst)}
              className="kpi-card cursor-pointer hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{inst.name}</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tierColors[inst.verificationTier]}`}>
                  {inst.verificationTier}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[10px]">
                <div>
                  <span className="text-muted-foreground">Price</span>
                  <div className="font-mono text-foreground">${inst.spotPrice.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">30d</span>
                  <div className={`font-mono flex items-center gap-0.5 ${inst.change30d > 0 ? 'text-healthy' : 'text-critical'}`}>
                    {inst.change30d > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {inst.change30d > 0 ? '+' : ''}{inst.change30d}%
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Liquidity</span>
                  <div className="font-mono text-foreground">{inst.liquidityDepth}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Lag</span>
                  <div className={`font-mono flex items-center gap-0.5 ${inst.verificationLagDays < 60 ? 'text-healthy' : inst.verificationLagDays < 120 ? 'text-warning' : 'text-critical'}`}>
                    <Clock className="w-2.5 h-2.5" />
                    {inst.verificationLagDays}d
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Impact</span>
                  <div className={`font-mono ${inst.impactLinkageScore > 80 ? 'text-healthy' : inst.impactLinkageScore > 60 ? 'text-warning' : 'text-critical'}`}>
                    {inst.impactLinkageScore}/100
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Regions</span>
                  <div className="text-foreground">{inst.regionsSupported.length}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 insight-card">
        <p className="text-[10px] text-warning">
          ⚠ REDD+ credits declining 15.2% over 30d — retirement volume at 37.6% of issuance indicates oversupply and potential credibility concerns.
        </p>
      </div>
    </div>
  );
};
