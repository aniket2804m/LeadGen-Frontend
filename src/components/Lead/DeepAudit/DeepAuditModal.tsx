import React, { useState } from "react";
import { ScoredLead, Meeting, Invoice } from "../types";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import CompetitorAnalysisTab from "../CompetitorAnalysisTab";
import InvoiceTab from "../InvoiceTab";

// Split subcomponents
import OverviewTab from "./components/OverviewTab";
import GoogleGbpTab from "./components/GoogleGbpTab";
import TechnicalTab from "./components/TechnicalTab";
import SocialTab from "./components/SocialTab";
import ProposalTab from "./components/ProposalTab";
import OutreachTab from "./components/OutreachTab";
import MeetingsTab from "./components/MeetingsTab";
import AeoGeoTab from "./components/AeoGeoTab";

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

type TabType = "overview" | "aeoGeo" | "technical" | "googleGbp" | "social" | "competitor" | "proposal" | "outreach" | "meetings" | "billing";

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
  const audit = lead.auditData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white border border-zinc-800 w-full sm:max-w-5xl h-full sm:h-[92vh] flex flex-col justify-between rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-sans">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-zinc-900 bg-white flex items-center justify-between">
          <div className="space-y-1 text-left min-w-0 flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-cinzel text-sm sm:text-base md:text-lg text-white uppercase tracking-wider font-semibold truncate max-w-[200px] sm:max-w-sm">
                {lead.name}
              </h3>
              <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 rounded-none text-[8px] sm:text-[10px] uppercase font-bold tracking-widest">
                Pipeline: {lead.status}
              </Badge>
              {audit && (
                <Badge className={`rounded-none border text-[8px] sm:text-[10px] uppercase font-mono ${
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
            <p className="text-[9px] sm:text-[10px] text-zinc-400 truncate">Address: {lead.address}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-700 p-1.5 transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tab Controls (Mobile Scrollable) */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-zinc-900 bg-white text-xs scrollbar-none flex-nowrap shrink-0">
          {(["overview", "aeoGeo", "googleGbp", "technical", "social", "competitor", "proposal", "outreach", "meetings", "billing"] as TabType[]).map((tab) => {
            let label = tab as string;
            if (tab === "overview") label = "Overview";
            else if (tab === "aeoGeo") label = "AEO & GEO";
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
                className={`py-3 px-4 font-semibold text-[9px] sm:text-[10px] uppercase tracking-widest text-center border-b-2 transition-colors shrink-0 ${
                  activeModalTab === tab ? "border-[#C9A84C] text-[#C9A84C]" : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
                disabled={
                  (tab === "aeoGeo" && !audit) ||
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left bg-black text-zinc-300 scrollbar-none">
          
          {activeModalTab === "overview" && (
            <OverviewTab
              lead={lead}
              onStatusChange={onStatusChange}
              onEmailChange={onEmailChange}
              onVerifyEmail={onVerifyEmail}
              onAddNote={onAddNote}
              onRunAudit={onRunAudit}
            />
          )}

          {activeModalTab === "googleGbp" && (
            <GoogleGbpTab lead={lead} />
          )}

          {activeModalTab === "aeoGeo" && (
            <AeoGeoTab lead={lead} />
          )}

          {activeModalTab === "technical" && (
            <TechnicalTab lead={lead} />
          )}

          {activeModalTab === "social" && (
            <SocialTab lead={lead} />
          )}

          {activeModalTab === "competitor" && (
            <CompetitorAnalysisTab lead={lead} />
          )}

          {activeModalTab === "proposal" && (
            <ProposalTab
              lead={lead}
              onPrintProposal={onPrintProposal}
              agencyName={agencyName}
              setAgencyName={setAgencyName}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
            />
          )}

          {activeModalTab === "outreach" && (
            <OutreachTab
              lead={lead}
              agencyName={agencyName}
              copiedLeadId={copiedLeadId}
              copiedTextType={copiedTextType}
              onCopyToClipboard={onCopyToClipboard}
              onOpenWhatsApp={onOpenWhatsApp}
              onRegenerateEmail={onRegenerateEmail}
              onStatusChange={onStatusChange}
            />
          )}

          {activeModalTab === "meetings" && (
            <MeetingsTab
              lead={lead}
              meetings={meetings}
              onBookMeeting={onBookMeeting}
              onDeleteMeeting={onDeleteMeeting}
            />
          )}

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
        <div className="p-4 border-t border-zinc-900 bg-[#0A0A0A] flex items-center justify-between shrink-0">
          <div className="text-[8px] text-zinc-650 font-mono flex items-center gap-4">
            <span>AUDIT ENGINE: v2.0</span>
            <span className="hidden sm:inline">DATE: {new Date().toLocaleDateString()}</span>
            <span className="hidden sm:inline">GENERATED BY AI</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-none px-5 py-2 border border-zinc-800 h-9"
            >
              Close Console
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
