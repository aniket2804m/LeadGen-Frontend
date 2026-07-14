import React from "react";
import { ScoredLead } from "../../types";
import { Brain, Cpu, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AeoGeoTabProps {
  lead: ScoredLead;
}

export default function AeoGeoTab({ lead }: AeoGeoTabProps) {
  const audit = lead.auditData;
  if (!audit) return null;

  const aeoGeo = audit.aeoGeoAnalysis;

  if (!aeoGeo) {
    return (
      <div className="bg-[#0A0A0A] border border-zinc-900 p-6 text-center max-w-xl mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-[#F5C518] mx-auto opacity-70" />
        <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
          AEO & GEO Analysis Pending
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          This lead was audited before AEO & GEO analysis was integrated. Please re-run the deep AI audit to scrape the homepage content, search generative index citations, and compile generative metrics.
        </p>
      </div>
    );
  }

  const { aeoScore, aeoDetails, geoScore, geoDetails } = aeoGeo;

  // Utility to determine score colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: "#10B981", text: "text-green-500", label: "EXCELLENT" };
    if (score >= 60) return { stroke: "#F59E0B", text: "text-yellow-500", label: "AVERAGE" };
    if (score >= 40) return { stroke: "#F97316", text: "text-orange-500", label: "NEEDS WORK" };
    return { stroke: "#EF4444", text: "text-red-500", label: "POOR" };
  };

  const aeoColors = getScoreColor(aeoScore);
  const geoColors = getScoreColor(geoScore);

  const getMetricBadgeClass = (val: string | boolean | undefined) => {
    if (val === "High" || val === "Optimized" || val === true || val === "Yes") {
      return "bg-green-500/10 text-green-400 border border-green-500/20";
    }
    if (val === "Medium" || val === "Needs improvement" || val === "Needs Work") {
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
    }
    return "bg-red-500/10 text-red-400 border border-red-500/20";
  };

  return (
    <div className="space-y-6">
      {/* Introduction Info box */}
      <div className="bg-[#0A0A0A] border border-zinc-900 p-4 flex items-start gap-3.5 text-xs text-zinc-400 leading-relaxed">
        <Brain className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
        <div>
          <strong className="text-white font-cinzel uppercase tracking-wider block mb-1">What is AEO & GEO?</strong>
          <span className="font-sans text-zinc-300">
            <strong>Answer Engine Optimization (AEO)</strong> optimizes structure so search AI engines (like Gemini, ChatGPT, Perplexity) can parse your business details directly. 
            <strong>Generative Engine Optimization (GEO)</strong> ensures high-authority citations and positive mentions in LLM answers through directory authority, reviews sentiment, and citation diversity.
          </span>
        </div>
      </div>

      {/* Two dial rings side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AEO Score dial */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Answer Engine Optimization (AEO)</span>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#18181B" strokeWidth="7" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke={aeoColors.stroke} 
                strokeWidth="7" 
                fill="transparent" 
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * aeoScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-cinzel font-bold text-white leading-none">{aeoScore}</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase mt-1">/100 AEO</span>
            </div>
          </div>
          
          <Badge className={`rounded-none font-bold text-[9px] uppercase px-3 py-1 ${aeoColors.text} bg-transparent border`}>
            {aeoColors.label} INDEX
          </Badge>
        </div>

        {/* GEO Score dial */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#C9A84C]" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Generative Engine Optimization (GEO)</span>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#18181B" strokeWidth="7" fill="transparent" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke={geoColors.stroke} 
                strokeWidth="7" 
                fill="transparent" 
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * geoScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-cinzel font-bold text-white leading-none">{geoScore}</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase mt-1">/100 GEO</span>
            </div>
          </div>
          
          <Badge className={`rounded-none font-bold text-[9px] uppercase px-3 py-1 ${geoColors.text} bg-transparent border`}>
            {geoColors.label} INDEX
          </Badge>
        </div>

      </div>

      {/* Detailed parameters checklist grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AEO Parameter Panel */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4">
          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
            AEO Structural Parameters
          </h4>
          
          <div className="space-y-2.5 text-[11px] leading-relaxed">
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">Schema Markup Status:</span>
              <Badge className={`rounded-none text-[9px] uppercase ${getMetricBadgeClass(aeoDetails.schemaMarkup)}`}>
                {aeoDetails.schemaMarkup || "Missing"}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">FAQ Structuring (Q&A Pattern):</span>
              <Badge className={`rounded-none text-[9px] uppercase ${getMetricBadgeClass(aeoDetails.faqStructured ? "Yes" : "No")}`}>
                {aeoDetails.faqStructured ? "Structured" : "Not Found"}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">Conversational Readability:</span>
              <Badge className={`rounded-none text-[9px] uppercase ${getMetricBadgeClass(aeoDetails.conversationalReadability)}`}>
                {aeoDetails.conversationalReadability || "Low"}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">Factual Information Density:</span>
              <Badge className={`rounded-none text-[9px] uppercase ${getMetricBadgeClass(aeoDetails.factualDensity)}`}>
                {aeoDetails.factualDensity || "Low"}
              </Badge>
            </div>
          </div>
        </div>

        {/* GEO Parameter Panel */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4">
          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
            GEO Citation Parameters
          </h4>
          
          <div className="space-y-2.5 text-[11px] leading-relaxed">
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">Directory Citation Authority:</span>
              <Badge className={`rounded-none text-[9px] uppercase ${getMetricBadgeClass(geoDetails.citationAuthority)}`}>
                {geoDetails.citationAuthority || "Low"}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">Generative Sentiment Index:</span>
              <span className="font-mono font-bold text-white">{geoDetails.sentimentScore !== undefined ? `${geoDetails.sentimentScore}%` : "Not Available"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">Directory Source Diversity:</span>
              <Badge className={`rounded-none text-[9px] uppercase ${getMetricBadgeClass(geoDetails.sourceDiversity)}`}>
                {geoDetails.sourceDiversity || "Low"}
              </Badge>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5 border-zinc-900">
              <span className="text-zinc-500">AI Training Corp. Brand Mentions:</span>
              <Badge className={`rounded-none text-[9px] uppercase ${getMetricBadgeClass(geoDetails.brandMentionFrequency)}`}>
                {geoDetails.brandMentionFrequency || "Low"}
              </Badge>
            </div>
          </div>
        </div>

      </div>

      {/* Strengths & Recommendations lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AEO Optimization checklist */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4">
          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
            AEO Action Plan & Diagnosis
          </h4>
          
          <div className="space-y-4 text-[11px] leading-relaxed text-left">
            <div>
              <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[9px] mb-1.5">Detected Strengths:</span>
              {aeoDetails.strengths && aeoDetails.strengths.length > 0 ? (
                <ul className="space-y-1">
                  {aeoDetails.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-zinc-500 italic">No AEO structural strengths identified.</span>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-950">
              <span className="text-[#C9A84C] font-bold block uppercase tracking-wider text-[9px] mb-1.5">Recommendations:</span>
              {aeoDetails.recommendations && aeoDetails.recommendations.length > 0 ? (
                <ul className="space-y-1.5">
                  {aeoDetails.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AEO settings fully optimized.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* GEO Optimization checklist */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4">
          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
            GEO Action Plan & Diagnosis
          </h4>
          
          <div className="space-y-4 text-[11px] leading-relaxed text-left">
            <div>
              <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[9px] mb-1.5">Detected Strengths:</span>
              {geoDetails.strengths && geoDetails.strengths.length > 0 ? (
                <ul className="space-y-1">
                  {geoDetails.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-zinc-500 italic">No GEO citation strengths identified.</span>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-950">
              <span className="text-[#C9A84C] font-bold block uppercase tracking-wider text-[9px] mb-1.5">Recommendations:</span>
              {geoDetails.recommendations && geoDetails.recommendations.length > 0 ? (
                <ul className="space-y-1.5">
                  {geoDetails.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> GEO settings fully optimized.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
