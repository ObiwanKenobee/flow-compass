import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Region = Tables<'regions'>;
export type ClimateFund = Tables<'climate_funds'>;
export type ImpactProject = Tables<'impact_projects'>;
export type MicrofinanceLoan = Tables<'microfinance_loans'>;
export type MarketInstrument = Tables<'market_instruments'>;
export type FundingGap = Tables<'funding_gaps'>;

interface DashboardData {
  regions: Region[];
  climateFunds: ClimateFund[];
  impactProjects: ImpactProject[];
  microfinanceLoans: MicrofinanceLoan[];
  marketInstruments: MarketInstrument[];
  fundingGaps: FundingGap[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): DashboardData {
  const [regions, setRegions] = useState<Region[]>([]);
  const [climateFunds, setClimateFunds] = useState<ClimateFund[]>([]);
  const [impactProjects, setImpactProjects] = useState<ImpactProject[]>([]);
  const [microfinanceLoans, setMicrofinanceLoans] = useState<MicrofinanceLoan[]>([]);
  const [marketInstruments, setMarketInstruments] = useState<MarketInstrument[]>([]);
  const [fundingGaps, setFundingGaps] = useState<FundingGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [regRes, fundRes, projRes, mfRes, miRes, fgRes] = await Promise.all([
        supabase.from('regions').select('*'),
        supabase.from('climate_funds').select('*'),
        supabase.from('impact_projects').select('*'),
        supabase.from('microfinance_loans').select('*'),
        supabase.from('market_instruments').select('*'),
        supabase.from('funding_gaps').select('*'),
      ]);

      if (regRes.data) setRegions(regRes.data);
      if (fundRes.data) setClimateFunds(fundRes.data);
      if (projRes.data) setImpactProjects(projRes.data);
      if (mfRes.data) setMicrofinanceLoans(mfRes.data);
      if (miRes.data) setMarketInstruments(miRes.data);
      if (fgRes.data) setFundingGaps(fgRes.data);

      const anyError = [regRes, fundRes, projRes, mfRes, miRes, fgRes].find(r => r.error);
      if (anyError?.error) setError(anyError.error.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Real-time subscriptions
  useEffect(() => {
    const channel = supabase.channel('dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'regions' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setRegions(prev => {
            const idx = prev.findIndex(r => r.id === (payload.new as Region).id);
            if (idx >= 0) return prev.map((r, i) => i === idx ? payload.new as Region : r);
            return [...prev, payload.new as Region];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'climate_funds' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setClimateFunds(prev => {
            const idx = prev.findIndex(f => f.id === (payload.new as ClimateFund).id);
            if (idx >= 0) return prev.map((f, i) => i === idx ? payload.new as ClimateFund : f);
            return [...prev, payload.new as ClimateFund];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'impact_projects' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setImpactProjects(prev => {
            const idx = prev.findIndex(p => p.id === (payload.new as ImpactProject).id);
            if (idx >= 0) return prev.map((p, i) => i === idx ? payload.new as ImpactProject : p);
            return [...prev, payload.new as ImpactProject];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'market_instruments' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setMarketInstruments(prev => {
            const idx = prev.findIndex(m => m.id === (payload.new as MarketInstrument).id);
            if (idx >= 0) return prev.map((m, i) => i === idx ? payload.new as MarketInstrument : m);
            return [...prev, payload.new as MarketInstrument];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'microfinance_loans' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setMicrofinanceLoans(prev => {
            const idx = prev.findIndex(m => m.id === (payload.new as MicrofinanceLoan).id);
            if (idx >= 0) return prev.map((m, i) => i === idx ? payload.new as MicrofinanceLoan : m);
            return [...prev, payload.new as MicrofinanceLoan];
          });
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'funding_gaps' }, (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          setFundingGaps(prev => {
            const idx = prev.findIndex(f => f.id === (payload.new as FundingGap).id);
            if (idx >= 0) return prev.map((f, i) => i === idx ? payload.new as FundingGap : f);
            return [...prev, payload.new as FundingGap];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { regions, climateFunds, impactProjects, microfinanceLoans, marketInstruments, fundingGaps, loading, error, refetch: fetchAll };
}
