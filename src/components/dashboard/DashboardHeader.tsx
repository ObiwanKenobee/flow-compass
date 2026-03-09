import { ArrowLeftRight, Bell, Download, Filter, Share2, LogIn, LogOut, Shield, Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { SavedViewsDropdown } from './SavedViewsDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const scenarios = ['Live', 'Historical', 'Forecast'] as const;

interface DashboardHeaderProps {
  onCompare?: () => void;
  currentScenario?: string;
  onLoadView?: (config: any) => void;
}

export const DashboardHeader = ({ onCompare, currentScenario, onLoadView }: DashboardHeaderProps) => {
  const [activeScenario, setActiveScenario] = useState<typeof scenarios[number]>('Live');
  const [showFilters, setShowFilters] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-3 md:px-6 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-sm md:text-lg font-semibold text-foreground tracking-tight truncate">Economic Flow</h1>
            <p className="text-[9px] md:text-xs text-muted-foreground truncate hidden sm:block">Atlas Sanctum · Regenerative Capital Intelligence</p>
          </div>
          <div className="hidden sm:flex items-center gap-1 ml-2 md:ml-4">
            <div className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse-glow" />
            <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">LIVE · 2m ago</span>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Scenario Toggle */}
          <div className="hidden sm:flex bg-secondary rounded-md p-0.5">
            {scenarios.map((s) => (
              <button
                key={s}
                onClick={() => setActiveScenario(s)}
                className={`px-2 md:px-3 py-1 text-[10px] md:text-xs rounded-sm transition-all ${
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
            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 md:h-auto md:w-auto md:px-3"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
          {onCompare && (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 md:h-auto md:w-auto md:px-3" onClick={onCompare}>
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:inline-flex text-muted-foreground hover:text-foreground">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground h-8 w-8 p-0 md:h-auto md:w-auto md:px-3">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-critical rounded-full" />
          </Button>

          {/* Saved Views */}
          {user && (
            <SavedViewsDropdown
              userId={user.id}
              currentConfig={{ scenario: activeScenario }}
              onLoadView={(config) => {
                if (config?.scenario) setActiveScenario(config.scenario);
                onLoadView?.(config);
              }}
            />
          )}

          {/* Auth / Admin */}
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-primary hover:text-primary h-8 w-8 p-0 md:h-auto md:w-auto md:px-3">
              <Shield className="w-4 h-4" />
            </Button>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 md:h-auto md:w-auto md:px-3">
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="text-muted-foreground hover:text-foreground h-8 w-8 p-0 md:h-auto md:w-auto md:px-3">
              <LogIn className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile scenario toggle */}
      <div className="flex sm:hidden items-center justify-between mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse-glow" />
          <span className="text-[10px] text-muted-foreground font-mono">LIVE</span>
        </div>
        <div className="flex bg-secondary rounded-md p-0.5">
          {scenarios.map((s) => (
            <button
              key={s}
              onClick={() => setActiveScenario(s)}
              className={`px-2 py-1 text-[10px] rounded-sm transition-all ${
                activeScenario === s
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 pt-3 border-t border-border">
          {['Geography', 'Asset Class', 'Funding Source', 'Project Stage', 'Impact Sector', 'Verification Status', 'Risk Tier', 'Currency'].map((filter) => (
            <button
              key={filter}
              className="px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-accent transition-colors border border-border"
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
