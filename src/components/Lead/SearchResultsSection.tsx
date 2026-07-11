import React from "react";
import { ScoredLead } from "./types";
import { Star, MapPin, Globe, Loader2, Sparkles, FileText, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchResultsSectionProps {
  searchResults: ScoredLead[];
  executeLeadAudit: (leadId: string, isFinderLead?: boolean) => void;
  setSelectedLead: (lead: ScoredLead | null) => void;
  onPrintProposal: (lead: ScoredLead) => void;
  isBulkAuditing: boolean;
  bulkProgress: number;
  onBulkAudit: () => void;
  hasSearched?: boolean;
  isSearching?: boolean;
}

export default React.memo(function SearchResultsSection({
  searchResults,
  executeLeadAudit,
  setSelectedLead,
  onPrintProposal,
  isBulkAuditing,
  bulkProgress,
  onBulkAudit,
  hasSearched = false,
  isSearching = false,
}: SearchResultsSectionProps) {
  if (searchResults.length === 0) {
    if (hasSearched && !isSearching) {
      return (
        <div className="glass p-8 text-center border border-[#C9A84C]/15 animate-fadeIn">
          <p className="text-sm text-[#F5F0E8]/50 italic">
            No businesses found matching your criteria. Try adjusting your category or city name.
          </p>
        </div>
      );
    }
    return null;
  }

  const unauditedCount = searchResults.filter((l) => !l.auditData).length;

  return (
    <div className="space-y-6">
      
      {/* Header action panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A84C]/15 pb-3 text-left">
        <h3 className="font-cinzel text-lg text-white uppercase tracking-wider font-semibold">
          Prospect Search Results ({searchResults.length})
        </h3>

        <div className="flex items-center gap-4">
          {isBulkAuditing ? (
            <div className="flex items-center gap-3 bg-black border border-[#C9A84C]/20 px-4 py-2 text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C9A84C]" />
              <span className="font-mono text-[10px] text-zinc-400">Bulk Auditing: {bulkProgress}%</span>
              <div className="w-20 h-1.5 bg-zinc-900 overflow-hidden relative">
                <div className="h-full bg-[#C9A84C] transition-all duration-300" style={{ width: `${bulkProgress}%` }} />
              </div>
            </div>
          ) : (
            <Button
              onClick={onBulkAudit}
              disabled={unauditedCount === 0}
              className="bg-transparent hover:bg-[#C9A84C]/10 border border-[#C9A84C] text-[#C9A84C] text-[10px] font-bold uppercase tracking-wider px-4 py-2 h-auto rounded-none flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Bulk AI Audit ({unauditedCount} remaining)
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((lead) => {
          const isAudited = !!lead.auditData;
          const isAuditing = lead.auditProgress && lead.auditProgress !== "idle" && lead.auditProgress !== "completed" && lead.auditProgress !== "failed";
          
          return (
            <Card key={lead.id} className="bg-card text-card-foreground border border-border rounded-none flex flex-col justify-between hover:border-[#C9A84C] transition-all duration-300 min-w-0 w-full overflow-hidden">
              <CardHeader className="p-5 pb-3 border-b border-border text-left">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-1 min-w-0">
                    <CardTitle className="font-cinzel text-xs sm:text-sm md:text-base text-card-foreground tracking-wider uppercase truncate flex-1">
                      {lead.name}
                    </CardTitle>
                    {isAudited && (
                      <span className={`text-[10px] font-bold ${(lead.auditScore || 0) < 60 ? 'text-[#F5C518]' : 'text-green-500'} shrink-0`}>
                        {lead.auditScore}/100
                      </span>
                    )}
                  </div>
                  
                  {lead.rating && (
                    <div className="flex items-center gap-1 text-xs text-[#F5C518]">
                      <Star className="w-3.5 h-3.5 fill-[#F5C518]" />
                      <span>{lead.rating}</span>
                      <span className="text-muted-foreground/60">({lead.rating > 4.5 ? "Good" : "Needs Care"})</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4 text-xs text-muted-foreground text-left min-w-0">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-start gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="truncate">{lead.address}</span>
                  </div>
                  
                  {lead.website && (
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                      <span className="truncate">{lead.website}</span>
                    </div>
                  )}
                </div>

                {isAudited ? (
                  <div className="space-y-2 border-t border-border pt-3 min-w-0">
                    <p className="font-cormorant italic text-muted-foreground">
                      "{lead.auditData?.proposal?.summary}"
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-3 text-center border border-border text-muted-foreground italic">
                    Click Audit below to perform crawling, speed benchmarks & custom proposals.
                  </div>
                )}
              </CardContent>

              <div className="p-5 flex gap-2 border-t border-[#C9A84C]/10 pt-3">
                {isAudited ? (
                  <>
                    <Button
                      onClick={() => {
                        setSelectedLead(lead);
                      }}
                      className="flex-1 rounded-none bg-transparent hover:bg-[#C9A84C]/15 border border-[#C9A84C] text-[#C9A84C] text-[10px] tracking-wider uppercase py-4"
                    >
                      View Detailed Audit
                    </Button>
                    <Button
                      onClick={() => onPrintProposal(lead)}
                      className="rounded-none bg-[#C9A84C] text-black hover:bg-white text-[10px] px-3.5 py-4"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => executeLeadAudit(lead.id, true)}
                    disabled={isAuditing || isBulkAuditing}
                    className="w-full rounded-none bg-[#C9A84C] hover:bg-[#F5F0E8] text-black text-[10px] font-bold uppercase tracking-wider py-4 flex items-center justify-center gap-1.5"
                  >
                    {isAuditing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {lead.auditProgress}...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        One-Click AI Audit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
});
