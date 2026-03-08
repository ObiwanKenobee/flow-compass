export interface KpiData {
  label: string;
  value: string;
  delta: string;
  deltaDirection: 'up' | 'down';
  status: 'healthy' | 'warning' | 'critical' | 'stable';
  confidence: number;
  sparkline: number[];
  badge?: string;
}

export const kpiData: KpiData[] = [
  {
    label: 'Total Regenerative Capital Deployed',
    value: '$14.7B',
    delta: '+12.3%',
    deltaDirection: 'up',
    status: 'healthy',
    confidence: 94,
    sparkline: [30, 35, 32, 40, 45, 50, 55, 52, 60, 65, 70, 72],
  },
  {
    label: 'Undeployed Commitments',
    value: '$6.2B',
    delta: '-4.1%',
    deltaDirection: 'down',
    status: 'warning',
    confidence: 88,
    sparkline: [80, 78, 75, 72, 70, 68, 65, 63, 62, 60, 62, 62],
    badge: 'Stalling',
  },
  {
    label: 'Funding Gap — High-Risk Regions',
    value: '$2.4B',
    delta: '+8.2%',
    deltaDirection: 'up',
    status: 'critical',
    confidence: 79,
    sparkline: [15, 18, 20, 19, 22, 25, 23, 26, 28, 30, 32, 34],
    badge: 'Worsening',
  },
  {
    label: 'Average Impact-Adjusted ROI',
    value: '7.8%',
    delta: '+0.4pp',
    deltaDirection: 'up',
    status: 'healthy',
    confidence: 91,
    sparkline: [5, 5.5, 6, 6.2, 6.8, 7, 7.2, 7.4, 7.5, 7.6, 7.7, 7.8],
  },
  {
    label: 'Verified Carbon Credit Value',
    value: '$890M',
    delta: '+22.1%',
    deltaDirection: 'up',
    status: 'healthy',
    confidence: 86,
    sparkline: [40, 42, 45, 50, 55, 58, 62, 65, 70, 75, 80, 89],
  },
  {
    label: 'Microfinance Disbursement Velocity',
    value: '14.2 days',
    delta: '-2.1 days',
    deltaDirection: 'down',
    status: 'healthy',
    confidence: 92,
    sparkline: [22, 20, 19, 18, 17, 16, 16, 15, 15, 14.5, 14.3, 14.2],
  },
  {
    label: 'Climate Fund Utilization Rate',
    value: '68.4%',
    delta: '+3.2pp',
    deltaDirection: 'up',
    status: 'warning',
    confidence: 85,
    sparkline: [50, 52, 55, 57, 60, 61, 63, 64, 65, 66, 67, 68],
    badge: 'Below Target',
  },
  {
    label: 'Capital Concentration Risk',
    value: '0.72',
    delta: '+0.04',
    deltaDirection: 'up',
    status: 'warning',
    confidence: 90,
    sparkline: [0.55, 0.58, 0.6, 0.62, 0.64, 0.66, 0.67, 0.68, 0.69, 0.7, 0.71, 0.72],
    badge: 'Elevated',
  },
];

export interface FlowNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capitalIn: string;
  capitalOut: string;
  status: 'healthy' | 'warning' | 'critical';
  sectors: string[];
  gap?: string;
}

