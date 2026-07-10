export interface CompetitorInfo {
  name: string;
  website: string;
  rating: number;
  reviewsCount?: number;
  speed: number | string; // site load speed out of 100 or "N/A"
  seo: number | string; // seo score out of 100 or "N/A"
  socialPresence?: string;
  businessHours?: string;
  footprintScore?: number;
  strengths?: string;
  weaknesses?: string;
  advantage?: string; // Backward compatibility
}

export interface ScoreExplanation {
  score: number;
  max: number;
  reason: string;
  recommendation: string;
  expectedImprovement: string;
}

export interface ScoreBreakdown {
  websitePresence: ScoreExplanation;
  googleBusinessProfile: ScoreExplanation;
  reviews: ScoreExplanation;
  socialPresence: ScoreExplanation;
  businessInfo: ScoreExplanation;
  citations: ScoreExplanation;
}

export interface BusinessInfoData {
  name: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  googleMapsLink: string;
  latitude: string;
  longitude: string;
  openingHours: string;
  sourceOfData: string;
  lastUpdated: string;
}

export interface GBPData {
  profileExists: boolean;
  verifiedStatus: string; // "Verified" | "Unverified" | "Not Found"
  averageRating: number | string;
  totalReviews: number | string;
  reviewGrowth: string;
  latestReviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;
  photosCount: number | string;
  businessDescription: string;
  categories: string[];
  missingInformation: string[];
}

export interface WebsiteAnalysisData {
  exists: boolean;
  https: boolean | null;
  ssl: string;
  domainAge: string;
  hostingProvider: string;
  cms: string;
  technologyStack: string[];
  mobileFriendly: boolean | null;
  responsiveDesign: boolean | null;
  pageSpeed: number | string;
  coreWebVitals: {
    lcp: string;
    fid: string;
    cls: string;
  } | string;
  lighthouseScore: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
  } | string;
  titleTag: string;
  metaDescription: string;
  h1Tags: string[];
  imageOptimization: string;
  robotsTxt: string;
  sitemapXml: string;
  canonicalTags: string;
  schemaMarkup: string;
  brokenLinks: number | string;
  redirectIssues: string;
  accessibility: string | number;
  seoScore: number | string;
  performanceScore: number | string;
  securityScore: number | string;
}

export interface SocialMediaData {
  facebook: { url: string; followers: string; postingFrequency: string; lastActiveDate: string };
  instagram: { url: string; followers: string; postingFrequency: string; lastActiveDate: string };
  linkedin: { url: string; followers: string; postingFrequency: string; lastActiveDate: string };
  twitter: { url: string; followers: string; postingFrequency: string; lastActiveDate: string };
  youtube: { url: string; followers: string; postingFrequency: string; lastActiveDate: string };
  whatsapp: { url: string; followers: string; postingFrequency: string; lastActiveDate: string };
  missingPlatforms: string[];
}

export interface CompetitorComparisonData {
  name: string;
  website: string;
  rating: number;
  reviewsCount: number;
  speed: number | string;
  seo: number | string;
  socialPresence: string;
  businessHours: string;
  footprintScore: number;
  strengths: string;
  weaknesses: string;
}

export interface AIBusinessSummaryData {
  digitalPresenceOverview: string;
  majorIssues: string[];
  growthOpportunities: string[];
  businessStrengths: string[];
  overallHealthScore: number;
  maturityLevel: string; // "Seed" | "Emerging" | "Established" | "Leader"
  opportunityScore: number;
  leadScore: string; // "Hot Lead" | "Warm Lead" | "Cold Lead"
  conversionPotential: string; // "High" | "Medium" | "Low"
}

export interface RecommendationItem {
  title: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  estimatedImpact: "High" | "Medium" | "Low";
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  expectedROI: string;
  description: string;
}

export interface ConfidenceItem {
  confidenceLevel: "High" | "Medium" | "Low";
  dataSource: string;
  lastUpdated: string;
  apiUsed: string;
}

export interface AuditData {
  scrapedTextSnippet?: string;
  pageSpeed?: {
    performance: number;
    seo: number;
    bestPractices: number;
  } | null;
  digitalFootprintScore?: number;
  scoreCategory?: "HOT" | "WARM" | "COLD";
  reasoning?: string;
  breakdown?: ScoreBreakdown;
  businessInfo?: BusinessInfoData;
  googleBusinessProfile?: GBPData;
  websiteAnalysis?: WebsiteAnalysisData;
  socialMedia?: SocialMediaData;
  competitors?: CompetitorInfo[];
  aiBusinessSummary?: AIBusinessSummaryData;
  recommendations?: RecommendationItem[];
  confidenceScores?: Record<string, ConfidenceItem>;
  emailDraft?: string;
  whatsAppDraft?: string;
  followUpEmail1?: string;
  followUpEmail2?: string;

  // Backward compatibility fields to prevent compilation errors
  seoReport?: {
    titleTag: string;
    metaDescription: string;
    headings: string;
    speedAnalysis: string;
    bottlenecks: string[];
    recommendations: string[];
  };
  socialPresence?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    notes: string;
  };
  proposal?: {
    title: string;
    summary: string;
    painPoints: string[];
    strategy: string[];
    pricing: string;
  };
}

export interface ScoredLead {
  id: string;
  name: string;
  rating: number | null;
  website: string | null;
  address: string;
  phoneNumber: string | null;
  score: "HOT" | "WARM" | "COLD";
  outreachMessage: string;
  reasoning: string;
  
  // Client OS CRM Fields
  status: "NEW" | "CONTACTED" | "PROPOSAL_SENT" | "CLOSED";
  auditScore?: number; // Out of 100
  notes: string[];
  email?: string;
  auditData?: AuditData;
  auditProgress?: "idle" | "scraping" | "speedtest" | "analyzing" | "completed" | "failed";
  updatedAt?: string;
  priorityScore?: number;
}

export interface StatusLog {
  timestamp: string;
  text: string;
  type: "info" | "success" | "warning" | "error" | "action";
}

export interface Meeting {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  date: string;
  time: string;
  notes: string;
}

export interface Invoice {
  id: string;
  leadId: string;
  leadName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "PAID" | "PENDING";
  description: string;
}
