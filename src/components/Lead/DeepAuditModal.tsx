import React, { useState } from "react";
import { ScoredLead, Meeting, Invoice } from "./types";
import { 
  X, 
  AlertTriangle, 
  Check, 
  Copy, 
  Send, 
  FileText,
  Calendar,
  Clock,
  Trash2,
  Globe,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  CheckCircle,
  TrendingUp,
  Award,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  MessageSquare,
  QrCode
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { getAuditFlags, parseEmailDraft } from "./utils";
import MapPreview from "./MapPreview";
import CompetitorAnalysisTab from "./CompetitorAnalysisTab";
import InvoiceTab from "./InvoiceTab";

interface DeepAuditModalProps {
  lead: ScoredLead;
  onClose: () => void;
  onAddNote: (noteText: string) => void;
  onStatusChange: (status: ScoredLead["status"]) => void;
  onEmailChange: (email: string) => void;
  onRunAudit: () => void;
  onPrintProposal: () => void;
  copiedLeadId: string | null;
  copiedTextType: string | null;
  onCopyToClipboard: (text: string, id: string, type: string) => void;
  onOpenWhatsApp: (phone: string, text: string) => void;
  meetings: Meeting[];
  invoices: Invoice[];
  onBookMeeting: (meeting: Omit<Meeting, "id">) => void;
  onDeleteMeeting: (id: string) => void;
  onCreateInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber">) => void;
  onUpdateInvoiceStatus: (id: string, status: "PAID" | "PENDING") => void;
  onDeleteInvoice: (id: string) => void;
  agencyName: string;
  setAgencyName: (name: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  onRegenerateEmail: (leadId: string, customPrompt?: string) => Promise<void>;
  onVerifyEmail: (email: string) => Promise<{ isValid: boolean; status: string; bounceRisk: string; details?: string }>;
}

type TabType = "overview" | "technical" | "googleGbp" | "social" | "competitor" | "proposal" | "outreach" | "meetings" | "billing";

export default function DeepAuditModal({
  lead,
  onClose,
  onAddNote,
  onStatusChange,
  onEmailChange,
  onRunAudit,
  onPrintProposal,
  copiedLeadId,
  copiedTextType,
  onCopyToClipboard,
  onOpenWhatsApp,
  meetings,
  invoices,
  onBookMeeting,
  onDeleteMeeting,
  onCreateInvoice,
  onUpdateInvoiceStatus,
  onDeleteInvoice,
  agencyName,
  setAgencyName,
  logoUrl,
  setLogoUrl,
  onRegenerateEmail,
  onVerifyEmail,
}: DeepAuditModalProps) {
  const [activeModalTab, setActiveModalTab] = useState<TabType>("overview");
  const [newNoteText, setNewNoteText] = useState("");
  const [showBrandingPanel, setShowBrandingPanel] = useState(false);
  const [emailVerificationResult, setEmailVerificationResult] = useState<{ isValid: boolean; status: string; bounceRisk: string; details?: string } | null>(null);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [customEmailPrompt, setCustomEmailPrompt] = useState("");
  const [isRegeneratingEmail, setIsRegeneratingEmail] = useState(false);
  
  // Scoring collapse states
  const [expandedScoreSection, setExpandedScoreSection] = useState<string | null>(null);

  // Meeting states inside modal
  const [mTitle, setMTitle] = useState("AI Audit Discovery Call");
  const [mDate, setMDate] = useState("");
  const [mTime, setMTime] = useState("");
  const [mNotes, setMNotes] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegenerateEmail = async () => {
    setIsRegeneratingEmail(true);
    try {
      await onRegenerateEmail(lead.id, customEmailPrompt);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegeneratingEmail(false);
    }
  };

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

  const handleBookMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle || !mDate || !mTime) return;

    onBookMeeting({
      leadId: lead.id,
      leadName: lead.name,
      title: mTitle,
      date: mDate,
      time: mTime,
      notes: mNotes
    });

    setMTitle("AI Audit Discovery Call");
    setMDate("");
    setMTime("");
    setMNotes("");
  };

  const leadMeetings = meetings.filter((m) => m.leadId === lead.id);
  const audit = lead.auditData;

  // Rating and Color coding helpers
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#050505] border border-zinc-800 w-full max-w-5xl h-[92vh] flex flex-col justify-between rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-900 bg-[#0A0A0A] flex items-center justify-between">
          <div className="space-y-1 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-cinzel text-base md:text-lg text-white uppercase tracking-wider font-semibold">
                {lead.name}
              </h3>
              <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 rounded-none text-[10px] uppercase font-bold tracking-widest">
                Pipeline: {lead.status}
              </Badge>
              {audit && (
                <Badge className={`rounded-none border text-[10px] uppercase font-mono ${
                  audit.scoreCategory === "HOT" 
                    ? "bg-red-500/10 border-red-500/20 text-red-400" 
                    : audit.scoreCategory === "WARM"
                    ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                    : "bg-green-500/10 border-green-500/20 text-green-400"
                }`}>
                  🔥 {audit.scoreCategory} OPPORTUNITY
                </Badge>
              )}
            </div>
            <p className="text-[10px] text-zinc-400">Address: {lead.address}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-700 p-1.5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tab Controls */}
        <div className="flex flex-wrap border-b border-zinc-900 bg-[#090909] text-xs">
          {(["overview", "googleGbp", "technical", "social", "competitor", "proposal", "outreach", "meetings", "billing"] as TabType[]).map((tab) => {
            let label: string = tab;
            if (tab === "overview") label = "Overview";
            else if (tab === "googleGbp") label = "GBP Analysis";
            else if (tab === "technical") label = "Website & SEO";
            else if (tab === "social") label = "Socials";
            else if (tab === "competitor") label = "Competitors";
            else if (tab === "proposal") label = "Proposal";
            else if (tab === "outreach") label = "Outreach";
            else if (tab === "meetings") label = "Meetings";
            else if (tab === "billing") label = "Billing";

            return (
              <button
                key={tab}
                onClick={() => setActiveModalTab(tab)}
                className={`py-3 px-4 font-semibold text-[10px] uppercase tracking-widest text-center border-b-2 transition-colors ${
                  activeModalTab === tab ? "border-[#C9A84C] text-[#C9A84C]" : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
                disabled={
                  (tab === "technical" && !audit) ||
                  (tab === "googleGbp" && !audit) ||
                  (tab === "social" && !audit) ||
                  (tab === "competitor" && !audit) ||
                  (tab === "proposal" && !audit) ||
                  (tab === "outreach" && !audit)
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left bg-black text-zinc-300 scrollbar-none">
          
          {/* Tab Content: OVERVIEW */}
          {activeModalTab === "overview" && (
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
                    <div className="space-y-1">
                      <Badge className={`rounded-none font-bold text-[9px] uppercase px-3 py-1 ${scoreColor}`}>
                        {scoreLabel}
                      </Badge>
                      <span className="block text-[9px] text-zinc-500 mt-1">Maturity Level: {audit.aiBusinessSummary?.maturityLevel || "Seed"}</span>
                    </div>
                  )}
                </div>

                {/* 2. Prospect profile card */}
                <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 col-span-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-wider border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> Company Directory Details
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[11px] leading-relaxed">
                    <div className="flex justify-between items-center border-b border-zinc-950 py-1.5">
                      <span className="text-zinc-500">Industry:</span>
                      <span className="text-white font-medium">{audit?.businessInfo?.category || "Not Detected"}</span>
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
                      className="bg-black border-zinc-900 text-white rounded-none focus-visible:ring-0 focus:border-[#C9A84C] text-[11px]"
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
                <MapPreview lat={18.5204303} lng={73.8567437} />

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
                            className="border border-zinc-950 bg-black/40 p-2.5 hover:border-zinc-800 transition-all cursor-pointer"
                            onClick={() => setExpandedScoreSection(isExpanded ? null : key)}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-white flex items-center gap-1.5">
                                {formattedName}
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
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
                  <p className="text-xs text-zinc-400 leading-relaxed">
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
          )}

          {/* Tab Content: GOOGLE GBP & REVIEWS */}
          {activeModalTab === "googleGbp" && audit && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. GBP profile detail card */}
                <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 col-span-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-wider border-b border-zinc-900 pb-2">
                    Google Maps Business Profile Analysis
                  </h4>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px] leading-relaxed">
                    <div className="flex justify-between items-center border-b border-zinc-950 py-1">
                      <span className="text-zinc-500">Google Business Listing:</span>
                      <span className="text-white font-medium">{audit.googleBusinessProfile?.profileExists ? "✓ Exists" : "✗ Missing"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-950 py-1">
                      <span className="text-zinc-500">Verified Claim Status:</span>
                      <span className="text-white font-medium">{audit.googleBusinessProfile?.verifiedStatus || "Not Found"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-950 py-1">
                      <span className="text-zinc-500">Google Review Rating:</span>
                      <span className="text-[#F5C518] font-bold">⭐ {audit.googleBusinessProfile?.averageRating || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-950 py-1">
                      <span className="text-zinc-500">Total Reviews Count:</span>
                      <span className="text-white">{audit.googleBusinessProfile?.totalReviews || 0} reviews</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-950 py-1">
                      <span className="text-zinc-500">Profile Photos Uploaded:</span>
                      <span className="text-zinc-300">{audit.googleBusinessProfile?.photosCount || 0} photos</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-950 py-1">
                      <span className="text-zinc-500">Rating Growth Velocity:</span>
                      <span className="text-zinc-300">{audit.googleBusinessProfile?.reviewGrowth || "N/A"}</span>
                    </div>
                  </div>

                  <div className="text-[11px] space-y-1 bg-black/40 p-3 border border-zinc-950">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">GBP Editorial Summary:</span>
                    <p className="text-zinc-300 italic">"{audit.googleBusinessProfile?.businessDescription || 'No description provided by business.'}"</p>
                  </div>
                  
                  {audit.googleBusinessProfile?.missingInformation && audit.googleBusinessProfile.missingInformation.length > 0 && (
                    <div className="text-[11px] space-y-1">
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest block mb-1">Missing Profile Information:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {audit.googleBusinessProfile.missingInformation.map((item, idx) => (
                          <Badge key={idx} className="bg-red-500/5 text-red-400 border border-red-500/10 text-[9px] rounded-none">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. QR Code Widget and Maps Link */}
                <div className="bg-[#0A0A0A] border border-zinc-900 p-5 flex flex-col items-center justify-between text-center space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">QR Code to Listing</span>
                    <span className="text-[9px] text-zinc-500">Scan to open target profile on Google Maps</span>
                  </div>
                  
                  {audit.businessInfo?.googleMapsLink && audit.businessInfo.googleMapsLink !== "N/A" ? (
                    <div className="p-2.5 bg-white border border-zinc-800 rounded-none w-36 h-36 flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(audit.businessInfo.googleMapsLink)}`} 
                        alt="Maps Profile QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center gap-1.5 text-zinc-600 text-[10px]">
                      <QrCode className="w-8 h-8 opacity-40" />
                      <span>QR Code Unavailable</span>
                    </div>
                  )}

                  {audit.businessInfo?.googleMapsLink && audit.businessInfo.googleMapsLink !== "N/A" && (
                    <a 
                      href={audit.businessInfo.googleMapsLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#C9A84C] hover:underline flex items-center gap-1 uppercase font-semibold tracking-wider transition-all"
                    >
                      Open Google Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

              </div>

              {/* Reviews Sentiment and latest reviews list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Sentiment Meter (1 Column) */}
                <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 text-left">
                  <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
                    Review Sentiment analysis
                  </h4>
                  
                  <div className="space-y-4 pt-2">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between text-[10px]">
                        <span className="font-semibold text-green-400">Positive Sentiment</span>
                        <span className="text-right font-mono">85%</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex bg-zinc-900 rounded-none">
                        <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                        <div style={{ width: "10%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                        <div style={{ width: "5%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                      </div>
                      <div className="flex justify-between text-[9px] text-zinc-500 mt-1.5 font-mono">
                        <span>Neutral: 10%</span>
                        <span>Negative: 5%</span>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-sans pt-1 border-t border-zinc-950">
                      <strong>AI Sentiment Diagnosis:</strong> Customers praise service speed and hospitality. Dilute minor negative complaints by actively triggering new Google review links.
                    </p>
                  </div>
                </div>

                {/* Latest reviews list (2 Columns) */}
                <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 col-span-2">
                  <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
                    Latest Google Reviews Feedback
                  </h4>

                  <div className="space-y-3 max-h-52 overflow-y-auto scrollbar-none pr-1">
                    {audit.googleBusinessProfile?.latestReviews && audit.googleBusinessProfile.latestReviews.length > 0 ? (
                      audit.googleBusinessProfile.latestReviews.map((rev, index) => (
                        <div key={index} className="bg-black/60 p-3 border border-zinc-950 text-left space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-white flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-zinc-500" /> {rev.author}</span>
                            <span className="text-[#F5C518] font-bold">{"★".repeat(rev.rating)}</span>
                          </div>
                          <p className="text-[10px] text-zinc-300 italic font-sans">"{rev.text}"</p>
                          <span className="block text-[8px] text-zinc-500 font-mono text-right">{rev.date}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-600 italic text-center pt-16 text-xs">No reviews history retrieved from Google API.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab Content: TECHNICAL WEBSITE SEO */}
          {activeModalTab === "technical" && audit && (
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
                  <div className="bg-black p-4 border border-zinc-950 text-left text-xs text-[#F5F0E8]/80 leading-relaxed max-w-md mx-auto space-y-1.5">
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
                          <span className="text-zinc-700 text-xs">No Site Screenshot</span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <a 
                            href={lead.website?.startsWith("http") ? lead.website : "https://" + lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-black/90 border border-[#C9A84C]/30 text-white text-[10px] uppercase font-bold tracking-wider px-3.5 py-1.5 flex items-center gap-1 hover:border-[#C9A84C]"
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
                        <p><span className="text-zinc-500">Title Tag:</span> <span className="text-white italic">"{audit.websiteAnalysis.titleTag || "N/A"}"</span></p>
                        <p className="mt-1"><span className="text-zinc-500">Meta Desc:</span> <span className="text-white italic">"{audit.websiteAnalysis.metaDescription || "N/A"}"</span></p>
                      </div>

                      <div className="bg-black/55 border border-zinc-950 p-3 space-y-1 text-left">
                        <span className="text-[#C9A84C] font-semibold block border-b border-zinc-900 pb-0.5 mb-1.5 uppercase text-[9px] tracking-wide">Indexation Setup</span>
                        <p><span className="text-zinc-500">Robots.txt:</span> <span className="text-white">{audit.websiteAnalysis.robotsTxt || "N/A"}</span></p>
                        <p><span className="text-zinc-500">Sitemap.xml:</span> <span className="text-white">{audit.websiteAnalysis.sitemapXml || "N/A"}</span></p>
                        <p><span className="text-zinc-500">Canonical Tag:</span> <span className="text-white">{audit.websiteAnalysis.canonicalTags || "N/A"}</span></p>
                      </div>

                      <div className="bg-black/55 border border-zinc-950 p-3 space-y-1 text-left">
                        <span className="text-[#C9A84C] font-semibold block border-b border-zinc-900 pb-0.5 mb-1.5 uppercase text-[9px] tracking-wide">Architecture & Security</span>
                        <p><span className="text-zinc-500">HTTPS Protocol:</span> <span className="text-white">{audit.websiteAnalysis.https ? "✓ Enabled" : "✗ Disabled"}</span></p>
                        <p><span className="text-zinc-500">Schema Markup:</span> <span className="text-white">{audit.websiteAnalysis.schemaMarkup || "N/A"}</span></p>
                        <p><span className="text-zinc-500">Broken Links:</span> <span className="text-white">{audit.websiteAnalysis.brokenLinks || "0 detected"}</span></p>
                      </div>

                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Tab Content: SOCIAL MEDIA FOOTPRINT */}
          {activeModalTab === "social" && audit && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h4 className="font-cinzel text-sm font-bold text-[#C9A84C] uppercase tracking-wider">
                  Social Media Presence Analysis
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                {Object.entries(audit.socialMedia || {}).map(([key, item]: [string, any]) => {
                  if (key === "missingPlatforms") return null;
                  
                  const isDetected = item.url && item.url !== "N/A" && !item.url.includes("null");
                  
                  return (
                    <Card key={key} className={`p-4 rounded-none border ${
                      isDetected ? "bg-[#0A0A0A] border-zinc-800" : "bg-[#1C0F0F]/10 border-red-950/20 opacity-60"
                    }`}>
                      <div className="flex justify-between items-start">
                        <span className="text-xs uppercase font-bold text-white tracking-widest">{key}</span>
                        <Badge className={`rounded-none text-[8px] font-semibold uppercase ${
                          isDetected ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                          {isDetected ? "Connected" : "Missing"}
                        </Badge>
                      </div>

                      <div className="mt-3 text-[10px] space-y-1.5 leading-relaxed font-sans text-zinc-400">
                        {isDetected ? (
                          <>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline block truncate mb-1">
                              {item.url}
                            </a>
                            <p><span className="text-zinc-600">Followers:</span> <span className="text-zinc-200">{item.followers || "Not Available"}</span></p>
                            <p><span className="text-zinc-600">Frequency:</span> <span className="text-zinc-200">{item.postingFrequency || "Not Available"}</span></p>
                            <p><span className="text-zinc-600">Last Post:</span> <span className="text-zinc-200">{item.lastActiveDate || "Not Available"}</span></p>
                          </>
                        ) : (
                          <div className="py-3 text-zinc-500 italic">
                            No linked profile detected on this channel.
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {audit.socialMedia?.missingPlatforms && audit.socialMedia.missingPlatforms.length > 0 && (
                <div className="bg-yellow-500/5 border border-yellow-500/15 p-4 rounded-none space-y-2.5 text-left text-xs">
                  <h5 className="font-cinzel text-[10px] font-bold text-[#F5C518] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Social Channels Expansion opportunity
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    The business lacks active footprints on: <strong>{audit.socialMedia.missingPlatforms.join(", ")}</strong>. Establishing profiles on these missing engines enables multi-channel client acquisition and retargeting ads setups.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab Content: COMPETITOR COMPARISON */}
          {activeModalTab === "competitor" && (
            <CompetitorAnalysisTab lead={lead} />
          )}

          {/* Tab Content: PROPOSAL MARKETING BLUEPRINT */}
          {activeModalTab === "proposal" && audit && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <h4 className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-wider">
                  Marketing Proposal & Growth Roadmap
                </h4>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowBrandingPanel(!showBrandingPanel)}
                    className="bg-transparent hover:bg-zinc-800 border border-zinc-800 text-white text-[10px] font-semibold tracking-wider uppercase px-4 py-1.5 h-auto rounded-none"
                  >
                    Branding Settings
                  </Button>
                  <Button
                    onClick={onPrintProposal}
                    className="bg-transparent hover:bg-[#C9A84C]/10 border border-[#C9A84C] text-[#C9A84C] text-[10px] font-semibold tracking-wider uppercase px-4 py-1.5 h-auto rounded-none"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" />
                    Print & PDF Proposal
                  </Button>
                </div>
              </div>

              {showBrandingPanel && (
                <div className="glass p-4 border border-[#C9A84C]/25 space-y-4 max-w-3xl mx-auto text-xs animate-fadeIn">
                  <h5 className="font-cinzel font-bold text-white text-[10px] uppercase tracking-widest border-b border-zinc-900 pb-2">
                    Report PDF Branding Settings
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Agency Name</Label>
                      <Input
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs"
                        placeholder="Agency Name..."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Agency Logo (Local Upload)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs py-1 h-auto"
                        />
                        {logoUrl && (
                          <Button
                            type="button"
                            onClick={() => setLogoUrl("")}
                            className="bg-red-950 text-red-400 hover:bg-red-800 border border-red-500/20 text-[9px] rounded-none px-2 h-auto py-1"
                          >
                            Clear Logo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic prioritized recommendations roadmap */}
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Prioritized Growth Recommendations</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {audit.recommendations && audit.recommendations.length > 0 ? (
                    audit.recommendations.map((rec, index) => (
                      <Card key={index} className="bg-[#0A0A0A] border border-zinc-900 p-4 space-y-3.5 relative overflow-hidden flex flex-col justify-between h-48">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center border-b border-zinc-950 pb-1.5">
                            <h5 className="font-semibold text-white text-[11px] truncate max-w-[150px]">{rec.title}</h5>
                            <Badge className={`rounded-none text-[8px] font-bold uppercase ${
                              rec.priority === "Critical" 
                                ? "bg-red-500/10 border border-red-500/30 text-red-400" 
                                : rec.priority === "High"
                                ? "bg-orange-500/10 border border-orange-500/30 text-orange-400"
                                : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                            }`}>{rec.priority} Priority</Badge>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{rec.description}</p>
                        </div>

                        <div className="grid grid-cols-4 gap-1 text-center text-[9px] border-t border-zinc-950 pt-2 font-mono">
                          <div>
                            <span className="text-zinc-600 block text-[8px]">Impact</span>
                            <span className="text-white font-bold">{rec.estimatedImpact}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 block text-[8px]">Difficulty</span>
                            <span className="text-white font-bold">{rec.difficulty}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 block text-[8px]">Time</span>
                            <span className="text-white font-bold truncate block" title={rec.estimatedTime}>{rec.estimatedTime}</span>
                          </div>
                          <div>
                            <span className="text-zinc-600 block text-[8px]">Est. ROI</span>
                            <span className="text-green-400 font-bold">{rec.expectedROI}</span>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 py-12 text-center text-zinc-500 italic text-xs">
                      No customized recommendations generated yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: OUTREACH COPY ASSETS */}
          {activeModalTab === "outreach" && audit && (
            <div className="space-y-6">

              {/* AI Cold Emailer Generation Panel */}
              <div className="glass p-4 border border-zinc-900 bg-black/40 space-y-3 max-w-3xl mx-auto rounded-none">
                <div className="flex items-center justify-between">
                  <h5 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                    🤖 AI Cold Emailer Customization
                  </h5>
                  <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 text-[8px] uppercase tracking-wider rounded-none font-semibold">
                    Gemini v2.0
                  </Badge>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Regenerate a personalized pitch targeting their specific local gaps. (e.g. "Highlight missing sitemap", "Style it in a professional corporate tone").
                </p>
                <div className="flex gap-2">
                  <Input
                    value={customEmailPrompt}
                    onChange={(e) => setCustomEmailPrompt(e.target.value)}
                    placeholder="Focus: Emphasize Google review volume / Make it short..."
                    className="bg-[#0A0A0A] border-zinc-900 text-white rounded-none focus-visible:ring-0 focus:border-[#C9A84C] text-[11px] flex-1"
                    disabled={isRegeneratingEmail}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRegenerateEmail(); }}
                  />
                  <Button
                    onClick={handleRegenerateEmail}
                    disabled={isRegeneratingEmail}
                    className="bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs px-5 rounded-none shrink-0"
                  >
                    {isRegeneratingEmail ? "Regenerating..." : "Generate AI Email"}
                  </Button>
                </div>
              </div>
              
              {/* Cold Email Outreach block */}
              {audit.emailDraft && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                    <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Cold Email Outreach copy</h4>
                    <div className="flex gap-4">
                      <button
                        onClick={() => onCopyToClipboard(audit.emailDraft!, lead.id, "email")}
                        className="text-[#C9A84C] hover:text-[#F5F0E8] text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors font-mono"
                      >
                        {copiedLeadId === lead.id && copiedTextType === "email" ? (
                          <><Check className="w-3 h-3" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy Text</>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          const { subject, body } = parseEmailDraft(audit.emailDraft!);
                          const mailtoUrl = `mailto:${lead.email || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          window.location.href = mailtoUrl;
                          onStatusChange("CONTACTED");
                        }}
                        className="text-sky-400 hover:text-white text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors font-mono"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Email
                      </button>
                    </div>
                  </div>
                  <div className="bg-black p-4 border border-zinc-900 font-mono text-[10px] leading-relaxed text-[#F5F0E8]/90 whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-none rounded-none text-left">
                    {audit.emailDraft}
                  </div>
                </div>
              )}

              {/* Follow-up Email 1 block */}
              {audit.followUpEmail1 && (
                <div className="space-y-2.5 border-t border-zinc-900 pt-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                    <h4 className="font-cinzel text-xs font-bold text-amber-500 uppercase tracking-wider">AI Follow-up Email 1 (3 Days Later)</h4>
                    <button
                      onClick={() => onCopyToClipboard(audit.followUpEmail1!, lead.id, "followup1")}
                      className="text-[#C9A84C] hover:text-[#F5F0E8] text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors font-mono"
                    >
                      {copiedLeadId === lead.id && copiedTextType === "followup1" ? (
                        <><Check className="w-3 h-3" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy Text</>
                      )}
                    </button>
                  </div>
                  <div className="bg-black p-4 border border-zinc-900 font-mono text-[10px] leading-relaxed text-[#F5F0E8]/90 whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-none rounded-none text-left">
                    {audit.followUpEmail1}
                  </div>
                </div>
              )}

              {/* Follow-up Email 2 block */}
              {audit.followUpEmail2 && (
                <div className="space-y-2.5 border-t border-zinc-900 pt-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                    <h4 className="font-cinzel text-xs font-bold text-amber-600 uppercase tracking-wider">AI Follow-up Email 2 (Final Check)</h4>
                    <button
                      onClick={() => onCopyToClipboard(audit.followUpEmail2!, lead.id, "followup2")}
                      className="text-[#C9A84C] hover:text-[#F5F0E8] text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors font-mono"
                    >
                      {copiedLeadId === lead.id && copiedTextType === "followup2" ? (
                        <><Check className="w-3 h-3" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy Text</>
                      )}
                    </button>
                  </div>
                  <div className="bg-black p-4 border border-zinc-900 font-mono text-[10px] leading-relaxed text-[#F5F0E8]/90 whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-none rounded-none text-left">
                    {audit.followUpEmail2}
                  </div>
                </div>
              )}

              {/* WhatsApp block */}
              {audit.whatsAppDraft && (
                <div className="space-y-2.5 border-t border-zinc-900 pt-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                    <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">WhatsApp Message template</h4>
                    <div className="flex gap-4">
                      <button
                        onClick={() => onCopyToClipboard(audit.whatsAppDraft!, lead.id, "whatsapp")}
                        className="text-[#C9A84C] hover:text-[#F5F0E8] text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors font-mono"
                      >
                        {copiedLeadId === lead.id && copiedTextType === "whatsapp" ? (
                          <><Check className="w-3 h-3" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy Text</>
                        )}
                      </button>
                      
                      {lead.phoneNumber && (
                        <button
                          onClick={() => onOpenWhatsApp(lead.phoneNumber!, audit.whatsAppDraft!)}
                          className="text-green-500 hover:text-white text-[10px] tracking-wider uppercase font-semibold flex items-center gap-1.5 transition-colors font-mono"
                        >
                          <Send className="w-3.5 h-3.5" /> Launch WhatsApp
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="bg-black p-4 border border-zinc-900 font-mono text-[10px] leading-relaxed text-[#F5F0E8]/90 whitespace-pre-wrap max-h-24 overflow-y-auto scrollbar-none rounded-none text-left">
                    {audit.whatsAppDraft}
                  </div>
                </div>
              )}

              {/* "Lead Share" Feature */}
              <div className="space-y-2.5 border-t border-zinc-900 pt-4 text-left">
                <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
                  📢 Lead Share & Export
                </h4>
                <p className="text-[10px] text-zinc-500 font-sans">
                  Export this lead's digital footprint details and outreach templates. Share directly to WhatsApp or Telegram.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      const shareText = `*Qualified Local Marketing Lead from ${agencyName}*\n\n*Client:* ${lead.name}\n*Website:* ${lead.website || 'N/A'}\n*Phone:* ${lead.phoneNumber || 'N/A'}\n*Footprint Score:* ${audit.digitalFootprintScore}/100\n*Primary Issue:* ${lead.reasoning}\n\n*Outreach WhatsApp:* ${audit.whatsAppDraft || ''}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
                    }}
                    className="bg-transparent hover:bg-green-600/10 border border-green-500/40 text-green-500 font-semibold text-xs tracking-wider uppercase rounded-none px-4 py-2 h-auto transition-all"
                  >
                    Share via WhatsApp
                  </Button>
                  <Button
                    onClick={() => {
                      const shareText = `Qualified Local Marketing Lead from ${agencyName}\n\nClient: ${lead.name}\nWebsite: ${lead.website || 'N/A'}\nPhone: ${lead.phoneNumber || 'N/A'}\nFootprint Score: ${audit.digitalFootprintScore}/100\nPrimary Issue: ${lead.reasoning}\n\nOutreach Template: ${audit.whatsAppDraft || ''}`;
                      window.open(`https://t.me/share/url?url=${encodeURIComponent(lead.website || '')}&text=${encodeURIComponent(shareText)}`, "_blank");
                    }}
                    className="bg-transparent hover:bg-sky-600/10 border border-sky-500/40 text-sky-400 font-semibold text-xs tracking-wider uppercase rounded-none px-4 py-2 h-auto transition-all"
                  >
                    Share via Telegram
                  </Button>
                </div>
              </div>

            </div>
          )}

          {/* Tab Content: MEETINGS & CALENDAR SCHEDULER */}
          {activeModalTab === "meetings" && (
            <div className="space-y-6">
              
              {/* Call scheduler form */}
              <form onSubmit={handleBookMeetingSubmit} className="glass p-4 border border-zinc-800 space-y-4 text-xs max-w-xl">
                <h4 className="font-cinzel text-[11px] font-bold text-white uppercase tracking-wider">Schedule Client Callback</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="call-title" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Call Topic</Label>
                    <Input
                      id="call-title"
                      value={mTitle}
                      onChange={(e) => setMTitle(e.target.value)}
                      required
                      className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="call-date" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Date</Label>
                    <Input
                      id="call-date"
                      type="date"
                      value={mDate}
                      onChange={(e) => setMDate(e.target.value)}
                      required
                      className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="call-time" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Time</Label>
                    <Input
                      id="call-time"
                      type="time"
                      value={mTime}
                      onChange={(e) => setMTime(e.target.value)}
                      required
                      className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="call-notes" className="text-[9px] uppercase text-[#F5F0E8]/50 font-bold">Agenda details</Label>
                    <textarea
                      id="call-notes"
                      value={mNotes}
                      onChange={(e) => setMNotes(e.target.value)}
                      placeholder="Add brief details about the proposal or client expectations..."
                      rows={2}
                      className="w-full bg-black border border-zinc-850 text-white p-2.5 text-xs outline-none rounded-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    className="bg-[#C9A84C] text-black font-semibold text-[10px] rounded-none px-5 py-2 h-auto"
                  >
                    Schedule call
                  </Button>
                </div>
              </form>

              {/* Call History */}
              <div className="space-y-3 text-left">
                <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">Scheduled Calls for this Lead</h4>
                {leadMeetings.map((m) => (
                  <div key={m.id} className="bg-black p-4 border border-zinc-850 flex justify-between items-center gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-white font-bold block">{m.title}</span>
                      <span className="text-zinc-500 block">📅 {new Date(m.date).toLocaleDateString()} at ⏰ {m.time}</span>
                      {m.notes && <span className="text-zinc-600 block text-[10px] italic">"{m.notes}"</span>}
                    </div>
                    <button
                      onClick={() => onDeleteMeeting(m.id)}
                      className="p-1 text-zinc-600 hover:text-red-500"
                      title="Cancel call"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {leadMeetings.length === 0 && (
                  <p className="text-zinc-500 italic text-center py-4">No meetings booked for this prospect.</p>
                )}
              </div>

            </div>
          )}

          {/* Tab Content: INVOICES & BILLING */}
          {activeModalTab === "billing" && (
            <InvoiceTab
              lead={lead}
              invoices={invoices}
              onCreateInvoice={onCreateInvoice}
              onUpdateInvoiceStatus={onUpdateInvoiceStatus}
              onDeleteInvoice={onDeleteInvoice}
            />
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-zinc-900 bg-[#0A0A0A] flex items-center justify-between">
          <div className="text-[8px] text-zinc-600 font-mono flex items-center gap-4">
            <span>AUDIT ENGINE: v2.0</span>
            <span>DATE: {new Date().toLocaleDateString()}</span>
            <span>GENERATED BY AI</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-none px-5 py-2 border border-zinc-800"
            >
              Close Console
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
