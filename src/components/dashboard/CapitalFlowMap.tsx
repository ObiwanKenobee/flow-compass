import { motion } from 'framer-motion';
import { useState } from 'react';
import { flowNodes, type FlowNode } from '@/data/mockEconomicData';

const statusGlow = {
  healthy: '#2dd4a0',
  warning: '#f59e0b',
  critical: '#ef4444',
};

const MapNode = ({ node, isSelected, onSelect }: { node: FlowNode; isSelected: boolean; onSelect: (n: FlowNode | null) => void }) => {
  // Simple projection for display
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
      {/* Glow ring */}
      <circle
        cx={`${x}%`}
        cy={`${y}%`}
        r={isSelected ? 18 : 12}
        fill="none"
        stroke={statusGlow[node.status]}
        strokeWidth="1"
        opacity={0.3}
      >
        <animate attributeName="r" values={`${isSelected ? 18 : 12};${isSelected ? 24 : 16};${isSelected ? 18 : 12}`} dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Core dot */}
      <circle
        cx={`${x}%`}
        cy={`${y}%`}
        r={isSelected ? 6 : 4}
        fill={statusGlow[node.status]}
        opacity={0.9}
      />
      {/* Label */}
      <text
        x={`${x}%`}
        y={`${y - 4}%`}
        textAnchor="middle"
        fill="hsl(210, 20%, 80%)"
        fontSize="8"
        fontFamily="Inter, sans-serif"
      >
        {node.name}
      </text>
    </motion.g>
  );
};

const NodeDetail = ({ node }: { node: FlowNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="absolute right-4 top-4 w-64 insight-card"
  >
    <h3 className="font-semibold text-sm text-foreground mb-2">{node.name}</h3>
    <div className="space-y-1.5 text-xs">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Capital Inflow</span>
        <span className="font-mono text-foreground">{node.capitalIn}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Capital Outflow</span>
        <span className="font-mono text-foreground">{node.capitalOut}</span>
      </div>
      {node.gap && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Funding Gap</span>
          <span className="font-mono text-critical">{node.gap}</span>
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
    </div>
  </motion.div>
);

export const CapitalFlowMap = () => {
  const [selected, setSelected] = useState<FlowNode | null>(null);

  return (
    <div className="section-panel relative overflow-hidden" style={{ minHeight: 400 }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Global Capital Flow Map</h2>
          <p className="text-xs text-muted-foreground">Animated regenerative investment flows across regions</p>
        </div>
        <div className="flex gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-healthy" /> Healthy</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Underfunded</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-critical" /> Critical Gap</span>
        </div>
      </div>

      {/* Simplified world map background */}
      <div className="relative w-full rounded-lg overflow-hidden bg-secondary/50" style={{ aspectRatio: '2/1' }}>
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid */}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 10}`} x2="100" y2={`${(i + 1) * 10}`} stroke="hsl(220, 15%, 14%)" strokeWidth="0.2" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 10}`} y1="0" x2={`${(i + 1) * 10}`} y2="100" stroke="hsl(220, 15%, 14%)" strokeWidth="0.2" />
          ))}

          {/* Flow lines between nodes */}
          {[
            { from: 'ce', to: 'ea' }, { from: 'ce', to: 'sa' }, { from: 'ce', to: 'wa' },
            { from: 'sa', to: 'sea' }, { from: 'la', to: 'wa' },
          ].map(({ from, to }, i) => {
            const a = flowNodes.find(n => n.id === from)!;
            const b = flowNodes.find(n => n.id === to)!;
            const x1 = ((a.lng + 180) / 360) * 100;
            const y1 = ((90 - a.lat) / 180) * 100;
            const x2 = ((b.lng + 180) / 360) * 100;
            const y2 = ((90 - b.lat) / 180) * 100;
            return (
              <line
                key={i}
                x1={`${x1}%`} y1={`${y1}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                stroke="hsl(152, 60%, 45%)"
                strokeWidth="0.4"
                opacity="0.3"
                strokeDasharray="2 2"
                className="animate-flow"
              />
            );
          })}

          {/* Region nodes */}
          {flowNodes.map((node) => (
            <MapNode key={node.id} node={node} isSelected={selected?.id === node.id} onSelect={setSelected} />
          ))}
        </svg>
      </div>

      {selected && <NodeDetail node={selected} />}
    </div>
  );
};
