import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Region } from '@/hooks/use-dashboard-data';
import type { DrilldownData } from '@/data/mockExtendedData';

const statusGlow = {
  healthy: '#2dd4a0',
  warning: '#f59e0b',
  critical: '#ef4444',
};

interface CapitalFlowMapProps {
  regions: Region[];
  onDrilldown?: (data: DrilldownData) => void;
}

const formatCurrency = (val: number) => {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val}`;
};

const MapNode = ({ node, isSelected, onSelect }: { node: Region; isSelected: boolean; onSelect: (n: Region | null) => void }) => {
  const x = ((node.lng + 180) / 360) * 100;
  const y = ((90 - node.lat) / 180) * 100;

  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: 'spring' }}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect(isSelected ? null : node)}
    >
      <circle cx={`${x}%`} cy={`${y}%`} r={isSelected ? 18 : 12} fill="none" stroke={statusGlow[node.status]} strokeWidth="1" opacity={0.3}>
        <animate attributeName="r" values={`${isSelected ? 18 : 12};${isSelected ? 24 : 16};${isSelected ? 18 : 12}`} dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={`${x}%`} cy={`${y}%`} r={isSelected ? 6 : 4} fill={statusGlow[node.status]} opacity={0.9} />
      <text x={`${x}%`} y={`${y - 4}%`} textAnchor="middle" fill="hsl(210, 20%, 80%)" fontSize="8" fontFamily="Inter, sans-serif">
        {node.name}
      </text>
    </motion.g>
  );
};

const NodeDetail = ({ node, onDrilldown }: { node: Region; onDrilldown?: (data: DrilldownData) => void }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="absolute right-4 top-4 w-64 insight-card">
    <h3 className="font-semibold text-sm text-foreground mb-2">{node.name}</h3>
    <div className="space-y-1.5 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Capital Inflow</span>
        <span className="font-mono text-foreground">{formatCurrency(node.capital_in)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Capital Outflow</span>
        <span className="font-mono text-foreground">{formatCurrency(node.capital_out)}</span>
      </div>
      {node.funding_gap && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Funding Gap</span>
          <span className="font-mono text-critical">{formatCurrency(node.funding_gap)}</span>
        </div>
      )}
      <div className="pt-1.5 border-t border-border">
        <span className="text-muted-foreground">Sectors: </span>
        <span className="text-foreground">{node.sectors.join(', ')}</span>
      </div>
      <div className="flex items-center gap-1.5 pt-1">
        <span className={`inline-block w-2 h-2 rounded-full ${node.status === 'healthy' ? 'bg-healthy' : node.status === 'warning' ? 'bg-warning' : 'bg-critical'}`} />
        <span className={`capitalize ${node.status === 'healthy' ? 'text-healthy' : node.status === 'warning' ? 'text-warning' : 'text-critical'}`}>
          {node.status}
        </span>
      </div>
      {onDrilldown && (
        <button
          onClick={() => onDrilldown({
            type: 'region',
            id: node.id,
            title: node.name,
            subtitle: `${node.status} · ${node.sectors.length} active sectors`,
            metrics: [
              { label: 'Capital Inflow', value: formatCurrency(node.capital_in), status: 'healthy' },
              { label: 'Capital Outflow', value: formatCurrency(node.capital_out) },
              { label: 'Funding Gap', value: node.funding_gap ? formatCurrency(node.funding_gap) : 'N/A', status: node.funding_gap ? 'critical' : 'healthy' },
              { label: 'Status', value: node.status, status: node.status },
              { label: 'Active Sectors', value: `${node.sectors.length}` },
              { label: 'Net Flow', value: formatCurrency(node.capital_in - node.capital_out) },
            ],
            sectors: node.sectors,
            description: node.status === 'critical'
              ? `${node.name} is critically underfunded with a ${node.funding_gap ? formatCurrency(node.funding_gap) : ''} gap. Immediate capital reallocation needed across ${node.sectors.join(', ')} sectors.`
              : node.status === 'warning'
              ? `${node.name} shows signs of underfunding. Current gap of ${node.funding_gap ? formatCurrency(node.funding_gap) : 'unknown'} requires attention.`
              : `${node.name} has healthy capital flows. Sectors performing well: ${node.sectors.join(', ')}.`,
            linkedDashboards: ['Flood Risk Dashboard', 'Food System Dashboard', 'Infrastructure Dashboard'],
          })}
          className="w-full mt-2 px-3 py-1.5 rounded bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/20 transition-colors"
        >
          Open Full Analysis →
        </button>
      )}
    </div>
  </motion.div>
);

export const CapitalFlowMap = ({ regions, onDrilldown }: CapitalFlowMapProps) => {
  const [selected, setSelected] = useState<Region | null>(null);

  // Build flow lines from regions
  const flowLines = regions.length >= 2 ? [
    { from: regions.find(r => r.name === 'Central Europe'), to: regions.find(r => r.name === 'East Africa') },
    { from: regions.find(r => r.name === 'Central Europe'), to: regions.find(r => r.name === 'South Asia') },
    { from: regions.find(r => r.name === 'Central Europe'), to: regions.find(r => r.name === 'West Africa') },
    { from: regions.find(r => r.name === 'South Asia'), to: regions.find(r => r.name === 'Southeast Asia') },
  ].filter(l => l.from && l.to) : [];

  return (
    <div className="section-panel relative overflow-hidden" style={{ minHeight: 400 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Global Capital Flow Map</h2>
          <p className="text-xs text-muted-foreground">Live data · Click regions for analysis</p>
        </div>
        <div className="flex gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-healthy" /> Healthy</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Underfunded</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-critical" /> Critical Gap</span>
        </div>
      </div>

      <div className="relative w-full rounded-lg overflow-hidden bg-secondary/50" style={{ aspectRatio: '2/1' }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 10}`} x2="100" y2={`${(i + 1) * 10}`} stroke="hsl(220, 15%, 14%)" strokeWidth="0.2" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 10}`} y1="0" x2={`${(i + 1) * 10}`} y2="100" stroke="hsl(220, 15%, 14%)" strokeWidth="0.2" />
          ))}
          {flowLines.map(({ from, to }, i) => {
            if (!from || !to) return null;
            const x1 = ((from.lng + 180) / 360) * 100;
            const y1 = ((90 - from.lat) / 180) * 100;
            const x2 = ((to.lng + 180) / 360) * 100;
            const y2 = ((90 - to.lat) / 180) * 100;
            return (
              <line key={i} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
                stroke="hsl(152, 60%, 45%)" strokeWidth="0.4" opacity="0.3" strokeDasharray="2 2" className="animate-flow" />
            );
          })}
          {regions.map((node) => (
            <MapNode key={node.id} node={node} isSelected={selected?.id === node.id} onSelect={setSelected} />
          ))}
        </svg>
      </div>

      {selected && <NodeDetail node={selected} onDrilldown={onDrilldown} />}
    </div>
  );
};
