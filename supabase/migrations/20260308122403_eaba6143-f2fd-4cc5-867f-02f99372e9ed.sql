
-- Create enum types
CREATE TYPE public.flow_status AS ENUM ('healthy', 'warning', 'critical');
CREATE TYPE public.verification_tier AS ENUM ('gold', 'silver', 'bronze', 'unverified');
CREATE TYPE public.instrument_type AS ENUM ('carbon', 'biodiversity', 'water', 'adaptation', 'resilience');
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.risk_tier AS ENUM ('low', 'medium', 'high');

-- Regions table
CREATE TABLE public.regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  capital_in NUMERIC NOT NULL DEFAULT 0,
  capital_out NUMERIC NOT NULL DEFAULT 0,
  status flow_status NOT NULL DEFAULT 'healthy',
  sectors TEXT[] NOT NULL DEFAULT '{}',
  funding_gap NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Capital flows table
CREATE TABLE public.capital_flows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  target_region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  target_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  instrument_type TEXT,
  flow_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Market instruments table
CREATE TABLE public.market_instruments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type instrument_type NOT NULL,
  spot_price NUMERIC NOT NULL,
  price_unit TEXT NOT NULL,
  change_30d NUMERIC NOT NULL DEFAULT 0,
  issued_volume NUMERIC NOT NULL DEFAULT 0,
  retired_volume NUMERIC NOT NULL DEFAULT 0,
  verification_tier verification_tier NOT NULL DEFAULT 'unverified',
  verification_lag_days INTEGER NOT NULL DEFAULT 0,
  liquidity_depth NUMERIC NOT NULL DEFAULT 0,
  regions_supported TEXT[] NOT NULL DEFAULT '{}',
  impact_linkage_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Credit price history
CREATE TABLE public.credit_price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instrument_id UUID REFERENCES public.market_instruments(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Microfinance loans
CREATE TABLE public.microfinance_loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  total_loans INTEGER NOT NULL DEFAULT 0,
  active_loans INTEGER NOT NULL DEFAULT 0,
  avg_loan_size NUMERIC NOT NULL DEFAULT 0,
  repayment_rate NUMERIC NOT NULL DEFAULT 0,
  women_borrowers NUMERIC NOT NULL DEFAULT 0,
  youth_borrowers NUMERIC NOT NULL DEFAULT 0,
  sectors TEXT[] NOT NULL DEFAULT '{}',
  resilience_linked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Climate funds
CREATE TABLE public.climate_funds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  pledged NUMERIC NOT NULL DEFAULT 0,
  approved NUMERIC NOT NULL DEFAULT 0,
  contracted NUMERIC NOT NULL DEFAULT 0,
  released NUMERIC NOT NULL DEFAULT 0,
  deployed NUMERIC NOT NULL DEFAULT 0,
  verified NUMERIC NOT NULL DEFAULT 0,
  co_financing_ratio NUMERIC NOT NULL DEFAULT 0,
  geographic_concentration JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Funding gaps
CREATE TABLE public.funding_gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  adaptation NUMERIC NOT NULL DEFAULT 0,
  biodiversity NUMERIC NOT NULL DEFAULT 0,
  food_systems NUMERIC NOT NULL DEFAULT 0,
  clean_energy NUMERIC NOT NULL DEFAULT 0,
  health_resilience NUMERIC NOT NULL DEFAULT 0,
  urgency urgency_level NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Impact projects
CREATE TABLE public.impact_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  financial_return NUMERIC NOT NULL DEFAULT 0,
  impact_return NUMERIC NOT NULL DEFAULT 0,
  capital_deployed NUMERIC NOT NULL DEFAULT 0,
  risk_tier risk_tier NOT NULL DEFAULT 'medium',
  verified BOOLEAN NOT NULL DEFAULT false,
  region TEXT NOT NULL,
  sector TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capital_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.microfinance_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.climate_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_projects ENABLE ROW LEVEL SECURITY;

-- Public read policies (dashboard data is public)
CREATE POLICY "Public read regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public read capital_flows" ON public.capital_flows FOR SELECT USING (true);
CREATE POLICY "Public read market_instruments" ON public.market_instruments FOR SELECT USING (true);
CREATE POLICY "Public read credit_price_history" ON public.credit_price_history FOR SELECT USING (true);
CREATE POLICY "Public read microfinance_loans" ON public.microfinance_loans FOR SELECT USING (true);
CREATE POLICY "Public read climate_funds" ON public.climate_funds FOR SELECT USING (true);
CREATE POLICY "Public read funding_gaps" ON public.funding_gaps FOR SELECT USING (true);
CREATE POLICY "Public read impact_projects" ON public.impact_projects FOR SELECT USING (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.regions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.capital_flows;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_instruments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.microfinance_loans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.climate_funds;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON public.regions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_market_instruments_updated_at BEFORE UPDATE ON public.market_instruments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_microfinance_loans_updated_at BEFORE UPDATE ON public.microfinance_loans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_climate_funds_updated_at BEFORE UPDATE ON public.climate_funds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_funding_gaps_updated_at BEFORE UPDATE ON public.funding_gaps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_impact_projects_updated_at BEFORE UPDATE ON public.impact_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
