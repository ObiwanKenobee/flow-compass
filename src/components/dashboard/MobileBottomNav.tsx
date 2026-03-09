import { useState, useEffect } from 'react';
import { Map, BarChart3, TrendingUp, Landmark, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'map', label: 'Flows', icon: Map, sectionIndex: 1 },
  { id: 'gaps', label: 'Gaps', icon: BarChart3, sectionIndex: 2 },
  { id: 'impact', label: 'Impact', icon: TrendingUp, sectionIndex: 3 },
  { id: 'markets', label: 'Markets', icon: Landmark, sectionIndex: 4 },
  { id: 'micro', label: 'Micro', icon: Lightbulb, sectionIndex: 5 },
] as const;

export const MobileBottomNav = () => {
  const [active, setActive] = useState('map');

  useEffect(() => {
    const sections = document.querySelectorAll('main > section');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          const idx = Array.from(sections).indexOf(topmost.target as Element);
          const item = navItems.find(n => n.sectionIndex === idx);
          if (item) setActive(item.id);
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (sectionIndex: number, id: string) => {
    setActive(id);
    const sections = document.querySelectorAll('main > section');
    sections[sectionIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.sectionIndex, item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
