import { ArrowLeftRight, Bell, Download, Filter, Share2, LogIn, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { SavedViewsDropdown } from './SavedViewsDropdown';

const scenarios = ['Live', 'Historical', 'Forecast'] as const;

interface DashboardHeaderProps {
  onCompare?: () => void;
}

export const DashboardHeader = ({ onCompare }: DashboardHeaderProps) => {
  const [activeScenario, setActiveScenario] = useState<typeof scenarios[number]>('Live');
  const [showFilters, setShowFilters] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">Economic Flow</h1>
            <p className="text-xs text-muted-foreground">Atlas Sanctum · Regenerative Capital Intelligence</p>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <div className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse-glow" />
            <span className="text-[10px] text-muted-foreground font-mono">LIVE · 2m ago</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Scenario Toggle */}
          <div className="flex bg-secondary rounded-md p-0.5">
            {scenarios.map((s) => (
              <button
                key={s}
                onClick={() => setActiveScenario(s)}
                className={`px-3 py-1 text-xs rounded-sm transition-all ${
                  activeScenario === s
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
          {onCompare && (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={onCompare}>
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-critical rounded-full" />
          </Button>

          {/* Auth / Admin */}
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-primary hover:text-primary">
              <Shield className="w-4 h-4" />
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-foreground">
              <LogIn className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {['Geography', 'Asset Class', 'Funding Source', 'Project Stage', 'Impact Sector', 'Verification Status', 'Risk Tier', 'Currency'].map((filter) => (
            <button
              key={filter}
              className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-accent transition-colors border border-border"
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
