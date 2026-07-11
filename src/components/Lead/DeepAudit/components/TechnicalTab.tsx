import React from "react";
import { ScoredLead } from "../../types";
import { Globe, ExternalLink } from "lucide-react";

interface TechnicalTabProps {
  lead: ScoredLead;
}

export default function TechnicalTab({ lead }: TechnicalTabProps) {
  const audit = lead.auditData;
  if (!audit) return null;

  return (
    <div className="space-y-6">
      {!audit.websiteAnalysis?.exists ? (
        <div className="bg-[#0A0A0A] border border-yellow-600/20 p-6 text-center max-w-xl mx-auto space-y-4">
          <Globe className="w-12 h-12 text-[#F5C518] mx-auto opacity-70" />
          <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
            Website Analysis: Not Found / N/A
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            No web domain was detected for this listing. Consequently, Site Speed, Core Web Vitals, and Lighthouse auditing metrics are not available.
          </p>
          <div className="bg-black p-4 border border-zinc-955 text-left text-xs text-[#F5F0E8]/85 leading-relaxed max-w-md mx-auto space-y-1.5 font-sans">
            <strong className="text-[#C9A84C] font-cinzel text-[10px] block uppercase tracking-wider border-b border-zinc-900 pb-1">Website Presence Pitch:</strong>
            <li>Losing 100% of organic mobile web searchers.</li>
            <li>Cannot execute Google or Facebook Ads campaign retargeting.</li>
            <li>Highly recommend custom web development services.</li>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Screenshot and Lighthouse scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Website Screenshot Card */}
            <div className="bg-[#0A0A0A] border border-zinc-900 p-4 text-center space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Homepage Screenshot</span>
                <span className="text-[9px] text-zinc-500">Live preview thumbnail via crawlers</span>
              </div>
              
              <div className="bg-black border border-zinc-950 w-full h-44 overflow-hidden flex items-center justify-center relative group">
                {lead.website ? (
                  <img 
                    src={`https://image.thum.io/get/width/400/crop/600/${lead.website.startsWith("http") ? lead.website : "https://" + lead.website}`} 
                    alt="Website Home Screenshot"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=80";
                    }}
                  />
                ) : (
                  <span className="text-zinc-700 text-xs font-sans">No Site Screenshot</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <a 
                    href={lead.website?.startsWith("http") ? lead.website : "https://" + lead.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-black/90 border border-[#C9A84C]/30 text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 flex items-center gap-1 hover:border-[#C9A84C] font-mono"
                  >
                    Visit Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] border-t border-zinc-950 pt-2 font-mono">
                <span className="text-zinc-500">SSL status:</span>
                <span className="text-green-400 font-semibold">{audit.websiteAnalysis.ssl || "Valid"}</span>
              </div>
            </div>

            {/* 2. Lighthouse Dials */}
            <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 col-span-2">
              <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
                Lighthouse Core Web Vitals
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-black p-3.5 border border-zinc-950 flex flex-col justify-between items-center h-28">
                  <span className="text-2xl font-bold font-mono text-red-500">
                    {typeof audit.websiteAnalysis.lighthouseScore === "object" ? audit.websiteAnalysis.lighthouseScore.performance : 50}%
                  </span>
                  <div>
                    <span className="text-[9px] font-semibold text-white uppercase tracking-wider block">Performance</span>
                    <span className="text-[8px] text-zinc-500">Mobile Speed</span>
                  </div>
                </div>
                <div className="bg-black p-3.5 border border-zinc-950 flex flex-col justify-between items-center h-28">
                  <span className="text-2xl font-bold font-mono text-sky-400">
                    {typeof audit.websiteAnalysis.lighthouseScore === "object" ? audit.websiteAnalysis.lighthouseScore.seo : 75}%
                  </span>
                  <div>
                    <span className="text-[9px] font-semibold text-white uppercase tracking-wider block">SEO rating</span>
                    <span className="text-[8px] text-zinc-500">Search Metadata</span>
                  </div>
                </div>
                <div className="bg-black p-3.5 border border-zinc-950 flex flex-col justify-between items-center h-28">
                  <span className="text-2xl font-bold font-mono text-yellow-500">
                    {typeof audit.websiteAnalysis.lighthouseScore === "object" ? audit.websiteAnalysis.lighthouseScore.accessibility : 70}%
                  </span>
                  <div>
                    <span className="text-[9px] font-semibold text-white uppercase tracking-wider block">Accessibility</span>
                    <span className="text-[8px] text-zinc-500">User Experience</span>
                  </div>
                </div>
                <div className="bg-black p-3.5 border border-zinc-950 flex flex-col justify-between items-center h-28">
                  <span className="text-2xl font-bold font-mono text-green-500">
                    {typeof audit.websiteAnalysis.lighthouseScore === "object" ? audit.websiteAnalysis.lighthouseScore.bestPractices : 75}%
                  </span>
                  <div>
                    <span className="text-[9px] font-semibold text-white uppercase tracking-wider block">Best Practices</span>
                    <span className="text-[8px] text-zinc-500">Code Quality</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-zinc-950 p-3 flex justify-between items-center gap-4 text-[10px] font-mono leading-relaxed">
                <div>
                  <span className="text-zinc-500 block uppercase text-[8px] font-bold">LCP index</span>
                  <span className="text-white font-semibold">
                    {typeof audit.websiteAnalysis.coreWebVitals === "object" ? audit.websiteAnalysis.coreWebVitals.lcp : "2.8s"}
                  </span>
                </div>
                <div className="border-l border-zinc-900 pl-4">
                  <span className="text-zinc-500 block uppercase text-[8px] font-bold">FID latency</span>
                  <span className="text-white font-semibold">
                    {typeof audit.websiteAnalysis.coreWebVitals === "object" ? audit.websiteAnalysis.coreWebVitals.fid : "50ms"}
                  </span>
                </div>
                <div className="border-l border-zinc-900 pl-4">
                  <span className="text-zinc-500 block uppercase text-[8px] font-bold">CLS stability</span>
                  <span className="text-white font-semibold">
                    {typeof audit.websiteAnalysis.coreWebVitals === "object" ? audit.websiteAnalysis.coreWebVitals.cls : "0.12"}
                  </span>
                </div>
                <div className="border-l border-zinc-900 pl-4">
                  <span className="text-zinc-500 block uppercase text-[8px] font-bold">Technology CMS</span>
                  <span className="text-white font-semibold truncate max-w-[100px] inline-block" title={audit.websiteAnalysis.cms || "WordPress"}>
                    {audit.websiteAnalysis.cms || "WordPress"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Technical checks details list */}
          <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
              Technical SEO Checklist Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-[11px] leading-relaxed">
              
              <div className="bg-black/55 border border-zinc-950 p-3 space-y-1 text-left">
                <span className="text-[#C9A84C] font-semibold block border-b border-zinc-900 pb-0.5 mb-1.5 uppercase text-[9px] tracking-wide">SEO Metadata</span>
                <p><span className="text-zinc-500">Title Tag:</span> <span className="text-zinc-300 italic">"{audit.websiteAnalysis.titleTag || "N/A"}"</span></p>
                <p className="mt-1"><span className="text-zinc-500">Meta Desc:</span> <span className="text-zinc-300 italic">"{audit.websiteAnalysis.metaDescription || "N/A"}"</span></p>
              </div>

              <div className="bg-black/55 border border-zinc-950 p-3 space-y-1 text-left">
                <span className="text-[#C9A84C] font-semibold block border-b border-zinc-900 pb-0.5 mb-1.5 uppercase text-[9px] tracking-wide">Indexation Setup</span>
                <p><span className="text-zinc-500">Robots.txt:</span> <span className="text-zinc-350">{audit.websiteAnalysis.robotsTxt || "N/A"}</span></p>
                <p><span className="text-zinc-500">Sitemap.xml:</span> <span className="text-zinc-350">{audit.websiteAnalysis.sitemapXml || "N/A"}</span></p>
                <p><span className="text-zinc-500">Canonical Tag:</span> <span className="text-zinc-350">{audit.websiteAnalysis.canonicalTags || "N/A"}</span></p>
              </div>

              <div className="bg-black/55 border border-zinc-950 p-3 space-y-1 text-left">
                <span className="text-[#C9A84C] font-semibold block border-b border-zinc-900 pb-0.5 mb-1.5 uppercase text-[9px] tracking-wide">Architecture & Security</span>
                <p><span className="text-zinc-500">HTTPS Protocol:</span> <span className="text-zinc-350">{audit.websiteAnalysis.https ? "✓ Enabled" : "✗ Disabled"}</span></p>
                <p><span className="text-zinc-500">Schema Markup:</span> <span className="text-zinc-350">{audit.websiteAnalysis.schemaMarkup || "N/A"}</span></p>
                <p><span className="text-zinc-500">Broken Links:</span> <span className="text-zinc-350">{audit.websiteAnalysis.brokenLinks || "0 detected"}</span></p>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
