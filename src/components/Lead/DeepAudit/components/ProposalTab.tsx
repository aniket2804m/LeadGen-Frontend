import React, { useState } from "react";
import { ScoredLead } from "../../types";
import { FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProposalTabProps {
  lead: ScoredLead;
  onPrintProposal: () => void;
  agencyName: string;
  setAgencyName: (name: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

export default function ProposalTab({
  lead,
  onPrintProposal,
  agencyName,
  setAgencyName,
  logoUrl,
  setLogoUrl,
}: ProposalTabProps) {
  const [showBrandingPanel, setShowBrandingPanel] = useState(false);

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

  const audit = lead.auditData;
  if (!audit) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-2">
        <h4 className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-wider text-left">
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
        <div className="glass p-4 border border-[#C9A84C]/25 space-y-4 max-w-3xl mx-auto text-xs animate-fadeIn bg-black/40">
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
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block font-sans">Prioritized Growth Recommendations</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.recommendations && audit.recommendations.length > 0 ? (
            audit.recommendations.map((rec, index) => (
              <Card key={index} className="bg-[#0A0A0A] border border-zinc-900 p-4 space-y-3.5 relative overflow-hidden flex flex-col justify-between h-48 rounded-none">
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
                    <span className="text-zinc-650 block text-[8px] font-bold">Impact</span>
                    <span className="text-white font-bold">{rec.estimatedImpact}</span>
                  </div>
                  <div>
                    <span className="text-zinc-650 block text-[8px] font-bold">Difficulty</span>
                    <span className="text-white font-bold">{rec.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-zinc-650 block text-[8px] font-bold">Time</span>
                    <span className="text-white font-bold truncate block" title={rec.estimatedTime}>{rec.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-zinc-650 block text-[8px] font-bold">Est. ROI</span>
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
  );
}