export const flowNodes: FlowNode[] = [
  { id: 'ea', name: 'East Africa', lat: 0, lng: 37, capitalIn: '$2.1B', capitalOut: '$340M', status: 'warning', sectors: ['Watershed', 'Agroforestry', 'Solar'], gap: '$890M' },
  { id: 'wa', name: 'West Africa', lat: 8, lng: -2, capitalIn: '$1.4B', capitalOut: '$180M', status: 'critical', sectors: ['Mangrove', 'Food Systems', 'Microfinance'], gap: '$1.2B' },
  { id: 'sa', name: 'South Asia', lat: 22, lng: 78, capitalIn: '$3.2B', capitalOut: '$520M', status: 'healthy', sectors: ['Clean Energy', 'Water', 'Resilience'], gap: '$420M' },
  { id: 'sea', name: 'Southeast Asia', lat: 5, lng: 110, capitalIn: '$2.8B', capitalOut: '$410M', status: 'healthy', sectors: ['Coral', 'Peatland', 'Agroforestry'], gap: '$380M' },
  { id: 'la', name: 'Latin America', lat: -15, lng: -55, capitalIn: '$2.6B', capitalOut: '$290M', status: 'warning', sectors: ['Amazon', 'Biodiversity', 'Indigenous'], gap: '$720M' },
  { id: 'pi', name: 'Pacific Islands', lat: -8, lng: 165, capitalIn: '$480M', capitalOut: '$45M', status: 'critical', sectors: ['Adaptation', 'Marine', 'Infrastructure'], gap: '$560M' },
  { id: 'na', name: 'North Africa', lat: 30, lng: 10, capitalIn: '$1.1B', capitalOut: '$150M', status: 'warning', sectors: ['Desertification', 'Solar', 'Water'], gap: '$640M' },
  { id: 'ce', name: 'Central Europe', lat: 48, lng: 15, capitalIn: '$4.1B', capitalOut: '$1.2B', status: 'healthy', sectors: ['Green Bond', 'Transition', 'Tech'], gap: '$120M' },
];

