import React from "react";
import { ScoredLead } from "./types";
import { ShieldAlert, TrendingUp, CheckCircle, AlertOctagon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompetitorAnalysisTabProps {
  lead: ScoredLead;
}

export default React.memo(function CompetitorAnalysisTab({ lead }: CompetitorAnalysisTabProps) {
  const audit = lead.auditData;
  const compList = audit?.competitors || [];
  
  // Calculate average competitor score
  const avgCompScore = compList.length > 0 
    ? Math.round(compList.reduce((acc, curr) => acc + (curr.footprintScore || 0), 0) / compList.length) 
    : 0;

  const subjectScore = audit?.digitalFootprintScore || 0;
  const isOutpaced = subjectScore < avgCompScore;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Panel */}
      <div className="border-b border-zinc-800 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-cinzel text-sm font-bold text-[#C9A84C] uppercase tracking-wider">
              Local Competitor Benchmark Analysis
            </h4>
            <p className="text-[10px] text-zinc-400 mt-1">
              Compare your digital health score against top nearby rivals to identify organic search gaps.
            </p>
          </div>
          <Badge className={`rounded-none border text-[10px] font-semibold tracking-wider ${
            isOutpaced 
              ? "bg-red-500/10 border-red-500/25 text-red-400" 
              : "bg-green-500/10 border-green-500/25 text-green-400"
          }`}>
            {isOutpaced ? "⚠️ Competitors Outpacing You" : "🏆 Leading Local Benchmark"}
          </Badge>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0D0D0D] border border-zinc-800 p-4 text-left">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Your Footprint Score</span>
          <span className="text-2xl font-bold font-cinzel text-white block mt-1">{subjectScore}/100</span>
          <p className="text-[10px] text-zinc-400 mt-1.5">
            Measured across site presence, reviews, GBP completeness, citations and socials.
          </p>
        </Card>
        <Card className="bg-[#0D0D0D] border border-zinc-800 p-4 text-left">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Competitor Avg Score</span>
          <span className="text-2xl font-bold font-cinzel text-[#C9A84C] block mt-1">{avgCompScore}/100</span>
          <p className="text-[10px] text-zinc-400 mt-1.5">
            Average digital optimization score of your top 2 closest geological competitors.
          </p>
        </Card>
        <Card className="bg-[#0D0D0D] border border-zinc-800 p-4 text-left">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Search Opportunity Index</span>
          <span className={`text-2xl font-bold font-cinzel block mt-1 ${isOutpaced ? "text-red-400" : "text-green-400"}`}>
            {isOutpaced ? "HIGH OPPORTUNITY" : "MODERATE"}
          </span>
          <p className="text-[10px] text-zinc-400 mt-1.5">
            {isOutpaced 
              ? "Closing performance and review gaps can help you outrank competitors immediately." 
              : "Your business has solid foundational pillars; focus on scaling review volume."}
          </p>
        </Card>
      </div>

      {/* Comparison Table */}
      <div className="bg-black border border-zinc-850 rounded-none overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-850 text-zinc-400 font-semibold text-[10px] uppercase tracking-wider">
              <th className="p-3">Business Name</th>
              <th className="p-3 text-center">Rating</th>
              <th className="p-3 text-center">Reviews</th>
              <th className="p-3 text-center">Website</th>
              <th className="p-3 text-center">SEO Score</th>
              <th className="p-3 text-center">Speed Score</th>
              <th className="p-3">Social Presence</th>
              <th className="p-3">Business Hours</th>
              <th className="p-3 text-center">Footprint Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {/* Subject Business */}
            <tr className="bg-[#C9A84C]/5 border-y border-[#C9A84C]/20 font-medium">
              <td className="p-3 font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C]"></span>
                {lead.name} (You)
              </td>
              <td className="p-3 text-center text-[#F5C518] font-bold">{lead.rating || "N/A"} ★</td>
              <td className="p-3 text-center text-white">{audit?.googleBusinessProfile?.totalReviews || 0}</td>
              <td className="p-3 text-center text-zinc-300">{lead.website ? "Yes" : "No"}</td>
              <td className="p-3 text-center text-sky-400 font-bold">{audit?.websiteAnalysis?.exists ? audit.websiteAnalysis.seoScore : "N/A"}</td>
              <td className="p-3 text-center text-red-400 font-bold">{audit?.websiteAnalysis?.exists ? audit.websiteAnalysis.pageSpeed : "N/A"}</td>
              <td className="p-3 text-zinc-300">
                {lead.website ? "Active Facebook/LinkedIn" : "Not Found"}
              </td>
              <td className="p-3 text-zinc-400 text-[10px] max-w-[130px] truncate" title={audit?.businessInfo?.openingHours || ""}>
                {audit?.businessInfo?.openingHours || "N/A"}
              </td>
              <td className="p-3 text-center font-bold text-white text-sm bg-[#C9A84C]/10 border-l border-[#C9A84C]/20">{subjectScore}</td>
            </tr>

            {/* Competitor Listings */}
            {compList.map((comp, idx) => (
              <tr key={idx} className="hover:bg-zinc-950/40 text-zinc-300 transition-colors">
                <td className="p-3 font-semibold text-white">{comp.name}</td>
                <td className="p-3 text-center text-[#F5C518] font-semibold">{comp.rating} ★</td>
                <td className="p-3 text-center">{comp.reviewsCount}</td>
                <td className="p-3 text-center font-mono text-[10px] text-zinc-400">
                  <a href={comp.website.startsWith("http") ? comp.website : `https://${comp.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {comp.website}
                  </a>
                </td>
                <td className="p-3 text-center text-sky-400">{comp.seo}</td>
                <td className="p-3 text-center text-green-400">{comp.speed}</td>
                <td className="p-3 text-[10px]">{comp.socialPresence}</td>
                <td className="p-3 text-[10px] truncate max-w-[130px]" title={comp.businessHours}>{comp.businessHours}</td>
                <td className="p-3 text-center font-semibold text-zinc-200 border-l border-zinc-900">{comp.footprintScore}</td>
              </tr>
            ))}

            {compList.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-zinc-500 italic">
                  No competitors loaded. Execute a deep AI audit to scrape local competitors.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Highlights: Strengths vs Weaknesses */}
      {compList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#051508]/15 border border-green-900/30 p-4 text-left">
            <h5 className="font-cinzel text-[11px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <CheckCircle className="w-4 h-4" /> Subject Strengths
            </h5>
            <ul className="space-y-2 text-[11px] text-zinc-300">
              {audit?.aiBusinessSummary?.businessStrengths?.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </li>
              )) || (
                <li className="italic text-zinc-500">None detected. Review scoring indicators.</li>
              )}
              {lead.rating && lead.rating >= 4.5 && (
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">•</span>
                  <span>Reputation rating of {lead.rating}★ signals solid brand trust over competitors.</span>
                </li>
              )}
            </ul>
          </Card>

          <Card className="bg-[#1C0F0F]/15 border border-red-950/40 p-4 text-left">
            <h5 className="font-cinzel text-[11px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <AlertOctagon className="w-4 h-4" /> Subject Weaknesses
            </h5>
            <ul className="space-y-2 text-[11px] text-zinc-300">
              {audit?.aiBusinessSummary?.majorIssues?.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span>{issue}</span>
                </li>
              )) || (
                <li className="italic text-zinc-500">None detected. Digital presence is optimized.</li>
              )}
              {compList.some(c => (c.reviewsCount || 0) > Number(audit?.googleBusinessProfile?.totalReviews || 0)) && (
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span>Rivals outpace your review volumes, causing them to capture more Maps placements.</span>
                </li>
              )}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
});
