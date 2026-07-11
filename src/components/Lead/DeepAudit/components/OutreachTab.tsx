import React, { useState } from "react";
import { ScoredLead } from "../../types";
import { Check, Copy, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { parseEmailDraft } from "../../utils";

interface OutreachTabProps {
  lead: ScoredLead;
  agencyName: string;
  copiedLeadId: string | null;
  copiedTextType: string | null;
  onCopyToClipboard: (text: string, id: string, type: string) => void;
  onOpenWhatsApp: (phone: string, text: string) => void;
  onRegenerateEmail: (leadId: string, customPrompt?: string) => Promise<void>;
  onStatusChange: (status: ScoredLead["status"]) => void;
}

export default function OutreachTab({
  lead,
  agencyName,
  copiedLeadId,
  copiedTextType,
  onCopyToClipboard,
  onOpenWhatsApp,
  onRegenerateEmail,
  onStatusChange,
}: OutreachTabProps) {
  const [customEmailPrompt, setCustomEmailPrompt] = useState("");
  const [isRegeneratingEmail, setIsRegeneratingEmail] = useState(false);

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

  const audit = lead.auditData;
  if (!audit) return null;

  return (
    <div className="space-y-6">

      {/* AI Cold Emailer Generation Panel */}
      <div className="glass p-4 border border-zinc-900 bg-black/40 space-y-3 max-w-3xl mx-auto rounded-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h5 className="font-cinzel text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5 text-left">
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
            className="bg-[#0A0A0A] border-zinc-900 text-white rounded-none focus-visible:ring-0 focus:border-[#C9A84C] text-[11px] flex-1 h-9"
            disabled={isRegeneratingEmail}
            onKeyDown={(e) => { if (e.key === 'Enter') handleRegenerateEmail(); }}
          />
          <Button
            onClick={handleRegenerateEmail}
            disabled={isRegeneratingEmail}
            className="bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs px-5 rounded-none shrink-0 h-9"
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
      <div className="space-y-2.5 border-t border-zinc-900 pt-4 text-left font-sans">
        <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
          📢 Lead Share & Export
        </h4>
        <p className="text-[10px] text-zinc-500">
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
  );
}