export interface FundingGapRow {
  region: string;
  adaptation: number;
  biodiversity: number;
  foodSystems: number;
  cleanEnergy: number;
  healthResilience: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export const fundingGapData: FundingGapRow[] = [
  { region: 'Nairobi Basin Flood Resilience', adaptation: 85, biodiversity: 40, foodSystems: 60, cleanEnergy: 30, healthResilience: 70, urgency: 'critical' },
  { region: 'Rift Valley Soil Regeneration', adaptation: 45, biodiversity: 75, foodSystems: 90, cleanEnergy: 20, healthResilience: 35, urgency: 'high' },
  { region: 'Coastal Mangrove Protection', adaptation: 60, biodiversity: 95, foodSystems: 30, cleanEnergy: 15, healthResilience: 50, urgency: 'high' },
  { region: 'Informal Settlement Micro-Resilience', adaptation: 90, biodiversity: 10, foodSystems: 55, cleanEnergy: 65, healthResilience: 85, urgency: 'critical' },
  { region: 'Rural Water Restoration', adaptation: 50, biodiversity: 55, foodSystems: 70, cleanEnergy: 25, healthResilience: 80, urgency: 'high' },
  { region: 'Amazon Corridor Conservation', adaptation: 35, biodiversity: 88, foodSystems: 45, cleanEnergy: 10, healthResilience: 25, urgency: 'medium' },
  { region: 'Pacific Atoll Adaptation', adaptation: 95, biodiversity: 70, foodSystems: 40, cleanEnergy: 50, healthResilience: 60, urgency: 'critical' },
  { region: 'Sahel Desertification Buffer', adaptation: 80, biodiversity: 65, foodSystems: 85, cleanEnergy: 45, healthResilience: 55, urgency: 'high' },
];

export interface ImpactProject {
  name: string;
  financialReturn: number;
  impactReturn: number;
  capitalDeployed: number;
  riskTier: 'low' | 'medium' | 'high';
  verified: boolean;
  region: string;
  sector: string;
}

export const impactProjects: ImpactProject[] = [
  { name: 'Kenya Watershed Restoration', financialReturn: 6.2, impactReturn: 8.8, capitalDeployed: 120, riskTier: 'medium', verified: true, region: 'East Africa', sector: 'Water' },
  { name: 'Borneo Peatland Recovery', financialReturn: 4.1, impactReturn: 9.5, capitalDeployed: 85, riskTier: 'high', verified: true, region: 'Southeast Asia', sector: 'Ecosystem' },
  { name: 'Rajasthan Solar Micro-Grid', financialReturn: 11.2, impactReturn: 6.4, capitalDeployed: 200, riskTier: 'low', verified: true, region: 'South Asia', sector: 'Energy' },
  { name: 'Colombian Mangrove Credits', financialReturn: 8.5, impactReturn: 7.9, capitalDeployed: 65, riskTier: 'medium', verified: true, region: 'Latin America', sector: 'Blue Carbon' },
  { name: 'Sahel Agroforestry Network', financialReturn: 3.8, impactReturn: 9.1, capitalDeployed: 45, riskTier: 'high', verified: false, region: 'West Africa', sector: 'Food Systems' },
  { name: 'Bangladesh Flood Resilience', financialReturn: 5.6, impactReturn: 8.2, capitalDeployed: 150, riskTier: 'medium', verified: true, region: 'South Asia', sector: 'Adaptation' },
  { name: 'Nordic Green Bond Fund', financialReturn: 9.8, impactReturn: 4.2, capitalDeployed: 500, riskTier: 'low', verified: true, region: 'Europe', sector: 'Finance' },
  { name: 'Tuvalu Marine Reserve', financialReturn: 2.1, impactReturn: 9.8, capitalDeployed: 18, riskTier: 'high', verified: false, region: 'Pacific Islands', sector: 'Marine' },
  { name: 'Amazon REDD+ Corridor', financialReturn: 7.2, impactReturn: 8.6, capitalDeployed: 310, riskTier: 'medium', verified: true, region: 'Latin America', sector: 'Forest' },
  { name: 'India Clean Cookstove Fund', financialReturn: 10.5, impactReturn: 7.1, capitalDeployed: 95, riskTier: 'low', verified: true, region: 'South Asia', sector: 'Health' },
];

export interface ClimateFundStage {
  fund: string;
  pledged: number;
  approved: number;
  contracted: number;
  released: number;
  deployed: number;
  verified: number;
}

export const climateFundData: ClimateFundStage[] = [
  { fund: 'Green Climate Fund', pledged: 12400, approved: 8900, contracted: 6200, released: 4800, deployed: 3200, verified: 1800 },
  { fund: 'Adaptation Fund', pledged: 1200, approved: 980, contracted: 720, released: 580, deployed: 420, verified: 280 },
  { fund: 'GEF Trust Fund', pledged: 5600, approved: 4200, contracted: 3100, released: 2400, deployed: 1900, verified: 1200 },
  { fund: 'Climate Investment Funds', pledged: 8700, approved: 6500, contracted: 4800, released: 3600, deployed: 2800, verified: 1600 },
  { fund: 'Loss & Damage Fund', pledged: 800, approved: 320, contracted: 140, released: 60, deployed: 20, verified: 5 },
];

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export const sankeyData: SankeyLink[] = [
  { source: 'Sovereign Climate Fund', target: 'Blended Vehicle', value: 4200 },
  { source: 'Sovereign Climate Fund', target: 'Direct Grant', value: 1800 },
  { source: 'DFI Capital', target: 'Blended Vehicle', value: 3100 },
  { source: 'DFI Capital', target: 'Debt Instrument', value: 2400 },
  { source: 'Philanthropy', target: 'Direct Grant', value: 1200 },
  { source: 'Philanthropy', target: 'Catalytic Capital', value: 800 },
  { source: 'Carbon Markets', target: 'Credit Purchase', value: 890 },
  { source: 'Private Capital', target: 'Debt Instrument', value: 1600 },
  { source: 'Private Capital', target: 'Equity', value: 2200 },
  { source: 'Blended Vehicle', target: 'East Africa', value: 2800 },
  { source: 'Blended Vehicle', target: 'South Asia', value: 2400 },
  { source: 'Blended Vehicle', target: 'Latin America', value: 2100 },
  { source: 'Direct Grant', target: 'West Africa', value: 1400 },
  { source: 'Direct Grant', target: 'Pacific Islands', value: 480 },
  { source: 'Direct Grant', target: 'East Africa', value: 1120 },
  { source: 'Debt Instrument', target: 'South Asia', value: 2200 },
  { source: 'Debt Instrument', target: 'Southeast Asia', value: 1800 },
  { source: 'Catalytic Capital', target: 'West Africa', value: 500 },
  { source: 'Catalytic Capital', target: 'Pacific Islands', value: 300 },
  { source: 'Credit Purchase', target: 'Latin America', value: 450 },
  { source: 'Credit Purchase', target: 'Southeast Asia', value: 440 },
  { source: 'Equity', target: 'South Asia', value: 1200 },
  { source: 'Equity', target: 'East Africa', value: 1000 },
];

export interface InsightData {
  id: string;
  text: string;
  confidence: number;
  type: 'warning' | 'opportunity' | 'risk' | 'trend';
  sources: string[];
  action?: string;
}

export const insightsData: InsightData[] = [
  {
    id: '1',
    text: 'Restoration capital is concentrated in 3 regions while 7 high-vulnerability zones remain underfunded.',
    confidence: 92,
    type: 'risk',
    sources: ['Capital Flow Analysis', 'Vulnerability Index'],
    action: 'Review allocation balance across tier-1 vulnerable regions',
  },
  {
    id: '2',
    text: 'Carbon credit issuance increased 22%, but retirement volume declined 8%, indicating demand softening.',
    confidence: 87,
    type: 'warning',
    sources: ['Market Data Feed', 'Credit Registry'],
    action: 'Assess buyer pipeline and pricing pressure',
  },
  {
    id: '3',
    text: 'Microfinance disbursement rose 18% in flood-prone regions, but repayment stress suggests climate shock exposure.',
    confidence: 78,
    type: 'risk',
    sources: ['Microfinance Ledger', 'Climate Risk Model'],
    action: 'Deploy resilience-linked repayment mechanisms',
  },
  {
    id: '4',
    text: 'Blended finance vehicles outperforming pure grant by 3.2x on disbursement velocity this quarter.',
    confidence: 94,
    type: 'opportunity',
    sources: ['Fund Performance Data', 'Disbursement Tracker'],
    action: 'Scale blended structures in high-gap regions',
  },
  {
    id: '5',
    text: 'Loss & Damage Fund utilization at 2.5% — 97.5% of pledged capital remains undeployed after 18 months.',
    confidence: 96,
    type: 'warning',
    sources: ['Fund Pipeline Tracker', 'UNFCCC Reports'],
    action: 'Escalate implementation bottleneck analysis',
  },
];

export const flowTimeSeriesData = [
  { month: 'Jan', carbon: 120, microfinance: 80, grants: 200, debt: 150, credits: 60, insurance: 30 },
  { month: 'Feb', carbon: 135, microfinance: 85, grants: 190, debt: 165, credits: 65, insurance: 35 },
  { month: 'Mar', carbon: 145, microfinance: 92, grants: 210, debt: 180, credits: 72, insurance: 38 },
  { month: 'Apr', carbon: 160, microfinance: 98, grants: 195, debt: 200, credits: 80, insurance: 42 },
  { month: 'May', carbon: 175, microfinance: 105, grants: 220, debt: 210, credits: 88, insurance: 45 },
  { month: 'Jun', carbon: 190, microfinance: 112, grants: 205, debt: 225, credits: 95, insurance: 50 },
  { month: 'Jul', carbon: 210, microfinance: 120, grants: 230, debt: 240, credits: 102, insurance: 55 },
  { month: 'Aug', carbon: 225, microfinance: 128, grants: 215, debt: 255, credits: 110, insurance: 58 },
  { month: 'Sep', carbon: 240, microfinance: 135, grants: 245, debt: 270, credits: 118, insurance: 62 },
  { month: 'Oct', carbon: 255, microfinance: 142, grants: 235, debt: 280, credits: 125, insurance: 65 },
  { month: 'Nov', carbon: 270, microfinance: 148, grants: 260, debt: 295, credits: 132, insurance: 70 },
  { month: 'Dec', carbon: 290, microfinance: 155, grants: 250, debt: 310, credits: 140, insurance: 75 },
];
