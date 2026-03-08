export interface MicrofinanceLoan {
  region: string;
  lat: number;
  lng: number;
  totalLoans: number;
  activeLoans: number;
  avgLoanSize: number;
  repaymentRate: number;
  womenBorrowers: number;
  youthBorrowers: number;
  sectors: string[];
  resilienceLinked: boolean;
}

export const microfinanceData: MicrofinanceLoan[] = [
  { region: 'Nairobi Metro', lat: -1.3, lng: 36.8, totalLoans: 12400, activeLoans: 8900, avgLoanSize: 420, repaymentRate: 94.2, womenBorrowers: 68, youthBorrowers: 32, sectors: ['Retail', 'Agriculture', 'Solar'], resilienceLinked: true },
  { region: 'Rift Valley', lat: 0.3, lng: 35.9, totalLoans: 8200, activeLoans: 6100, avgLoanSize: 380, repaymentRate: 91.8, womenBorrowers: 72, youthBorrowers: 28, sectors: ['Agriculture', 'Water', 'Livestock'], resilienceLinked: true },
  { region: 'Coastal Kenya', lat: -4.0, lng: 39.6, totalLoans: 5600, activeLoans: 3800, avgLoanSize: 350, repaymentRate: 88.4, womenBorrowers: 65, youthBorrowers: 25, sectors: ['Fisheries', 'Tourism', 'Mangrove'], resilienceLinked: false },
  { region: 'Dhaka Basin', lat: 23.8, lng: 90.4, totalLoans: 28000, activeLoans: 22000, avgLoanSize: 180, repaymentRate: 96.1, womenBorrowers: 82, youthBorrowers: 35, sectors: ['Garments', 'Agriculture', 'Solar'], resilienceLinked: true },
  { region: 'Rajasthan', lat: 26.9, lng: 75.8, totalLoans: 15600, activeLoans: 11200, avgLoanSize: 240, repaymentRate: 93.5, womenBorrowers: 74, youthBorrowers: 30, sectors: ['Solar', 'Water', 'Agriculture'], resilienceLinked: true },
  { region: 'Lagos Peri-Urban', lat: 6.5, lng: 3.4, totalLoans: 9800, activeLoans: 7200, avgLoanSize: 310, repaymentRate: 86.2, womenBorrowers: 58, youthBorrowers: 42, sectors: ['Retail', 'Transport', 'Food'], resilienceLinked: false },
];

export const disbursementFunnel = [
  { stage: 'Committed', value: 480, pct: 100 },
  { stage: 'Approved', value: 420, pct: 87.5 },
  { stage: 'Disbursed', value: 365, pct: 76.0 },
  { stage: 'Utilized', value: 340, pct: 70.8 },
  { stage: 'Repaying', value: 310, pct: 64.6 },
  { stage: 'Impact Verified', value: 185, pct: 38.5 },
];

export const cohortPerformance = [
  { cohort: 'Q1 2024', disbursed: 85, repaid: 78, defaultRate: 4.2, impactScore: 7.2 },
  { cohort: 'Q2 2024', disbursed: 92, repaid: 83, defaultRate: 3.8, impactScore: 7.5 },
  { cohort: 'Q3 2024', disbursed: 105, repaid: 94, defaultRate: 3.5, impactScore: 7.8 },
  { cohort: 'Q4 2024', disbursed: 118, repaid: 102, defaultRate: 5.1, impactScore: 7.1 },
  { cohort: 'Q1 2025', disbursed: 130, repaid: 108, defaultRate: 6.2, impactScore: 6.8 },
  { cohort: 'Q2 2025', disbursed: 145, repaid: 115, defaultRate: 7.8, impactScore: 6.5 },
];

export interface MarketInstrument {
  name: string;
  type: 'carbon' | 'biodiversity' | 'water' | 'adaptation' | 'resilience';
  spotPrice: number;
  priceUnit: string;
  change30d: number;
  issuedVolume: number;
  retiredVolume: number;
  verificationTier: 'gold' | 'silver' | 'bronze' | 'unverified';
  verificationLagDays: number;
  liquidityDepth: number;
  regionsSupported: string[];
  impactLinkageScore: number;
}

