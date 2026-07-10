import React from "react";
import { ScoredLead } from "./types";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CRMCard from "./CRMCard";

interface CRMBoardProps {
  crmLeads: ScoredLead[];
  onInspectLead: (lead: ScoredLead) => void;
  updateCRMLeadStatus: (leadId: string, status: ScoredLead["status"]) => void;
  handleDeleteCRMLead: (leadId: string) => void;
  onExportCSV: () => void;
}

export default React.memo(function CRMBoard({
  crmLeads,
  onInspectLead,
  updateCRMLeadStatus,
  handleDeleteCRMLead,
  onExportCSV,
}: CRMBoardProps) {
  const [draggedOverStage, setDraggedOverStage] = React.useState<ScoredLead["status"] | null>(null);

  // CRM Board pipeline groups
  const newStageLeads = crmLeads.filter((l) => l.status === "NEW");
  const contactedStageLeads = crmLeads.filter((l) => l.status === "CONTACTED");
  const proposalStageLeads = crmLeads.filter((l) => l.status === "PROPOSAL_SENT");
  const closedStageLeads = crmLeads.filter((l) => l.status === "CLOSED");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ScoredLead["status"]) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) {
      updateCRMLeadStatus(leadId, targetStatus);
    }
    setDraggedOverStage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header stats & action */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A84C]/15 pb-4">
        <div className="text-left space-y-1">
          <h2 className="font-cinzel text-lg md:text-xl text-white uppercase tracking-wider font-semibold">
            CRM Pipeline Board
          </h2>
          <p className="text-xs text-[#F5F0E8]/50">
            Total Active Prospects: {crmLeads.length} | Drag and drop cards to change status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onExportCSV}
            disabled={crmLeads.length === 0}
            className="bg-transparent hover:bg-[#C9A84C]/10 border border-[#C9A84C]/35 text-[#C9A84C] font-semibold text-xs tracking-wider uppercase rounded-none px-4 py-2.5 h-auto transition-all"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export CRM CSV
          </Button>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left items-start">
        
        {/* Stage: NEW */}
        <div 
          onDragOver={handleDragOver}
          onDragEnter={() => setDraggedOverStage("NEW")}
          onDragLeave={() => setDraggedOverStage(null)}
          onDrop={(e) => handleDrop(e, "NEW")}
          className={`glass p-4 space-y-4 transition-all duration-200 border-2 ${
            draggedOverStage === "NEW" ? "border-dashed border-[#C9A84C] bg-[#C9A84C]/5" : "border-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-cinzel text-xs font-bold text-white tracking-widest uppercase">
              1. New Leads
            </h3>
            <Badge className="bg-zinc-800 text-zinc-400 rounded-none text-[10px]">{newStageLeads.length}</Badge>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {newStageLeads.map(lead => (
              <CRMCard 
                key={lead.id} 
                lead={lead} 
                onInspect={() => onInspectLead(lead)}
                onStatusChange={(status) => updateCRMLeadStatus(lead.id, status)}
                onDelete={() => handleDeleteCRMLead(lead.id)}
              />
            ))}
            {newStageLeads.length === 0 && <p className="text-[10px] text-[#F5F0E8]/20 italic text-center pt-8">No prospects.</p>}
          </div>
        </div>

        {/* Stage: CONTACTED */}
        <div 
          onDragOver={handleDragOver}
          onDragEnter={() => setDraggedOverStage("CONTACTED")}
          onDragLeave={() => setDraggedOverStage(null)}
          onDrop={(e) => handleDrop(e, "CONTACTED")}
          className={`glass p-4 space-y-4 transition-all duration-200 border-2 ${
            draggedOverStage === "CONTACTED" ? "border-dashed border-[#F5C518] bg-[#F5C518]/5" : "border-[#F5C518]/15"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#F5C518]/15 pb-2">
            <h3 className="font-cinzel text-xs font-bold text-[#F5C518] tracking-widest uppercase">
              2. Contacted
            </h3>
            <Badge className="bg-[#F5C518]/10 text-[#F5C518] rounded-none text-[10px]">{contactedStageLeads.length}</Badge>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {contactedStageLeads.map(lead => (
              <CRMCard 
                key={lead.id} 
                lead={lead} 
                onInspect={() => onInspectLead(lead)}
                onStatusChange={(status) => updateCRMLeadStatus(lead.id, status)}
                onDelete={() => handleDeleteCRMLead(lead.id)}
              />
            ))}
            {contactedStageLeads.length === 0 && <p className="text-[10px] text-[#F5F0E8]/20 italic text-center pt-8">No prospects.</p>}
          </div>
        </div>

        {/* Stage: PROPOSAL_SENT */}
        <div 
          onDragOver={handleDragOver}
          onDragEnter={() => setDraggedOverStage("PROPOSAL_SENT")}
          onDragLeave={() => setDraggedOverStage(null)}
          onDrop={(e) => handleDrop(e, "PROPOSAL_SENT")}
          className={`glass p-4 space-y-4 transition-all duration-200 border-2 ${
            draggedOverStage === "PROPOSAL_SENT" ? "border-dashed border-amber-500 bg-amber-500/5" : "border-amber-600/20"
          }`}
        >
          <div className="flex items-center justify-between border-b border-amber-600/20 pb-2">
            <h3 className="font-cinzel text-xs font-bold text-amber-500 tracking-widest uppercase">
              3. Proposal Sent
            </h3>
            <Badge className="bg-amber-500/10 text-amber-500 rounded-none text-[10px]">{proposalStageLeads.length}</Badge>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {proposalStageLeads.map(lead => (
              <CRMCard 
                key={lead.id} 
                lead={lead} 
                onInspect={() => onInspectLead(lead)}
                onStatusChange={(status) => updateCRMLeadStatus(lead.id, status)}
                onDelete={() => handleDeleteCRMLead(lead.id)}
              />
            ))}
            {proposalStageLeads.length === 0 && <p className="text-[10px] text-[#F5F0E8]/20 italic text-center pt-8">No prospects.</p>}
          </div>
        </div>

        {/* Stage: CLOSED */}
        <div 
          onDragOver={handleDragOver}
          onDragEnter={() => setDraggedOverStage("CLOSED")}
          onDragLeave={() => setDraggedOverStage(null)}
          onDrop={(e) => handleDrop(e, "CLOSED")}
          className={`glass p-4 space-y-4 transition-all duration-200 border-2 ${
            draggedOverStage === "CLOSED" ? "border-dashed border-green-500 bg-green-500/5" : "border-green-600/20"
          }`}
        >
          <div className="flex items-center justify-between border-b border-green-600/20 pb-2">
            <h3 className="font-cinzel text-xs font-bold text-green-500 tracking-widest uppercase">
              4. Closed Client
            </h3>
            <Badge className="bg-green-500/10 text-green-500 rounded-none text-[10px]">{closedStageLeads.length}</Badge>
          </div>
          <div className="space-y-3 min-h-[300px]">
            {closedStageLeads.map(lead => (
              <CRMCard 
                key={lead.id} 
                lead={lead} 
                onInspect={() => onInspectLead(lead)}
                onStatusChange={(status) => updateCRMLeadStatus(lead.id, status)}
                onDelete={() => handleDeleteCRMLead(lead.id)}
              />
            ))}
            {closedStageLeads.length === 0 && <p className="text-[10px] text-[#F5F0E8]/20 italic text-center pt-8">No closed deals.</p>}
          </div>
        </div>

      </div>
    </div>
  );
});
