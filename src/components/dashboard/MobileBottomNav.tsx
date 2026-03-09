import { useState, useEffect, useRef } from 'react';
import { Map, BarChart3, TrendingUp, Landmark, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [tapped, setTapped] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

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
    setTapped(id);
    setTimeout(() => setTapped(null), 300);
    const sections = document.querySelectorAll('main > section');
    sections[sectionIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
      <div ref={navRef} className="flex items-center justify-around h-14 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const isTapped = tapped === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.sectionIndex, item.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
            >
              {/* Active indicator pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* Tap ripple */}
              <AnimatePresence>
                {isTapped && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    initial={{ opacity: 0.6, scale: 0.8 }}
                    animate={{ opacity: 0, scale: 1.1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              <motion.div
                animate={{
                  scale: isTapped ? 0.85 : isActive ? 1.1 : 1,
                  y: isActive ? -1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon className={cn(
                  'w-4 h-4 transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )} />
              </motion.div>

              <motion.span
                className={cn(
                  'text-[9px] font-medium transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  scale: isTapped ? 0.9 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {item.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
