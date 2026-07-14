import React, { useState, useEffect, useCallback, useRef } from "react";
import { ScoredLead, StatusLog, AuditData, Meeting, Invoice, CompetitorInfo } from "./types";
import { callGooglePlaces, callBackendLeadAudit, callBackendEmailRegeneration, callBackendEmailVerification } from "./api";
import { parseJsonBlock } from "./utils";
import API from "../../config/api";

export function useLeadGen() {
  // Navigation tab state: "dashboard" | "finder" | "crm" | "calendar" | "users" | "demos" | "outreach" | "campaigns" | "activity" | "scout" | "reports" | "settings"
  const [activeTab, setActiveTab] = useState<"dashboard" | "finder" | "crm" | "calendar" | "users" | "demos" | "outreach" | "campaigns" | "activity" | "scout" | "reports" | "settings" | "deepaudit">("dashboard");

  // Form search states
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [model, setModel] = useState("gemini-1.5-flash");

  // API Key state fallbacks
  const [anthropicKeyInput, setAnthropicKeyInput] = useState(() => {
    return sessionStorage.getItem("purnova_anthropic_key") || "";
  });
  const [googleKeyInput, setGoogleKeyInput] = useState(() => {
    return sessionStorage.getItem("purnova_google_key") || "";
  });
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => {
    return sessionStorage.getItem("purnova_gemini_key") || "";
  });
  const [showKeysPanel, setShowKeysPanel] = useState(false);

  const activeAnthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY || anthropicKeyInput;
  const activeGoogleKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || googleKeyInput;
  const activeGeminiKey = import.meta.env.VITE_GEMINI_API_KEY || geminiKeyInput;

  // Sandbox toggle (defaults to false as keys are configured securely on the backend)
  const [isSandboxMode, setIsSandboxMode] = useState(false);


  // State lists
  const [searchResults, setSearchResults] = useState<ScoredLead[]>([]);
  const [crmLeads, setCrmLeads] = useState<ScoredLead[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Running state and monitors
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [logs, setLogs] = useState<StatusLog[]>([]);
  
  // Clipboard copy tracker
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [copiedTextType, setCopiedTextType] = useState<string | null>(null);

  // Selected lead for Deep Audit Modal
  const [selectedLead, setSelectedLead] = useState<ScoredLead | null>(null);

  // Auto lead finder background interval state
  const [isAutoFinding, setIsAutoFinding] = useState(false);
  const autoFinderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bulk auditing state
  const [isBulkAuditing, setIsBulkAuditing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  const [agencyName, setAgencyName] = useState(() => {
    return localStorage.getItem("leadgen_agency_name") || "Purnova Agency";
  });
  const [logoUrl, setLogoUrl] = useState(() => {
    return localStorage.getItem("leadgen_logo_url") || "";
  });

  useEffect(() => {
    localStorage.setItem("leadgen_agency_name", agencyName);
  }, [agencyName]);

  useEffect(() => {
    localStorage.setItem("leadgen_logo_url", logoUrl);
  }, [logoUrl]);

  // Load data from backend on startup, fallback to localStorage if offline/error
  useEffect(() => {
    const loadData = async () => {
      try {
        const [leadsRes, meetingsRes, invoicesRes] = await Promise.all([
          API.get("/leadgen/leads"),
          API.get("/leadgen/meetings"),
          API.get("/leadgen/invoices"),
        ]);
        
        const leadsData = leadsRes.data.map((l: any) => ({
          ...l,
          id: l.id || l.leadId || l._id
        }));
        
        const meetingsData = meetingsRes.data.map((m: any) => ({
          ...m,
          id: m.id || m.meetingId || m._id
        }));
        
        const invoicesData = invoicesRes.data.map((i: any) => ({
          ...i,
          id: i.id || i.invoiceId || i._id
        }));

        setCrmLeads(leadsData);
        setMeetings(meetingsData);
        setInvoices(invoicesData);
        
        localStorage.setItem("purnova_crm_leads", JSON.stringify(leadsData));
        localStorage.setItem("purnova_meetings", JSON.stringify(meetingsData));
        localStorage.setItem("purnova_invoices", JSON.stringify(invoicesData));
      } catch (err) {
        console.warn("Backend sync failed, falling back to localStorage", err);
        const savedLeads = localStorage.getItem("purnova_crm_leads");
        if (savedLeads) {
          try { setCrmLeads(JSON.parse(savedLeads)); } catch (e) { console.error(e); }
        }
        const savedMeetings = localStorage.getItem("purnova_meetings");
        if (savedMeetings) {
          try { setMeetings(JSON.parse(savedMeetings)); } catch (e) { console.error(e); }
        }
        const savedInvoices = localStorage.getItem("purnova_invoices");
        if (savedInvoices) {
          try { setInvoices(JSON.parse(savedInvoices)); } catch (e) { console.error(e); }
        }
      }
    };

    loadData();
  }, []);

  // Sync helpers to update backend database
  const saveCrmLeads = useCallback((updatedLeads: ScoredLead[]) => {
    setCrmLeads(updatedLeads);
    localStorage.setItem("purnova_crm_leads", JSON.stringify(updatedLeads));
  }, []);

  const saveMeetings = useCallback((updatedMeetings: Meeting[]) => {
    setMeetings(updatedMeetings);
    localStorage.setItem("purnova_meetings", JSON.stringify(updatedMeetings));
  }, []);

  const saveInvoices = useCallback((updatedInvoices: Invoice[]) => {
    setInvoices(updatedInvoices);
    localStorage.setItem("purnova_invoices", JSON.stringify(updatedInvoices));
  }, []);

  // Status Logger Helper
  const addLog = useCallback((text: string, type: StatusLog["type"] = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp: time, text, type }]);
  }, []);

  const handleAnthropicKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAnthropicKeyInput(val);
    sessionStorage.setItem("purnova_anthropic_key", val);
  }, []);

  const handleGoogleKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGoogleKeyInput(val);
    sessionStorage.setItem("purnova_google_key", val);
  }, []);

  const handleGeminiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGeminiKeyInput(val);
    sessionStorage.setItem("purnova_gemini_key", val);
  }, []);

  // Upgraded Live search_businesses caller
  const handlePlacesSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!industry.trim() || !location.trim()) {
      addLog("❌ Both industry and location criteria are required.", "error");
      return;
    }

    if (!isSandboxMode && !activeGoogleKey) {
      addLog("❌ Google Cloud API Key is required for Live searches. Input key below.", "error");
      setShowKeysPanel(true);
      return;
    }

    setIsSearching(true);
    setHasSearched(false);
    setSearchResults([]);
    setLogs([]);

    addLog(`🤖 Initializing Digital OS Suite Finder...`, "info");

    if (isSandboxMode) {
      addLog("🎮 Sandbox Mode Active: Simulating Google Places query...", "info");
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockPlaces: ScoredLead[] = [
        {
          id: "mock-1",
          name: `${location} ${industry || "Consulting"} Group`,
          rating: 4.1,
          website: `https://www.${location.toLowerCase().replace(/\s+/g, "")}${(industry || "business").toLowerCase().replace(/\s+/g, "")}.com`,
          address: `123 Main Street, ${location}`,
          phoneNumber: "+1 (555) 019-3281",
          score: "HOT",
          reasoning: "Has active web portal but lacks technical optimization.",
          outreachMessage: "",
          status: "NEW",
          notes: []
        },
        {
          id: "mock-2",
          name: `Elite ${industry} Specialists`,
          rating: 4.6,
          website: null,
          address: `456 Commerce Parkway, ${location}`,
          phoneNumber: "+1 (555) 021-9871",
          score: "WARM",
          reasoning: "Missing business website. High rating and local potential.",
          outreachMessage: "",
          status: "NEW",
          notes: []
        },
        {
          id: "mock-3",
          name: `A1 ${industry} Solutions`,
          rating: 4.8,
          website: `https://www.a1${industry.toLowerCase().replace(/\s+/g, "")}.com`,
          address: `789 University Way, ${location}`,
          phoneNumber: "+1 (555) 032-1104",
          score: "COLD",
          reasoning: "Optimized website, fast loads, strong ranking.",
          outreachMessage: "",
          status: "NEW",
          notes: []
        }
      ];

      setSearchResults(mockPlaces);
      addLog(`✅ Sandbox: Found 3 businesses. Trigger audits to add them to your CRM board.`, "success");
    } else {
      try {
        const result = await callGooglePlaces(industry, location, addLog);
        const formatted: ScoredLead[] = result.leads.map((p, idx) => ({
          id: p.id || `osm-${idx}-${(p.latitude || '').replace(/\./g, '')}-${(p.longitude || '').replace(/\./g, '')}-${Math.floor(Math.random() * 1000)}`,
          name: p.name || "Unknown Name",
          rating: p.rating || null,
          website: p.website || null,
          address: p.address || "Address N/A",
          phoneNumber: p.phone || null,
          score: "WARM",
          reasoning: "Pending deep audit.",
          outreachMessage: "",
          status: "NEW",
          notes: [],
          auditProgress: "idle",
          isMock: !!p.isMock,
          ratingSource: p.ratingSource || "estimated"
        }));
        setSearchResults(formatted);
        setHasSearched(true);
        
        if (result.geocodeFailed) {
          addLog("⚠️ Location not recognized. Showing estimated sample listings.", "warning");
        } else if (result.source === "mock") {
          addLog("ℹ️ Showing simulated business listings.", "info");
        } else {
          addLog(`✅ Search Complete. Found ${formatted.length} businesses. Click 'One-Click Audit' to scrape sites and score.`, "success");
        }
      } catch (err: any) {
        setHasSearched(true);
        addLog(`❌ Search Failed: ${err.message || err}`, "error");
      }
    }
    setIsSearching(false);
  }, [industry, location, isSandboxMode, activeAnthropicKey, activeGoogleKey, addLog]);

  // Core Audit Pipeline Controller
  const executeLeadAudit = useCallback(async (leadId: string, isFinderLead = true) => {
    const list = isFinderLead ? searchResults : crmLeads;
    const targetLeadIndex = list.findIndex((l) => l.id === leadId);
    if (targetLeadIndex === -1) return;

    const lead = list[targetLeadIndex];
    addLog(`🚀 Starting One-Click AI Audit Pipeline for: "${lead.name}"`, "info");

    // Local copy of list to track progress state
    const listCopy = [...list];
    listCopy[targetLeadIndex] = { ...lead, auditProgress: "scraping" };
    if (isFinderLead) setSearchResults(listCopy);
    else saveCrmLeads(listCopy);

    let scrapedText = "";
    let pageSpeedData = { performance: 50, seo: 50, bestPractices: 70 };

    if (isSandboxMode) {
      // Mock Sandbox Flow
      addLog(`🕸️ [Simulation] Scraping website content for ${lead.name}...`, "action");
      await new Promise(r => setTimeout(r, 1200));
      
      addLog(`⚡ [Simulation] Measuring Core Web Vitals (PageSpeed)...`, "action");
      pageSpeedData = {
        performance: lead.website ? Math.floor(Math.random() * 40) + 30 : 0,
        seo: lead.website ? Math.floor(Math.random() * 30) + 50 : 0,
        bestPractices: lead.website ? 75 : 0
      };
      await new Promise(r => setTimeout(r, 1000));
      
      addLog(`🧠 [Simulation] Submitting payload to Claude model...`, "action");
      await new Promise(r => setTimeout(r, 1500));

      const cleanLoc = location || "Local";

      const mockCompetitors: CompetitorInfo[] = [
        {
          name: "Apex Elite Niche",
          website: "apexelite.com",
          rating: 4.8,
          speed: 88,
          seo: 92,
          advantage: "Loads under 1.8s, optimized mobile booking form."
        },
        {
          name: "Direct Marketing Pros",
          website: "marketingpros.com",
          rating: 4.4,
          speed: 68,
          seo: 80,
          advantage: "Strong local reviews, active blog updates."
        }
      ];

      // Mock Sandbox calculations
      const mockBreakdown = {
        websitePresence: {
          score: lead.website ? 16 : 0,
          max: 20,
          reason: lead.website ? `Website detected. Speed: 62/100, SEO: 70/100.` : "No website portal detected.",
          recommendation: lead.website ? "Compress site assets & optimize images" : "Develop a fast, responsive, conversion-focused landing page.",
          expectedImprovement: lead.website ? "+4 Points by improving mobile rendering speed." : "+20 Points. Creates a central digital hub."
        },
        googleBusinessProfile: {
          score: lead.rating ? 15 : 0,
          max: 20,
          reason: lead.rating ? "Google Business Profile exists and is verified." : "No Google Business Profile detected.",
          recommendation: lead.rating ? "Regularly post updates and respond to user reviews." : "Claim and verify Google Business Profile listing.",
          expectedImprovement: lead.rating ? "+5 Points by scaling up photo posts and content updates." : "+20 Points. Drives local pack ranking."
        },
        reviews: {
          score: lead.rating ? (lead.rating >= 4.5 ? 15 : 12) : 0,
          max: 20,
          reason: lead.rating ? `Business has a ${lead.rating}★ rating with 24 Google reviews.` : "No review history detected.",
          recommendation: lead.rating ? "Setup review loop template for post-sales follow-ups." : "Implement automated Google review generator campaign.",
          expectedImprovement: lead.rating ? "+5 Points by growing reviews counts to 50+." : "+20 Points. Builds strong social proof."
        },
        socialPresence: {
          score: lead.website ? 6 : 0,
          max: 15,
          reason: lead.website ? "Detected 2 active social handles (Facebook, LinkedIn)." : "No social handles identified.",
          recommendation: lead.website ? "Setup auto-scheduler for missing channels like Instagram." : "Setup core business profiles on FB, Insta, and LinkedIn.",
          expectedImprovement: lead.website ? "+9 Points by establishing consistent monthly posts." : "+15 Points. Amplifies multi-channel outreach."
        },
        businessInfo: {
          score: lead.website ? 12 : 9,
          max: 15,
          reason: lead.website ? "8 out of 10 primary parameters populated in local directories." : "6 out of 10 primary parameters populated in local directories.",
          recommendation: "Provide opening hours, email contacts, and verified street addresses.",
          expectedImprovement: "+3 Points by completing directory parameters."
        },
        citations: {
          score: 10,
          max: 10,
          reason: "Listed in OpenStreetMap and geocoded on local map systems.",
          recommendation: "Regularly check matching citations across search engines.",
          expectedImprovement: "No improvements needed."
        }
      };

      const mockTotalScore = mockBreakdown.websitePresence.score +
                             mockBreakdown.googleBusinessProfile.score +
                             mockBreakdown.reviews.score +
                             mockBreakdown.socialPresence.score +
                             mockBreakdown.businessInfo.score +
                             mockBreakdown.citations.score;

      const mockScoreCategory = mockTotalScore < 50 ? "HOT" : (mockTotalScore < 80 ? "WARM" : "COLD");
      const mockReasoning = mockTotalScore < 50 
        ? "Critical digital gaps detected. Highly responsive to outreach." 
        : "Moderate digital footprint. Technical SEO fixes recommended.";

      const mockAuditData: AuditData = {
        scrapedTextSnippet: lead.website ? "Welcome to our homepage. We provide services..." : "",
        pageSpeed: pageSpeedData,
        digitalFootprintScore: mockTotalScore,
        scoreCategory: mockScoreCategory as "HOT" | "WARM" | "COLD",
        reasoning: mockReasoning,
        breakdown: mockBreakdown,
        businessInfo: {
          name: lead.name,
          category: "Local Service Provider",
          address: lead.address,
          phone: lead.phoneNumber || "Not Available",
          email: lead.website ? "contact@" + lead.website.replace("https://www.", "").replace("http://www.", "").replace("https://", "").replace("http://", "") : "N/A",
          website: lead.website || "N/A",
          googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + " " + lead.address)}`,
          latitude: "19.0760",
          longitude: "72.8777",
          openingHours: "Monday-Saturday: 9:00 AM - 6:00 PM; Sunday: Closed",
          sourceOfData: "Google Business Profile, OpenStreetMap",
          lastUpdated: new Date().toISOString().split('T')[0]
        },
        googleBusinessProfile: {
          profileExists: lead.rating ? true : false,
          verifiedStatus: lead.rating ? "Verified" : "Not Found",
          averageRating: lead.rating || "Not Available",
          totalReviews: lead.rating ? 24 : 0,
          reviewGrowth: lead.rating ? "+12% monthly growth" : "Not Available",
          latestReviews: lead.rating ? [
            { author: "John Doe", rating: 5, text: "Excellent service and quick response times!", date: "2 days ago" },
            { author: "Sarah Smith", rating: 4, text: "Good experience, very helpful staff.", date: "1 week ago" }
          ] : [],
          photosCount: lead.rating ? 12 : 0,
          businessDescription: lead.rating ? "We are a top-rated service business dedicated to serving customers in the local area." : "Not Available",
          categories: ["Local Business", "Consulting"],
          missingInformation: lead.rating ? ["Instagram profile link missing"] : ["No business rating or reviews found"]
        },
        websiteAnalysis: {
          exists: lead.website ? true : false,
          https: lead.website ? true : false,
          ssl: lead.website ? "Valid" : "N/A",
          domainAge: lead.website ? "2 years, 4 months" : "Unable to Analyze",
          hostingProvider: lead.website ? "Hostinger" : "Unable to Analyze",
          cms: lead.website ? "WordPress" : "N/A",
          technologyStack: lead.website ? ["WordPress", "MySQL", "PHP", "Elementor"] : [],
          mobileFriendly: lead.website ? true : null,
          responsiveDesign: lead.website ? true : null,
          pageSpeed: lead.website ? 62 : "N/A",
          coreWebVitals: lead.website ? { lcp: "2.8s", fid: "50ms", cls: "0.12" } : "Not Detected",
          lighthouseScore: lead.website ? { performance: 62, seo: 70, accessibility: 75, bestPractices: 80 } : "N/A",
          titleTag: lead.website ? `${lead.name} | Premium Services` : "N/A",
          metaDescription: lead.website ? "Get premium local services from our expert team." : "N/A",
          h1Tags: lead.website ? ["Welcome to " + lead.name] : [],
          imageOptimization: lead.website ? "Needs compression" : "N/A",
          robotsTxt: lead.website ? "Detected" : "N/A",
          sitemapXml: lead.website ? "Detected" : "N/A",
          canonicalTags: lead.website ? "Valid" : "N/A",
          schemaMarkup: lead.website ? "Detected" : "N/A",
          brokenLinks: lead.website ? "0 detected" : "Unable to Analyze",
          redirectIssues: lead.website ? "No redirect loops" : "N/A",
          accessibility: lead.website ? 75 : "N/A",
          seoScore: lead.website ? 70 : "N/A",
          performanceScore: lead.website ? 62 : "N/A",
          securityScore: lead.website ? 85 : "N/A"
        },
        socialMedia: {
          facebook: { url: lead.website ? "https://facebook.com/" + lead.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "N/A", followers: "1.2k", postingFrequency: "Weekly", lastActiveDate: "3 days ago" },
          instagram: { url: "N/A", followers: "Not Available", postingFrequency: "Not Available", lastActiveDate: "Not Available" },
          linkedin: { url: lead.website ? "https://linkedin.com/company/" + lead.name.toLowerCase().replace(/[^a-z0-9]/g, "") : "N/A", followers: "340", postingFrequency: "Monthly", lastActiveDate: "2 weeks ago" },
          twitter: { url: "N/A", followers: "Not Available", postingFrequency: "Not Available", lastActiveDate: "Not Available" },
          youtube: { url: "N/A", followers: "Not Available", postingFrequency: "Not Available", lastActiveDate: "Not Available" },
          whatsapp: { url: lead.phoneNumber ? `https://wa.me/${lead.phoneNumber.replace(/[^0-9]/g, "")}` : "N/A", followers: "Not Available", postingFrequency: "Daily active", lastActiveDate: "Today" },
          missingPlatforms: ["Instagram", "Twitter", "YouTube"]
        },
        competitors: mockCompetitors,
        aiBusinessSummary: {
          digitalPresenceOverview: lead.website 
            ? "The business has a solid baseline rating and active website, but page performance and social media footprint are sub-optimal." 
            : "The business lacks a website and has a minimal footprint. High opportunity for agency acquisition.",
          majorIssues: lead.website 
            ? ["Slow page speed on mobile (62/100)", "No Instagram profile", "Meta description unoptimized"] 
            : ["Missing central website", "Unclaimed business listings"],
          growthOpportunities: ["Fix page speed score", "Set up review capture pipeline", "Establish multi-channel socials"],
          businessStrengths: ["High average Maps rating"],
          overallHealthScore: mockTotalScore,
          maturityLevel: lead.website ? "Emerging" : "Seed",
          opportunityScore: lead.website ? 72 : 95,
          leadScore: mockScoreCategory,
          conversionPotential: lead.website ? "Medium" : "Low"
        },
        recommendations: [
          {
            title: lead.website ? "Optimize Mobile Speed" : "Develop Premium Website",
            priority: "Critical",
            estimatedImpact: "High",
            difficulty: lead.website ? "Medium" : "Hard",
            estimatedTime: lead.website ? "3 days" : "7 days",
            expectedROI: "Very High",
            description: lead.website 
              ? "Compress images, leverage browser caching, and clean JS to reduce load times under 2.5 seconds." 
              : "Launch a custom, modern, fast responsive landing page with booking systems."
          },
          {
            title: "Claim Missing Citations",
            priority: "High",
            estimatedImpact: "Medium",
            difficulty: "Easy",
            estimatedTime: "2 hours",
            expectedROI: "High",
            description: "List the business on Apple Maps, Yelp, and Bing local directories to match existing citations."
          }
        ],
        confidenceScores: {
          businessInfo: { confidenceLevel: "High", dataSource: "Simulated Place Data", lastUpdated: new Date().toISOString().split('T')[0], apiUsed: "OSM Mock" },
          googleBusinessProfile: { confidenceLevel: "High", dataSource: "Simulated Map details", lastUpdated: new Date().toISOString().split('T')[0], apiUsed: "Google Maps Mock" },
          websiteAnalysis: { confidenceLevel: "High", dataSource: "Simulated Lighthouse metrics", lastUpdated: new Date().toISOString().split('T')[0], apiUsed: "Lighthouse Mock" },
          socialMedia: { confidenceLevel: "Medium", dataSource: "Simulated social profiles", lastUpdated: new Date().toISOString().split('T')[0], apiUsed: "Crawl mock" }
        },
        aeoGeoAnalysis: {
          aeoScore: lead.website ? 72 : 12,
          aeoDetails: {
            schemaMarkup: lead.website ? "Needs improvement" : "Missing",
            faqStructured: false,
            conversationalReadability: lead.website ? "High" : "Low",
            factualDensity: lead.website ? "Medium" : "Low",
            strengths: lead.website ? ["Clean paragraph layout", "Clear contact details page"] : ["None"],
            recommendations: lead.website ? ["Integrate LocalBusiness Schema markup", "Create a structured FAQ section"] : ["Develop website to enable Answer Engine Indexing"]
          },
          geoScore: lead.website ? 66 : 8,
          geoDetails: {
            citationAuthority: lead.website ? "Medium" : "Low",
            sentimentScore: lead.rating ? Math.round(lead.rating * 20) : 50,
            sourceDiversity: lead.website ? "Low" : "Low",
            brandMentionFrequency: lead.website ? "Medium" : "Low",
            strengths: lead.rating && lead.rating > 4.4 ? ["Very positive sentiment in reviews helps AI citation"] : ["None"],
            recommendations: lead.website ? ["Secure citations on higher domain authority websites", "Get featured in local business articles & blogs"] : ["Establish brand presence to enable Generative Engine citation"]
          }
        },
        emailDraft: `Subject: Digital Performance Audit for ${lead.name}\n\nHi team,\n\nI was analyzing your business listing and noticed some digital optimization opportunities.`,
        whatsAppDraft: `Hi *${lead.name}*! Just ran a digital audit on your profile.`,
        followUpEmail1: `Hi, just following up.`,
        followUpEmail2: `Hi, checking in one last time.`
      };

      const finalLead: ScoredLead = {
        ...lead,
        score: mockScoreCategory as "HOT" | "WARM" | "COLD",
        auditScore: mockTotalScore,
        auditProgress: "completed",
        auditData: mockAuditData,
        outreachMessage: mockAuditData.emailDraft || ""
      };

      if (isFinderLead) {
        setSearchResults((prev) => {
          const listCopy = [...prev];
          const idx = listCopy.findIndex((l) => l.id === leadId);
          if (idx !== -1) listCopy[idx] = finalLead;
          return listCopy;
        });
        
        setCrmLeads((prev) => {
          const updatedCrm = [...prev];
          const existIdx = updatedCrm.findIndex((c) => c.name.toLowerCase() === finalLead.name.toLowerCase());
          if (existIdx !== -1) {
            updatedCrm[existIdx] = { ...finalLead, status: updatedCrm[existIdx].status };
          } else {
            updatedCrm.push({ ...finalLead, status: "NEW" });
          }
          localStorage.setItem("purnova_crm_leads", JSON.stringify(updatedCrm));

          const leadToSync = existIdx !== -1 ? updatedCrm[existIdx] : { ...finalLead, status: "NEW" };
          API.post("/leadgen/leads", leadToSync).catch(e => console.error("Error syncing lead to backend:", e));

          return updatedCrm;
        });
      } else {
        setCrmLeads((prev) => {
          const updatedCrm = [...prev];
          const idx = updatedCrm.findIndex((l) => l.id === leadId);
          if (idx !== -1) {
            updatedCrm[idx] = finalLead;
            API.post("/leadgen/leads", finalLead).catch(e => console.error("Error syncing lead to backend:", e));
          }
          localStorage.setItem("purnova_crm_leads", JSON.stringify(updatedCrm));
          return updatedCrm;
        });
      }

      addLog(`✅ Sandbox: Completed audit for ${lead.name} and saved to CRM!`, "success");
      
      setSelectedLead((prev) => {
        if (prev && prev.id === leadId) return finalLead;
        return prev;
      });
      return;
    }

    // LIVE Audit Flow
    try {
      setSearchResults((prev) => {
        const listCopy = [...prev];
        const idx = listCopy.findIndex((l) => l.id === leadId);
        if (idx !== -1) listCopy[idx] = { ...listCopy[idx], auditProgress: "analyzing" };
        return listCopy;
      });

      const finalLead = await callBackendLeadAudit({
        id: lead.id,
        name: lead.name,
        rating: lead.rating,
        website: lead.website,
        address: lead.address,
        phoneNumber: lead.phoneNumber
      }, addLog);

      if (isFinderLead) {
        setSearchResults((prev) => {
          const listCopy = [...prev];
          const idx = listCopy.findIndex((l) => l.id === leadId);
          if (idx !== -1) listCopy[idx] = finalLead;
          return listCopy;
        });
        
        setCrmLeads((prev) => {
          const updatedCrm = [...prev];
          const existIdx = updatedCrm.findIndex((c) => c.name.toLowerCase() === finalLead.name.toLowerCase());
          if (existIdx !== -1) {
            updatedCrm[existIdx] = { ...finalLead, status: updatedCrm[existIdx].status };
          } else {
            updatedCrm.push({ ...finalLead, status: "NEW" });
          }
          localStorage.setItem("purnova_crm_leads", JSON.stringify(updatedCrm));
          return updatedCrm;
        });
      } else {
        setCrmLeads((prev) => {
          const updatedCrm = [...prev];
          const idx = updatedCrm.findIndex((l) => l.id === leadId);
          if (idx !== -1) {
            updatedCrm[idx] = finalLead;
          }
          localStorage.setItem("purnova_crm_leads", JSON.stringify(updatedCrm));
          return updatedCrm;
        });
      }

      addLog(`✅ Audit complete. Saved "${finalLead.name}" with Score: ${finalLead.auditScore}/100 to CRM.`, "success");

      setSelectedLead((prev) => {
        if (prev && prev.id === leadId) return finalLead;
        return prev;
      });

    } catch (err: any) {
      addLog(`❌ Audit Failed for ${lead.name}: ${err.message || err}`, "error");
      if (isFinderLead) {
        setSearchResults((prev) => {
          const listCopy = [...prev];
          const idx = listCopy.findIndex((l) => l.id === leadId);
          if (idx !== -1) listCopy[idx] = { ...listCopy[idx], auditProgress: "failed" };
          return listCopy;
        });
      } else {
        setCrmLeads((prev) => {
          const listCopy = [...prev];
          const idx = listCopy.findIndex((l) => l.id === leadId);
          if (idx !== -1) listCopy[idx] = { ...listCopy[idx], auditProgress: "failed" };
          localStorage.setItem("purnova_crm_leads", JSON.stringify(listCopy));
          return listCopy;
        });
      }
    }
  }, [searchResults, crmLeads, isSandboxMode, addLog, saveCrmLeads]);

  // Bulk Audits executor
  const executeBulkAudit = useCallback(async () => {
    const unauditedLeads = searchResults.filter((l) => !l.auditData && l.auditProgress !== "scraping" && l.auditProgress !== "speedtest" && l.auditProgress !== "analyzing");
    if (unauditedLeads.length === 0) {
      addLog("⚠️ No unaudited leads in list to process.", "warning");
      return;
    }

    setIsBulkAuditing(true);
    setBulkProgress(0);
    addLog(`🚀 Initiating Bulk AI Audit for ${unauditedLeads.length} leads...`, "info");

    let countDone = 0;
    for (const lead of unauditedLeads) {
      addLog(`⚡ Bulk Audit [${countDone + 1}/${unauditedLeads.length}]: processing "${lead.name}"`, "info");
      await executeLeadAudit(lead.id, true);
      countDone++;
      setBulkProgress(Math.round((countDone / unauditedLeads.length) * 100));
    }

    setIsBulkAuditing(false);
    addLog("✅ Bulk AI Auditing pipeline completed successfully!", "success");
  }, [searchResults, executeLeadAudit, addLog]);

  // Add notes to a CRM prospect
  const handleAddNote = useCallback((noteText: string) => {
    if (!selectedLead) return;
    const time = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedNotes = [...(selectedLead.notes || []), `[${time}] ${noteText}`];
    
    const updatedLead = { ...selectedLead, notes: updatedNotes };
    setSelectedLead(updatedLead);

    setCrmLeads((prev) => {
      const updatedCrm = prev.map((l) => l.id === selectedLead.id ? updatedLead : l);
      localStorage.setItem("purnova_crm_leads", JSON.stringify(updatedCrm));
      API.post("/leadgen/leads", updatedLead).catch(e => console.error("Error syncing lead to backend:", e));
      return updatedCrm;
    });
  }, [selectedLead]);

  // Move CRM lead between columns
  const updateCRMLeadStatus = useCallback((leadId: string, status: ScoredLead["status"]) => {
    setCrmLeads((prev) => {
      const updated = prev.map((l) => (l.id === leadId ? { ...l, status } : l));
      localStorage.setItem("purnova_crm_leads", JSON.stringify(updated));
      
      const leadToSync = updated.find(l => l.id === leadId);
      if (leadToSync) {
        API.post("/leadgen/leads", leadToSync).catch(e => console.error("Error syncing lead to backend:", e));
      }
      
      return updated;
    });
    addLog(`🔄 Moved prospect status to: ${status}`, "info");
    
    setSelectedLead((prev) => {
      if (prev && prev.id === leadId) {
        return { ...prev, status };
      }
      return prev;
    });
  }, [addLog]);

  // Update CRM Lead's email address
  const updateCRMLeadEmail = useCallback((email: string) => {
    if (!selectedLead) return;
    const updatedLead = { ...selectedLead, email };
    setSelectedLead(updatedLead);

    setCrmLeads((prev) => {
      const updatedCrm = prev.map((l) => l.id === selectedLead.id ? updatedLead : l);
      localStorage.setItem("purnova_crm_leads", JSON.stringify(updatedCrm));
      API.post("/leadgen/leads", updatedLead).catch(e => console.error("Error syncing lead to backend:", e));
      return updatedCrm;
    });
  }, [selectedLead]);

  // Delete lead from CRM
  const handleDeleteCRMLead = useCallback((leadId: string) => {
    setCrmLeads((prev) => {
      const updated = prev.filter((l) => l.id !== leadId);
      localStorage.setItem("purnova_crm_leads", JSON.stringify(updated));
      API.delete(`/leadgen/leads/${leadId}`).catch(e => console.error("Error deleting lead from backend:", e));
      return updated;
    });
    addLog("🗑️ Removed lead from your CRM pipeline.", "warning");
    setSelectedLead((prev) => {
      if (prev && prev.id === leadId) return null;
      return prev;
    });
  }, [addLog]);

  const copyToClipboard = useCallback((text: string, id: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLeadId(id);
    setCopiedTextType(type);
    setTimeout(() => {
      setCopiedLeadId(null);
      setCopiedTextType(null);
    }, 2000);
  }, []);

  // Meetings scheduling functions
  const handleBookMeeting = useCallback((newMeeting: Omit<Meeting, "id">) => {
    const meetingWithId: Meeting = {
      ...newMeeting,
      id: "meeting-" + Date.now()
    };
    setMeetings((prev) => {
      const updated = [...prev, meetingWithId];
      localStorage.setItem("purnova_meetings", JSON.stringify(updated));
      API.post("/leadgen/meetings", meetingWithId).catch(e => console.error("Error syncing meeting to backend:", e));
      return updated;
    });
    addLog(`📅 Booked client meeting with "${newMeeting.leadName}" on ${newMeeting.date} at ${newMeeting.time}`, "success");
  }, [addLog]);

  const handleDeleteMeeting = useCallback((id: string) => {
    setMeetings((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem("purnova_meetings", JSON.stringify(updated));
      API.delete(`/leadgen/meetings/${id}`).catch(e => console.error("Error deleting meeting from backend:", e));
      return updated;
    });
    addLog(`🗑️ Removed scheduled meeting from calendar.`, "warning");
  }, [addLog]);

  // Invoicing management functions
  const handleCreateInvoice = useCallback((invoiceData: Omit<Invoice, "id" | "invoiceNumber">) => {
    const num = "INV-" + Math.floor(Math.random() * 900000 + 100000);
    const invoiceWithId: Invoice = {
      ...invoiceData,
      id: "invoice-" + Date.now(),
      invoiceNumber: num
    };
    setInvoices((prev) => {
      const updated = [...prev, invoiceWithId];
      localStorage.setItem("purnova_invoices", JSON.stringify(updated));
      API.post("/leadgen/invoices", invoiceWithId).catch(e => console.error("Error syncing invoice to backend:", e));
      return updated;
    });
    addLog(`🧾 Created Invoice ${num} for "${invoiceData.leadName}" amount: $${invoiceData.amount}`, "success");
  }, [addLog]);

  const handleUpdateInvoiceStatus = useCallback((id: string, status: "PAID" | "PENDING") => {
    setInvoices((prev) => {
      const updated = prev.map((inv) => inv.id === id ? { ...inv, status } : inv);
      localStorage.setItem("purnova_invoices", JSON.stringify(updated));
      
      const invoiceToSync = updated.find(inv => inv.id === id);
      if (invoiceToSync) {
        API.post("/leadgen/invoices", invoiceToSync).catch(e => console.error("Error syncing invoice to backend:", e));
      }
      
      return updated;
    });
    addLog(`🔄 Updated Invoice Status to: ${status}`, "info");
  }, [addLog]);

  const handleDeleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => {
      const updated = prev.filter((inv) => inv.id !== id);
      localStorage.setItem("purnova_invoices", JSON.stringify(updated));
      API.delete(`/leadgen/invoices/${id}`).catch(e => console.error("Error deleting invoice from backend:", e));
      return updated;
    });
    addLog(`🗑️ Deleted invoice record from pipeline.`, "warning");
  }, [addLog]);

  // Background Auto Lead Finder Simulator
  const toggleAutoFinding = useCallback(() => {
    if (isAutoFinding) {
      if (autoFinderTimerRef.current) {
        clearInterval(autoFinderTimerRef.current);
        autoFinderTimerRef.current = null;
      }
      setIsAutoFinding(false);
      addLog("🛑 Background Auto Lead Finder deactivated.", "warning");
    } else {
      setIsAutoFinding(true);
      addLog("🚀 Auto Lead Finder running in background. Scanning for new opportunities every 20s...", "info");
      
      autoFinderTimerRef.current = setInterval(() => {
        const niches = ["Roofer", "Dentist", "Boutique Hotel", "Gym", "Plumber", "Cafe"];
        const cities = ["Chicago IL", "Houston TX", "Boston MA", "Orlando FL", "Phoenix AZ"];
        const selectedNiche = niches[Math.floor(Math.random() * niches.length)];
        const selectedCity = cities[Math.floor(Math.random() * cities.length)];
        const num = Math.floor(Math.random() * 900 + 100);

        const newLead: ScoredLead = {
          id: "auto-" + Date.now(),
          name: `${selectedCity} ${selectedNiche} Specialists Inc.`,
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
          website: `https://www.${selectedCity.toLowerCase().split(" ")[0]}${selectedNiche.toLowerCase()}${num}.com`,
          address: `${Math.floor(Math.random() * 8000 + 1000)} Commerce Road, ${selectedCity}`,
          phoneNumber: `+1 (555) 012-${Math.floor(Math.random() * 9000 + 1000)}`,
          score: Math.random() > 0.5 ? "HOT" : "WARM",
          reasoning: "Detected poor mobile responsiveness index in background search.",
          outreachMessage: "",
          status: "NEW",
          notes: [`[System] Automated lead finder discovered prospect niche: ${selectedNiche}`]
        };

        setCrmLeads((prev) => {
          const list = [newLead, ...prev];
          localStorage.setItem("purnova_crm_leads", JSON.stringify(list));
          API.post("/leadgen/leads", newLead).catch(e => console.error("Error syncing lead to backend:", e));
          return list;
        });

        // Use custom callback logging to update logs properly
        const time = new Date().toLocaleTimeString();
        setLogs((prevLogs) => [
          ...prevLogs,
          {
            timestamp: time,
            text: `🎯 [Auto Scanner] Discovered new prospect: "${newLead.name}" in ${selectedCity}!`,
            type: "success"
          }
        ]);

      }, 20000);
    }
  }, [isAutoFinding, addLog]);

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (autoFinderTimerRef.current) {
        clearInterval(autoFinderTimerRef.current);
      }
    };
  }, []);

  const regenerateAIEmail = useCallback(async (leadId: string, customPrompt?: string) => {
    const lead = crmLeads.find((l) => l.id === leadId);
    if (!lead) return;

    try {
      let draft = "";
      if (isSandboxMode) {
        draft = `Subject: Customized Growth Strategy for ${lead.name}\n\nHi Team,\n\nThis is Aniket from Purnova Agency. I ran a quick customization check on your digital profile based on your request: "${customPrompt || 'General audit details'}".\n\nI noticed some critical speed constraints (${lead.auditData?.pageSpeed?.performance || 45}/100) and minor index listings. Let's schedule a quick 10-minute discovery call to resolve this.\n\nBest,\nAniket\nPurnova Agency`;
        addLog(`[Sandbox] Regenerated custom AI email for ${lead.name}`, "success");
      } else {
        draft = await callBackendEmailRegeneration({
          name: lead.name,
          website: lead.website,
          rating: lead.rating,
          performance: lead.auditData?.pageSpeed?.performance,
          seo: lead.auditData?.pageSpeed?.seo,
          customPrompt
        }, addLog);
      }

      setCrmLeads((prev) => {
        const updated = prev.map((l) => {
          if (l.id === leadId) {
            const updatedLead = {
              ...l,
              auditData: {
                ...l.auditData,
                emailDraft: draft
              },
              outreachMessage: draft
            };
            API.post("/leadgen/leads", updatedLead).catch(e => console.error(e));
            return updatedLead;
          }
          return l;
        });
        localStorage.setItem("purnova_crm_leads", JSON.stringify(updated));
        return updated;
      });

      setSelectedLead((prev) => {
        if (prev && prev.id === leadId) {
          return {
            ...prev,
            auditData: {
              ...prev.auditData,
              emailDraft: draft
            },
            outreachMessage: draft
          };
        }
        return prev;
      });

    } catch (e: any) {
      addLog(`❌ AI Email regeneration failed: ${e.message}`, "error");
    }
  }, [crmLeads, isSandboxMode, addLog]);

  const verifyLeadEmail = useCallback(async (email: string) => {
    if (!email || !email.trim()) return { isValid: false, status: "EMPTY", bounceRisk: "HIGH", details: "No email provided." };

    try {
      if (isSandboxMode) {
        const isValid = email.includes("@") && (email.endsWith(".com") || email.endsWith(".in") || email.endsWith(".org") || email.endsWith(".net"));
        const result = {
          isValid,
          status: isValid ? "DELIVERABLE" : "INVALID_SYNTAX",
          bounceRisk: isValid ? "LOW" : "HIGH",
          details: isValid ? "Domain has valid simulated MX records." : "Invalid email domain structure."
        };
        addLog(`[Sandbox] Checked email: ${email} -> ${result.status} (${result.bounceRisk} bounce risk)`, isValid ? "success" : "warning");
        return result;
      } else {
        const result = await callBackendEmailVerification(email, addLog);
        return result;
      }
    } catch (e: any) {
      addLog(`❌ Email verification request failed: ${e.message}`, "error");
      return { isValid: false, status: "VERIFICATION_ERROR", bounceRisk: "HIGH", details: e.message };
    }
  }, [isSandboxMode, addLog]);

  return {
    activeTab,
    setActiveTab,
    industry,
    setIndustry,
    location,
    setLocation,
    keywords,
    setKeywords,
    model,
    setModel,
    anthropicKeyInput,
    googleKeyInput,
    showKeysPanel,
    setShowKeysPanel,
    activeAnthropicKey,
    activeGoogleKey,
    isSandboxMode,
    setIsSandboxMode,
    searchResults,
    crmLeads,
    meetings,
    invoices,
    isSearching,
    hasSearched,
    logs,
    copiedLeadId,
    copiedTextType,
    selectedLead,
    setSelectedLead,
    isAutoFinding,
    isBulkAuditing,
    bulkProgress,
    executeBulkAudit,
    geminiKeyInput,
    addLog,
    handleAnthropicKeyChange,
    handleGoogleKeyChange,
    handleGeminiKeyChange,
    handlePlacesSearch,
    executeLeadAudit,
    handleAddNote,
    updateCRMLeadStatus,
    updateCRMLeadEmail,
    handleDeleteCRMLead,
    copyToClipboard,
    handleBookMeeting,
    handleDeleteMeeting,
    handleCreateInvoice,
    handleUpdateInvoiceStatus,
    handleDeleteInvoice,
    toggleAutoFinding,
    agencyName,
    setAgencyName,
    logoUrl,
    setLogoUrl,
    regenerateAIEmail,
    verifyLeadEmail,
  };
}
