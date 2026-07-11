import React from "react";
import { ScoredLead } from "../../types";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface SocialTabProps {
  lead: ScoredLead;
}

export default function SocialTab({ lead }: SocialTabProps) {
  const audit = lead.auditData;
  if (!audit) return null;

  return (
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
              isDetected ? "bg-[#0A0A0A] border-zinc-800" : "bg-[#1C0F0F]/10 border-red-955/20 opacity-60"
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
                    <p><span className="text-zinc-600 font-semibold">Followers:</span> <span className="text-zinc-200">{item.followers || "Not Available"}</span></p>
                    <p><span className="text-zinc-600 font-semibold">Frequency:</span> <span className="text-zinc-200">{item.postingFrequency || "Not Available"}</span></p>
                    <p><span className="text-zinc-600 font-semibold">Last Post:</span> <span className="text-zinc-200">{item.lastActiveDate || "Not Available"}</span></p>
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
  );
}
