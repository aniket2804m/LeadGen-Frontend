import { ScoredLead } from "./types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CRMCardProps {
  lead: ScoredLead;
  onInspect: () => void;
  onStatusChange: (status: ScoredLead["status"]) => void;
  onDelete: () => void;
}

export default function CRMCard({ lead, onInspect, onStatusChange, onDelete }: CRMCardProps) {
  const hasAudit = !!lead.auditData;
  const speedScore = lead.auditData?.pageSpeed?.performance;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", lead.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card 
      draggable
      onDragStart={handleDragStart}
      className="bg-[#0A0A0A] border border-zinc-800 rounded-none p-3.5 space-y-3 hover:border-[#C9A84C]/50 transition-colors flex flex-col justify-between cursor-grab active:cursor-grabbing"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-cinzel text-xs text-white bg-white uppercase tracking-wider font-semibold truncate flex-1 text-left">
            {lead.name}
          </h4>
          {hasAudit && (
            <span className={`text-[10px] font-bold ${(lead.auditScore || 0) < 60 ? 'text-[#F5C518]' : 'text-green-500'}`}>
              {lead.auditScore}/100
            </span>
          )}
        </div>

        {/* Contacts */}
        <div className="space-y-1 text-[10px] text-[#F5F0E8]/50 text-left">
          <p className="truncate">📍 {lead.address}</p>
          {lead.website && <p className="truncate">🌐 {lead.website}</p>}
          {lead.phoneNumber && <p>📞 {lead.phoneNumber}</p>}
        </div>

        {/* Metrics pill */}
        {hasAudit && lead.website && (
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 text-[8px] rounded-none py-0 px-1.5">
              Speed: {speedScore}%
            </Badge>
            <Badge className="bg-sky-500/10 text-sky-500 border border-sky-500/20 text-[8px] rounded-none py-0 px-1.5">
              SEO: {lead.auditData?.pageSpeed?.seo}%
            </Badge>
            {lead.auditScore !== undefined && (
              <Badge className={`text-[8px] rounded-none py-0 px-1.5 border ${
                lead.auditScore >= 75 
                  ? "bg-red-500/20 text-red-400 border-red-500/35" 
                  : lead.auditScore >= 50
                  ? "bg-orange-500/20 text-orange-400 border-orange-500/35"
                  : lead.auditScore >= 30
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/35"
                  : "bg-green-500/20 text-green-400 border-green-500/35"
              }`}>
                Fix: {lead.auditScore >= 75 ? "CRITICAL" : lead.auditScore >= 50 ? "HIGH" : lead.auditScore >= 30 ? "MEDIUM" : "LOW"}
              </Badge>
            )}
          </div>
        )}

        {/* 3-day inactivity alert */}
        {(() => {
          const daysDiff = lead.updatedAt ? Math.floor((Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
          if (lead.status === "PROPOSAL_SENT" && daysDiff >= 3) {
            return (
              <div className="p-1.5 bg-yellow-500/10 border border-yellow-500/30 text-[8px] font-semibold text-yellow-500 flex items-center gap-1 animate-pulse">
                <span>⚠️ OVERDUE: No response in {daysDiff} days. Follow up!</span>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Board card Actions */}
      <div className="flex items-center gap-1.5 border-t border-zinc-900 pt-2.5">
        <Button
          onClick={onInspect}
          className="flex-1 rounded-none bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black border border-[#C9A84C]/25 text-[9px] py-1 px-2 h-auto"
        >
          Inspect
        </Button>

        {/* Column updates drop */}
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(e.target.value as ScoredLead["status"])}
          className="bg-black border border-zinc-800 text-[#F5F0E8]/80 text-[9px] py-1 px-1 h-auto outline-none cursor-pointer rounded-none"
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Reached</option>
          <option value="PROPOSAL_SENT">Proposal</option>
          <option value="CLOSED">Closed</option>
        </select>

        <button
          onClick={onDelete}
          className="text-zinc-600 hover:text-red-500 p-1"
          title="Remove prospect"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}
