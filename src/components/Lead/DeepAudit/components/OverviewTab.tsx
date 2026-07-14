import React, { useState } from "react";
import { ScoredLead } from "../../types";
import { Info, AlertTriangle, ChevronDown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MapPreview from "../../MapPreview";

interface OverviewTabProps {
  lead: ScoredLead;
  onStatusChange: (status: ScoredLead["status"]) => void;
  onEmailChange: (email: string) => void;
  onVerifyEmail: (email: string) => Promise<{ isValid: boolean; status: string; bounceRisk: string; details?: string }>;
  onAddNote: (noteText: string) => void;
  onRunAudit: () => void;
}

export default function OverviewTab({
  lead,
  onStatusChange,
  onEmailChange,
  onVerifyEmail,
  onAddNote,
  onRunAudit,
}: OverviewTabProps) {
  const [newNoteText, setNewNoteText] = useState("");
  const [emailVerificationResult, setEmailVerificationResult] = useState<{ isValid: boolean; status: string; bounceRisk: string; details?: string } | null>(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [expandedScoreSection, setExpandedScoreSection] = useState<string | null>(null);

  const handleVerifyEmail = async () => {
    if (!lead.email) return;
    setIsVerifyingEmail(true);
    setEmailVerificationResult(null);
    try {
      const res = await onVerifyEmail(lead.email);
      setEmailVerificationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleAddNoteClick = () => {
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText);
    setNewNoteText("");
  };

  const audit = lead.auditData;
  const footprintScore = audit?.digitalFootprintScore || 0;
  
  let scoreColor = "text-red-500 border-red-500/30 bg-red-500/10";
  let strokeColor = "#EF4444";
  let scoreLabel = "CRITICAL";

  if (footprintScore >= 80) {
    scoreColor = "text-green-500 border-green-500/30 bg-green-500/10";
    strokeColor = "#10B981";
    scoreLabel = "EXCELLENT";
  } else if (footprintScore >= 60) {
    scoreColor = "text-yellow-500 border-yellow-500/30 bg-yellow-500/10";
    strokeColor = "#F59E0B";
    scoreLabel = "AVERAGE";
  } else if (footprintScore >= 40) {
    scoreColor = "text-orange-500 border-orange-500/30 bg-orange-500/10";
    strokeColor = "#F97316";
    scoreLabel = "NEEDS WORK";
  }

  const getProgressColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-yellow-500";
    if (pct >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Health dial card */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Digital Footprint Score</span>
          
          {audit ? (
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#18181B" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="50" cy="50" r="40" 
                  stroke={strokeColor} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * footprintScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-cinzel font-bold text-white leading-none">{footprintScore}</span>
                <span className="text-[9px] font-semibold text-zinc-500 uppercase mt-1">/100 Max</span>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
              No Audit Data
            </div>
          )}

          {audit && (
            <div className="space-y-3 w-full flex flex-col items-center">
              <div className="space-y-1">
                <Badge className={`rounded-none font-bold text-[9px] uppercase px-3 py-1 ${scoreColor}`}>
                  {scoreLabel}
                </Badge>
                <span className="block text-[9px] text-zinc-500 mt-1">Maturity Level: {audit.aiBusinessSummary?.maturityLevel || "Seed"}</span>
              </div>
              <div className="flex gap-4 border-t border-zinc-900 pt-3 w-full justify-around">
                <div>
                  <span className="text-[8px] font-bold text-zinc-500 block uppercase tracking-wider">AEO Score</span>
                  <span className="text-sm font-mono font-bold text-[#C9A84C]">{audit.aeoGeoAnalysis?.aeoScore !== undefined ? `${audit.aeoGeoAnalysis.aeoScore}/100` : "N/A"}</span>
                </div>
                <div className="border-l border-zinc-905 h-6"></div>
                <div>
                  <span className="text-[8px] font-bold text-zinc-500 block uppercase tracking-wider">GEO Score</span>
                  <span className="text-sm font-mono font-bold text-[#C9A84C]">{audit.aeoGeoAnalysis?.geoScore !== undefined ? `${audit.aeoGeoAnalysis.geoScore}/100` : "N/A"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Prospect profile card */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 col-span-2">
          <h4 className="font-cinzel text-xs font-bold text-[#C9A84C] bg-white uppercase tracking-wider border-b border-zinc-900 pb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Company Directory Details
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[11px] leading-relaxed">
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Industry:</span>
              <span className="text-white font-medium">{audit?.businessInfo?.category || "Not Detected"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Google Rating:</span>
              <span className="text-[#F5C518] font-bold">⭐ {lead.rating !== null && lead.rating !== undefined ? `${lead.rating} ★` : "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Website URL:</span>
              <span className="text-white select-all max-w-[150px] truncate" title={lead.website || ""}>{lead.website || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Phone Number:</span>
              <span className="text-white select-all">{lead.phoneNumber || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Latitude:</span>
              <span className="text-zinc-300">{audit?.businessInfo?.latitude || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Longitude:</span>
              <span className="text-zinc-300">{audit?.businessInfo?.longitude || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Data Source:</span>
              <span className="text-zinc-400 font-mono text-[9px]">{audit?.businessInfo?.sourceOfData || "OSM, nominatim"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">Last Synced:</span>
              <span className="text-zinc-400">{audit?.businessInfo?.lastUpdated || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
              <span className="text-zinc-500">CRM Stage:</span>
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(e.target.value as ScoredLead["status"])}
                className="bg-black border border-zinc-800 text-[#F5F0E8] text-[10px] font-semibold px-2 py-0.5 outline-none cursor-pointer focus:border-[#C9A84C] rounded-none"
              >
                <option value="NEW">New Lead</option>
                <option value="CONTACTED">Contacted</option>
                <option value="PROPOSAL_SENT">Proposal Sent</option>
                <option value="CLOSED">Closed Deal</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-zinc-900 pt-3">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500">Outreach Email:</span>
              <div className="flex gap-2 items-center">
                <input 
                  type="email" 
                  value={lead.email || ""} 
                  onChange={(e) => {
                    onEmailChange(e.target.value);
                    setEmailVerificationResult(null);
                  }}
                  placeholder="prospect@domain.com"
                  className="bg-black border border-zinc-850 text-white px-2 py-0.5 text-right outline-none focus:border-[#C9A84C] rounded-none w-[180px] text-[10px]"
                />
                {lead.email && (
                  <Button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={isVerifyingEmail}
                    className="bg-zinc-900 hover:bg-[#C9A84C] hover:text-black text-[#C9A84C] border border-[#C9A84C]/25 text-[8px] rounded-none px-2.5 py-0.5 h-auto uppercase tracking-wider font-semibold"
                  >
                    {isVerifyingEmail ? "Verifying..." : "Verify"}
                  </Button>
                )}
              </div>
            </div>
            {emailVerificationResult && (
              <div className="flex justify-between items-center text-[9px] pt-1">
                <span className="text-zinc-600 font-mono">STATUS LOG:</span>
                <span className={`font-semibold ${emailVerificationResult.isValid ? "text-green-400" : "text-red-400"}`}>
                  {emailVerificationResult.status} (Bounce Risk: {emailVerificationResult.bounceRisk})
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CRM note logging & map row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CRM Note log */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 flex flex-col justify-between h-72">
          <div className="space-y-2">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">CRM Note Log</h4>
            <div className="h-44 overflow-y-auto bg-black p-3 border border-zinc-950 font-mono text-[10px] leading-relaxed text-[#F5F0E8]/70 scrollbar-none space-y-1.5">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((note, index) => (
                  <p key={index} className="border-b border-zinc-900 pb-1 text-left">
                    {note}
                  </p>
                ))
              ) : (
                <p className="text-zinc-600 italic text-center pt-16">No notes recorded for this prospect.</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Log meeting outcome or next action step..."
              className="bg-black border-zinc-900 text-white rounded-none focus-visible:ring-0 focus:border-[#C9A84C] text-[11px] h-9"
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddNoteClick(); }}
            />
            <Button
              onClick={handleAddNoteClick}
              className="bg-zinc-900 hover:bg-[#C9A84C] hover:text-black text-[#C9A84C] font-semibold text-xs px-4 rounded-none border border-zinc-800"
            >
              Log
            </Button>
          </div>
        </div>

        {/* Live map preview */}
        <MapPreview lat={Number(audit?.businessInfo?.latitude) || undefined} lng={Number(audit?.businessInfo?.longitude) || undefined} address={lead.address} businessName={lead.name} />

      </div>

      {/* Transparent Score Breakdown & AI executive summary */}
      {audit ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Left component scores (3 columns) */}
          <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 md:col-span-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
              Digital Audit Core Indicators
            </h4>
            
            <div className="space-y-3.5">
              {Object.entries(audit.breakdown || {}).map(([key, item]: [string, any]) => {
                const formattedName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const isExpanded = expandedScoreSection === key;
                
                return (
                  <div 
                    key={key} 
                    className="border border-zinc-950 bg-black/40 p-2.5 hover:border-zinc-800 transition-all cursor-pointer animate-none"
                    onClick={() => setExpandedScoreSection(isExpanded ? null : key)}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        {formattedName}
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500 rotate-180 transition-transform" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500 transition-transform" />}
                      </span>
                      <span className="font-mono text-[#C9A84C] font-bold">{item.score} / {item.max} Points</span>
                    </div>
                    
                    {/* Component progress bar */}
                    <div className="w-full bg-zinc-900 h-1.5 mt-2 rounded-none overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(item.score, item.max)}`}
                        style={{ width: `${Math.round((item.score / item.max) * 100)}%` }}
                      />
                    </div>

                    {/* Collapse details */}
                    {isExpanded && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-900 text-[10px] space-y-1.5 leading-relaxed animate-fadeIn">
                        <p><span className="text-zinc-500 font-semibold">Current Audit:</span> <span className="text-zinc-300">{item.reason}</span></p>
                        <p><span className="text-[#C9A84C] font-semibold">Recommendation:</span> <span className="text-zinc-300">{item.recommendation}</span></p>
                        <p><span className="text-green-400 font-semibold">Expected Uplift:</span> <span className="text-zinc-300">{item.expectedImprovement}</span></p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right summary (2 columns) */}
          <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 md:col-span-2 text-[11px] leading-relaxed">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C9A84C]" /> AI Growth Diagnosis
            </h4>
            
            <div className="space-y-3">
              <div>
                <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[9px]">Executive Summary:</span>
                <p className="text-zinc-300 font-sans">{audit.aiBusinessSummary?.digitalPresenceOverview}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-950 text-center">
                <div className="bg-zinc-950 p-2 border border-zinc-900">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase block">Opportunity Score</span>
                  <span className="text-lg font-cinzel font-bold text-[#C9A84C]">{audit.aiBusinessSummary?.opportunityScore || "85"}%</span>
                </div>
                <div className="bg-zinc-950 p-2 border border-zinc-900">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase block">Conversion Potential</span>
                  <span className={`text-sm font-cinzel font-bold block mt-1 ${
                    audit.aiBusinessSummary?.conversionPotential === "High" ? "text-green-400" : "text-yellow-400"
                  }`}>{audit.aiBusinessSummary?.conversionPotential || "High"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-950">
                <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[9px] mb-1">Confidence Score:</span>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                  <span>Confidence Level:</span>
                  <span className="text-green-400 font-bold">HIGH</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                  <span>API Used:</span>
                  <span>GBP Details, Overpass</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-yellow-600/20 p-6 text-center space-y-3 max-w-xl mx-auto">
          <h4 className="font-cinzel text-sm font-bold text-[#F5C518] uppercase tracking-wider flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-5 h-5" /> Full Audit Pending Execution
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            This prospect has only basic directory details. Execute the deep AI audit to scrape site speed, metadata, local citation benchmarks, and generate outreach blueprints.
          </p>
          <Button
            onClick={onRunAudit}
            className="bg-[#C9A84C] hover:bg-white text-black text-xs font-semibold uppercase tracking-wider px-6 py-2.5 h-auto rounded-none w-full"
          >
            Execute Deep AI Audit
          </Button>
        </div>
      )}
    </div>
  );
}
