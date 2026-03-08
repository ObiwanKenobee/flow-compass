import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight } from 'lucide-react';
import type { Region, ClimateFund } from '@/hooks/use-dashboard-data';

type CompareType = 'regions' | 'funds';

interface CompareModeProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  funds: ClimateFund[];
}

const formatCurrency = (val: number) => {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val}`;
};

export const CompareMode = ({ isOpen, onClose, regions, funds }: CompareModeProps) => {
  const [compareType, setCompareType] = useState<CompareType>('regions');
  const [leftSelection, setLeftSelection] = useState<string>('');
  const [rightSelection, setRightSelection] = useState<string>('');

  const regionOptions = regions.map(r => ({ id: r.id, label: r.name }));
  const fundOptions = funds.map(f => ({ id: f.id, label: f.name }));
  const options = compareType === 'regions' ? regionOptions : fundOptions;

  const renderComparison = () => {
    if (!leftSelection || !rightSelection) return null;

    if (compareType === 'regions') {
      const left = regions.find(r => r.id === leftSelection);
      const right = regions.find(r => r.id === rightSelection);
      if (!left || !right) return null;

      const metrics = [
        { label: 'Capital Inflow', left: formatCurrency(left.capital_in), right: formatCurrency(right.capital_in) },
        { label: 'Capital Outflow', left: formatCurrency(left.capital_out), right: formatCurrency(right.capital_out) },
        { label: 'Funding Gap', left: left.funding_gap ? formatCurrency(left.funding_gap) : 'N/A', right: right.funding_gap ? formatCurrency(right.funding_gap) : 'N/A' },
        { label: 'Status', left: left.status, right: right.status },
        { label: 'Sectors', left: `${left.sectors.length}`, right: `${right.sectors.length}` },
      ];

      return (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_120px_1fr] gap-2 text-[10px] font-medium text-muted-foreground mb-2">
            <div className="text-center">{left.name}</div>
            <div className="text-center">Metric</div>
            <div className="text-center">{right.name}</div>
          </div>
          {metrics.map(m => (
            <div key={m.label} className="grid grid-cols-[1fr_120px_1fr] gap-2 items-center text-xs">
              <div className="text-right font-mono text-foreground">{m.left}</div>
              <div className="text-center text-[10px] text-muted-foreground">{m.label}</div>
              <div className="text-left font-mono text-foreground">{m.right}</div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[left, right].map(r => (
              <div key={r.id} className="kpi-card">
                <div className="text-[10px] text-muted-foreground mb-1">Sectors</div>
                <div className="flex flex-wrap gap-1">
                  {r.sectors.map(s => (
                    <span key={s} className="text-[9px] px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (compareType === 'funds') {
      const left = funds.find(f => f.id === leftSelection);
      const right = funds.find(f => f.id === rightSelection);
      if (!left || !right) return null;

      const stages = ['pledged', 'approved', 'contracted', 'released', 'deployed', 'verified'] as const;
      const formatVal = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}B` : `${v}M`;

      return (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_100px_1fr] gap-2 text-[10px] font-medium text-muted-foreground mb-2">
            <div className="text-center truncate">{left.name}</div>
            <div className="text-center">Stage</div>
            <div className="text-center truncate">{right.name}</div>
          </div>
          {stages.map(stage => {
            const lVal = left[stage];
            const rVal = right[stage];
            const lPct = (lVal / left.pledged * 100).toFixed(0);
            const rPct = (rVal / right.pledged * 100).toFixed(0);
            return (
              <div key={stage} className="grid grid-cols-[1fr_100px_1fr] gap-2 items-center">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] text-muted-foreground">{lPct}%</span>
                  <span className="font-mono text-xs text-foreground">{formatVal(lVal)}</span>
                </div>
                <div className="text-center text-[10px] text-muted-foreground capitalize">{stage}</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-foreground">{formatVal(rVal)}</span>
                  <span className="text-[10px] text-muted-foreground">{rPct}%</span>
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {[left, right].map(f => (
              <div key={f.id} className="insight-card text-[10px]">
                <span className="text-muted-foreground">Utilization: </span>
                <span className={`font-mono ${(f.deployed / f.pledged) > 0.5 ? 'text-healthy' : 'text-critical'}`}>
                  {((f.deployed / f.pledged) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[70vh] bg-card border-t border-border z-50 rounded-t-xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur border-b border-border px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <ArrowLeftRight className="w-4 h-4 text-primary" />
                <h2 className="text-xs md:text-sm font-semibold text-foreground">Compare Mode</h2>
                <div className="flex bg-secondary rounded-md p-0.5">
                  {(['regions', 'funds'] as const).map(t => (
                    <button key={t} onClick={() => { setCompareType(t); setLeftSelection(''); setRightSelection(''); }}
                      className={`px-2 md:px-3 py-1 text-[10px] md:text-xs rounded-sm transition-all capitalize ${compareType === t ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={onClose} className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 md:px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Left</label>
                  <select value={leftSelection} onChange={e => setLeftSelection(e.target.value)}
                    className="w-full bg-secondary text-foreground text-xs rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select...</option>
                    {options.filter(o => o.id !== rightSelection).map(o => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block">Right</label>
                  <select value={rightSelection} onChange={e => setRightSelection(e.target.value)}
                    className="w-full bg-secondary text-foreground text-xs rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select...</option>
                    {options.filter(o => o.id !== leftSelection).map(o => (
                      <option key={o.id} value={o.id}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {leftSelection && rightSelection ? renderComparison() : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Select two {compareType} to compare side by side
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
