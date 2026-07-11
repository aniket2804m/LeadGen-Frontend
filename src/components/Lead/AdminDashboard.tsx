import React from "react";
import { ScoredLead, StatusLog } from "./types";
import { 
  Users, 
  Check, 
  Monitor, 
  Mail, 
  MessageSquareCode, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Activity,
  Play,
  Square
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  crmLeads: ScoredLead[];
  searchResultsCount: number;
  isAutoFinding: boolean;
  onToggleAutoFinding: () => void;
  onNavigateToFinder: () => void;
  logs?: StatusLog[];
}

export default React.memo(function AdminDashboard({
  crmLeads,
  searchResultsCount,
  isAutoFinding,
  onToggleAutoFinding,
  onNavigateToFinder,
  logs = [],
}: AdminDashboardProps) {
  
  // Calculate analytics metrics
  const totalLeads = crmLeads.length;
  const qualifiedCount = crmLeads.filter((l) => l.score === "HOT").length;
  const demoSitesCount = crmLeads.filter((l) => l.status === "CLOSED").length;
  const contactedCount = crmLeads.filter((l) => l.status === "CONTACTED" || l.status === "PROPOSAL_SENT").length;
  const repliedCount = crmLeads.filter((l) => l.status === "CLOSED").length;

  const todayDate = new Date();
  const todayDay = todayDate.getDate();
  const todayMonth = todayDate.toLocaleString('default', { month: 'short' });

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* 5-Column Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        
        {/* Card 1: Total Leads */}
        <Card className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Leads</span>
              <h3 className="text-3xl font-extrabold text-slate-800">{totalLeads}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Card 2: Qualified */}
        <Card className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Qualified</span>
              <h3 className="text-3xl font-extrabold text-slate-800">{qualifiedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500">
              <Check className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Card 3: Demo Sites */}
        <Card className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Demo Sites</span>
              <h3 className="text-3xl font-extrabold text-slate-800">{demoSitesCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
              <Monitor className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Card 4: Contacted */}
        <Card className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contacted</span>
              <h3 className="text-3xl font-extrabold text-slate-800">{contactedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
              <Mail className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Card 5: Replied */}
        <Card className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Replied</span>
              <h3 className="text-3xl font-extrabold text-slate-800">{repliedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <MessageSquareCode className="w-5 h-5" />
            </div>
          </div>
        </Card>

      </div>

      {/* Today Stat Widget Row */}
      <div className="w-full max-w-[240px]">
        <Card className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today</span>
              <h3 className="text-2xl font-bold text-slate-800">{todayDay} {todayMonth}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Bottom Section Grid: Activity vs Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Recent Activity Panel */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Recent Activity</h4>
          
          <Card className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm min-h-[300px] flex flex-col justify-between">
            <div className="space-y-4">
              {logs && logs.length > 0 ? (
                <div className="space-y-3">
                  {logs.slice(-6).reverse().map((log, index) => {
                    let colorClass = "text-slate-600 font-medium";
                    let badgeColor = "bg-slate-100 text-slate-600";
                    
                    if (log.type === "success") {
                      colorClass = "text-emerald-700 font-semibold";
                      badgeColor = "bg-emerald-50 text-emerald-700";
                    }
                    if (log.type === "warning") {
                      colorClass = "text-amber-700 font-semibold";
                      badgeColor = "bg-amber-50 text-amber-700";
                    }
                    if (log.type === "error") {
                      colorClass = "text-rose-600 font-bold";
                      badgeColor = "bg-rose-50 text-rose-700";
                    }
                    if (log.type === "action") {
                      colorClass = "text-indigo-700 font-semibold";
                      badgeColor = "bg-indigo-50 text-indigo-700";
                    }
                    
                    return (
                      <div key={index} className="flex items-start gap-3 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                        <span className="text-[10px] text-slate-400 font-mono select-none bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 shrink-0">
                          {log.timestamp}
                        </span>
                        <div className="flex-1 text-left">
                          <span className={colorClass}>{log.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-slate-400 italic">
                  No activity yet
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Database Sync Active</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span>Connected</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-1 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Quick Actions</h4>

          <Card className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-3.5">
            
            {/* Action 1: Find New Leads */}
            <button 
              onClick={onNavigateToFinder}
              className="w-full text-left p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all duration-200 group flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">Find New Leads</span>
                <span className="text-[10px] text-slate-400 block">Scrape by location</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
            </button>
            
            {/* Action 2: AI Score All */}
            <button 
              onClick={onToggleAutoFinding}
              className="w-full text-left p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all duration-200 group flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  AI Score All
                  <span className={`w-2 h-2 rounded-full ${isAutoFinding ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                </span>
                <span className="text-[10px] text-slate-400 block">{isAutoFinding ? "Scraper running loop..." : "Analyze & rank leads"}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
            </button>

            {/* Action 3: Build All Demos */}
            <button 
              onClick={() => alert("Website mockup generation triggered for all closed accounts!")}
              className="w-full text-left p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all duration-200 group flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">Build All Demos</span>
                <span className="text-[10px] text-slate-400 block">Generate websites</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
            </button>

            {/* Action 4: Launch Outreach */}
            <button 
              onClick={onNavigateToFinder} // Switches to finder/outreach options
              className="w-full text-left p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all duration-200 group flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">Launch Outreach</span>
                <span className="text-[10px] text-slate-400 block">Send email campaigns</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
            </button>

          </Card>
        </div>

      </div>
      
    </div>
  );
});
