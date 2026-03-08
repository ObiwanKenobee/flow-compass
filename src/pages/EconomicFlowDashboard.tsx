import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { CapitalFlowMap } from '@/components/dashboard/CapitalFlowMap';
import { FundingGapHeatmap } from '@/components/dashboard/FundingGapHeatmap';
import { ImpactRoiScatter } from '@/components/dashboard/ImpactRoiScatter';
import { ClimateFundPipeline } from '@/components/dashboard/ClimateFundPipeline';
import { FlowComposition } from '@/components/dashboard/FlowComposition';
import { InsightsRail } from '@/components/dashboard/InsightsRail';
import { kpiData } from '@/data/mockEconomicData';

const EconomicFlowDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

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
            <CapitalFlowMap />
          </div>
          <div>
            <InsightsRail />
          </div>
        </section>

        {/* Flow Composition + Funding Gap */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <FlowComposition />
          <FundingGapHeatmap />
        </section>

        {/* Impact ROI + Climate Fund Pipeline */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ImpactRoiScatter />
          <ClimateFundPipeline />
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-[10px] text-muted-foreground font-mono">
            ATLAS SANCTUM · Economic Flow Intelligence · Data refreshed every 120s · All figures USD unless noted
          </p>
        </footer>
      </main>
    </div>
  );
};

export default EconomicFlowDashboard;
