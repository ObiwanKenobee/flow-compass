import { useState, useCallback, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { CapitalFlowMap } from '@/components/dashboard/CapitalFlowMap';
import { FundingGapHeatmap } from '@/components/dashboard/FundingGapHeatmap';
import { ImpactRoiScatter } from '@/components/dashboard/ImpactRoiScatter';
import { ClimateFundPipeline } from '@/components/dashboard/ClimateFundPipeline';
import { FlowComposition } from '@/components/dashboard/FlowComposition';
import { InsightsRail } from '@/components/dashboard/InsightsRail';
import { MicrofinanceSection } from '@/components/dashboard/MicrofinanceSection';
import { MarketInstrumentsSection } from '@/components/dashboard/MarketInstrumentsSection';
import { DrilldownPanel } from '@/components/dashboard/DrilldownPanel';
import { CompareMode } from '@/components/dashboard/CompareMode';
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav';
import { kpiData } from '@/data/mockEconomicData';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useAiInsights } from '@/hooks/use-ai-insights';
import type { DrilldownData } from '@/data/mockExtendedData';

const EconomicFlowDashboard = () => {
  const [drilldown, setDrilldown] = useState<DrilldownData | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const dashboardData = useDashboardData();
  const { insights: aiInsights, loading: aiLoading, generateInsights } = useAiInsights();

  const handleDrilldown = useCallback((data: DrilldownData) => {
    setDrilldown(data);
  }, []);

  const closeDrilldown = useCallback(() => {
    setDrilldown(null);
  }, []);

  // Generate AI insights when data loads
  useEffect(() => {
    if (!dashboardData.loading && dashboardData.regions.length > 0) {
      generateInsights({
        regions: dashboardData.regions,
        climateFunds: dashboardData.climateFunds,
        marketInstruments: dashboardData.marketInstruments,
        microfinance: dashboardData.microfinanceLoans,
        fundingGaps: dashboardData.fundingGaps,
      });
    }
  }, [dashboardData.loading, dashboardData.regions.length]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onCompare={() => setCompareOpen(true)} />

      <main className="px-4 md:px-6 py-4 max-w-[1600px] mx-auto space-y-4">
        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {kpiData.map((kpi, i) => (
            <KpiCard key={kpi.label} data={kpi} index={i} />
          ))}
        </section>

        {/* Flow Map + Insights */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <CapitalFlowMap
              regions={dashboardData.regions}
              onDrilldown={handleDrilldown}
            />
          </div>
          <div>
            <InsightsRail
              aiInsights={aiInsights}
              aiLoading={aiLoading}
              onRefresh={() => generateInsights({
                regions: dashboardData.regions,
                climateFunds: dashboardData.climateFunds,
                marketInstruments: dashboardData.marketInstruments,
                microfinance: dashboardData.microfinanceLoans,
                fundingGaps: dashboardData.fundingGaps,
              })}
            />
          </div>
        </section>

        {/* Flow Composition + Funding Gap */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <FlowComposition />
          <FundingGapHeatmap fundingGaps={dashboardData.fundingGaps} />
        </section>

        {/* Impact ROI + Climate Fund Pipeline */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ImpactRoiScatter
            projects={dashboardData.impactProjects}
            onDrilldown={handleDrilldown}
          />
          <ClimateFundPipeline funds={dashboardData.climateFunds} />
        </section>

        {/* Market Instruments */}
        <section>
          <MarketInstrumentsSection
            instruments={dashboardData.marketInstruments}
            onDrilldown={handleDrilldown}
          />
        </section>

        {/* Microfinance */}
        <section>
          <MicrofinanceSection loans={dashboardData.microfinanceLoans} />
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-[10px] text-muted-foreground font-mono">
            ATLAS SANCTUM · Economic Flow Intelligence · Real-time Cloud data · All figures USD unless noted
            {dashboardData.loading && ' · Loading...'}
          </p>
        </footer>
      </main>

      <DrilldownPanel data={drilldown} onClose={closeDrilldown} />
      <CompareMode
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        regions={dashboardData.regions}
        funds={dashboardData.climateFunds}
      />
    </div>
  );
};

export default EconomicFlowDashboard;