export const marketInstruments: MarketInstrument[] = [
  { name: 'Mangrove Restoration Credit', type: 'carbon', spotPrice: 28.40, priceUnit: '$/tCO2e', change30d: 5.2, issuedVolume: 2400000, retiredVolume: 1800000, verificationTier: 'gold', verificationLagDays: 45, liquidityDepth: 78, regionsSupported: ['East Africa', 'Southeast Asia'], impactLinkageScore: 92 },
  { name: 'Biodiversity Unit — Coral', type: 'biodiversity', spotPrice: 42.10, priceUnit: '$/BDU', change30d: -3.1, issuedVolume: 850000, retiredVolume: 420000, verificationTier: 'silver', verificationLagDays: 90, liquidityDepth: 45, regionsSupported: ['Pacific Islands', 'Southeast Asia'], impactLinkageScore: 88 },
  { name: 'Watershed Recovery Credit', type: 'water', spotPrice: 18.75, priceUnit: '$/WRC', change30d: 12.8, issuedVolume: 1600000, retiredVolume: 1200000, verificationTier: 'gold', verificationLagDays: 60, liquidityDepth: 62, regionsSupported: ['East Africa', 'South Asia'], impactLinkageScore: 95 },
  { name: 'Adaptation Linked Bond', type: 'adaptation', spotPrice: 98.20, priceUnit: '$/unit', change30d: 0.8, issuedVolume: 500000, retiredVolume: 180000, verificationTier: 'silver', verificationLagDays: 120, liquidityDepth: 35, regionsSupported: ['Pacific Islands', 'Latin America'], impactLinkageScore: 76 },
  { name: 'Peatland Carbon Avoidance', type: 'carbon', spotPrice: 15.30, priceUnit: '$/tCO2e', change30d: -8.4, issuedVolume: 3200000, retiredVolume: 1400000, verificationTier: 'bronze', verificationLagDays: 180, liquidityDepth: 52, regionsSupported: ['Southeast Asia'], impactLinkageScore: 64 },
  { name: 'Resilience Bond — Flood', type: 'resilience', spotPrice: 105.00, priceUnit: '$/unit', change30d: 2.1, issuedVolume: 320000, retiredVolume: 95000, verificationTier: 'gold', verificationLagDays: 30, liquidityDepth: 41, regionsSupported: ['South Asia', 'West Africa'], impactLinkageScore: 89 },
  { name: 'REDD+ Forest Credit', type: 'carbon', spotPrice: 12.60, priceUnit: '$/tCO2e', change30d: -15.2, issuedVolume: 8500000, retiredVolume: 3200000, verificationTier: 'bronze', verificationLagDays: 150, liquidityDepth: 68, regionsSupported: ['Latin America', 'Southeast Asia'], impactLinkageScore: 58 },
  { name: 'Soil Carbon Sequestration', type: 'carbon', spotPrice: 22.90, priceUnit: '$/tCO2e', change30d: 8.6, issuedVolume: 1100000, retiredVolume: 780000, verificationTier: 'silver', verificationLagDays: 75, liquidityDepth: 55, regionsSupported: ['West Africa', 'East Africa'], impactLinkageScore: 82 },
];

export const creditPriceHistory = [
  { month: 'Jan', mangrove: 24.2, peatland: 18.1, redd: 16.8, soil: 19.5, watershed: 14.2 },
  { month: 'Feb', mangrove: 24.8, peatland: 17.8, redd: 16.2, soil: 19.8, watershed: 14.8 },
  { month: 'Mar', mangrove: 25.5, peatland: 17.2, redd: 15.8, soil: 20.2, watershed: 15.5 },
  { month: 'Apr', mangrove: 25.2, peatland: 16.8, redd: 15.1, soil: 20.8, watershed: 16.1 },
  { month: 'May', mangrove: 26.1, peatland: 16.5, redd: 14.5, soil: 21.1, watershed: 16.8 },
  { month: 'Jun', mangrove: 26.8, peatland: 16.2, redd: 14.2, soil: 21.5, watershed: 17.2 },
  { month: 'Jul', mangrove: 27.2, peatland: 15.8, redd: 13.8, soil: 21.8, watershed: 17.5 },
  { month: 'Aug', mangrove: 27.5, peatland: 15.5, redd: 13.5, soil: 22.1, watershed: 17.8 },
  { month: 'Sep', mangrove: 27.8, peatland: 15.8, redd: 13.2, soil: 22.4, watershed: 18.0 },
  { month: 'Oct', mangrove: 28.0, peatland: 15.5, redd: 13.0, soil: 22.6, watershed: 18.2 },
  { month: 'Nov', mangrove: 28.2, peatland: 15.3, redd: 12.8, soil: 22.8, watershed: 18.5 },
  { month: 'Dec', mangrove: 28.4, peatland: 15.3, redd: 12.6, soil: 22.9, watershed: 18.75 },
];

export interface DrilldownData {
  type: 'region' | 'project' | 'instrument';
  id: string;
  title: string;
  subtitle?: string;
  metrics: { label: string; value: string; status?: 'healthy' | 'warning' | 'critical' }[];
  sectors?: string[];
  linkedDashboards?: string[];
  description?: string;
}
