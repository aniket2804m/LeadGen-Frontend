import React from "react";
import { ScoredLead } from "./types";
import { 
  Users, 
  Flame, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  ShieldAlert,
  Play,
  Square
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart, 
  Line,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminDashboardProps {
  crmLeads: ScoredLead[];
  searchResultsCount: number;
  isAutoFinding: boolean;
  onToggleAutoFinding: () => void;
  onNavigateToFinder: () => void;
}

export default React.memo(function AdminDashboard({
  crmLeads,
  searchResultsCount,
  isAutoFinding,
  onToggleAutoFinding,
  onNavigateToFinder,
}: AdminDashboardProps) {
  
  // Calculate analytics metrics
  const activePipelineCount = crmLeads.length;
  const hotLeadsCount = crmLeads.filter((l) => l.score === "HOT").length;
  
  // Projected Revenue calculation (parses proposal retainer price)
  const projectedRevenue = crmLeads.reduce((acc, lead) => {
    if (lead.status === "CLOSED" || lead.status === "PROPOSAL_SENT") {
      const priceStr = lead.auditData?.proposal?.pricing || "$1000";
      const matches = priceStr.match(/\d[\d,.]*/);
      if (matches) {
        const num = parseFloat(matches[0].replace(/,/g, ""));
        return acc + num;
      }
      return acc + 1000;
    }
    return acc;
  }, 0);

  // Conversion Funnel data
  const newCount = crmLeads.filter((l) => l.status === "NEW").length;
  const reachedCount = crmLeads.filter((l) => l.status === "CONTACTED").length;
  const proposalCount = crmLeads.filter((l) => l.status === "PROPOSAL_SENT").length;
  const closedCount = crmLeads.filter((l) => l.status === "CLOSED").length;

  const funnelData = [
    { name: "New Leads", count: newCount, fill: "#71717a" },
    { name: "Reached", count: reachedCount, fill: "#f5c518" },
    { name: "Proposals", count: proposalCount, fill: "#f97316" },
    { name: "Closed Deals", count: closedCount, fill: "#22c55e" }
  ];

  // PageSpeed speed distribution data
  const speedData = crmLeads
    .filter((l) => l.auditData && l.auditData.pageSpeed && l.website)
    .map((l, index) => ({
      index: index + 1,
      name: l.name.split(" ")[0],
      speed: l.auditData?.pageSpeed?.performance || 0,
      seo: l.auditData?.pageSpeed?.seo || 0
    }));

  // 6-Month Projected Revenue Growth and success rate trend
  const successRate = crmLeads.length > 0 ? Math.round((closedCount / crmLeads.length) * 100) : 0;
  const growthTrendData = [
    { month: "Jan", "Projected Revenue ($)": Math.round(projectedRevenue * 0.2), "Proposal Success (%)": Math.round(successRate * 0.4) },
    { month: "Feb", "Projected Revenue ($)": Math.round(projectedRevenue * 0.35), "Proposal Success (%)": Math.round(successRate * 0.55) },
    { month: "Mar", "Projected Revenue ($)": Math.round(projectedRevenue * 0.5), "Proposal Success (%)": Math.round(successRate * 0.7) },
    { month: "Apr", "Projected Revenue ($)": Math.round(projectedRevenue * 0.7), "Proposal Success (%)": Math.round(successRate * 0.8) },
    { month: "May", "Projected Revenue ($)": Math.round(projectedRevenue * 0.85), "Proposal Success (%)": Math.round(successRate * 0.9) },
    { month: "Jun", "Projected Revenue ($)": projectedRevenue, "Proposal Success (%)": successRate }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI: Active pipeline */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 rounded-none p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active CRM Leads</span>
            <Users className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-cinzel font-bold text-white">{activePipelineCount}</h3>
            <p className="text-[10px] text-zinc-600">Total accounts saved in CRM</p>
          </div>
        </Card>

        {/* KPI: Hot leads */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 rounded-none p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">HOT Opportunities</span>
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-cinzel font-bold text-white">{hotLeadsCount}</h3>
            <p className="text-[10px] text-zinc-600">High priority targets (Score &lt; 60)</p>
          </div>
        </Card>

        {/* KPI: Projected Revenue */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 rounded-none p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Projected Revenue</span>
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-cinzel font-bold text-white">
              ${projectedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
            </h3>
            <p className="text-[10px] text-zinc-600">Proposed contracts & closed client MRR</p>
          </div>
        </Card>

        {/* KPI: Conversion Rate */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 rounded-none p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Proposal Success</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-cinzel font-bold text-white">
              {crmLeads.length > 0 ? Math.round((closedCount / crmLeads.length) * 100) : 0}%
            </h3>
            <p className="text-[10px] text-zinc-600">Closed deals vs total pipeline volume</p>
          </div>
        </Card>

      </div>

      {/* Background Lead Finder Console Controls */}
      <Card className="bg-[#0F0F0F] border border-[#C9A84C]/15 rounded-none p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#C9A84C]" /> Automated Scanner Engine (Background Mode)
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When activated, the scraper runs background loops to find and auto-score local prospects, adding them directly to your CRM board.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`rounded-none px-3 py-1 text-[10px] font-bold ${isAutoFinding ? 'bg-green-500/10 text-green-500 border border-green-500/25' : 'bg-zinc-800 text-zinc-500'}`}>
              {isAutoFinding ? "Scanner Active" : "Scanner Inactive"}
            </Badge>
            <Button
              onClick={onToggleAutoFinding}
              className={`rounded-none font-semibold text-xs tracking-wider uppercase px-5 py-2.5 h-auto transition-all ${
                isAutoFinding 
                  ? "bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/20" 
                  : "bg-[#C9A84C] text-black hover:bg-white"
              }`}
            >
              {isAutoFinding ? (
                <><Square className="w-3 h-3 mr-1.5 fill-current" /> Deactivate</>
              ) : (
                <><Play className="w-3 h-3 mr-1.5 fill-current" /> Activate Scan</>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Analytics Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Real-time Growth Projection Chart */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 rounded-none p-5 space-y-4 col-span-1 lg:col-span-2">
          <CardHeader className="p-0 border-b border-zinc-900 pb-2 flex flex-row items-center justify-between">
            <CardTitle className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
              Projected Revenue & Proposal Success Growth Trend
            </CardTitle>
            <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/25 rounded-none text-[9px] uppercase tracking-wider font-semibold">
              Live Forecast
            </Badge>
          </CardHeader>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrendData} margin={{ top: 20, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1A1A1A" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#6b6375" fontSize={10} tickLine={false} />
                <YAxis yAxisId="left" stroke="#C9A84C" fontSize={10} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#38BDF8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#C9A84C", color: "#F5F0E8" }}
                  itemStyle={{ color: "#C9A84C" }}
                  labelStyle={{ color: "#FFF" }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }} />
                <Area yAxisId="left" type="monotone" dataKey="Projected Revenue ($)" stroke="#C9A84C" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="Proposal Success (%)" stroke="#38BDF8" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pipeline conversion stages chart */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 rounded-none p-5 space-y-4">
          <CardHeader className="p-0 border-b border-zinc-900 pb-2">
            <CardTitle className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
              Pipeline Funnel Distribution
            </CardTitle>
          </CardHeader>
          <div className="h-64 w-full">
            {crmLeads.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6b6375" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6b6375" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#C9A84C", color: "#F5F0E8" }}
                    itemStyle={{ color: "#C9A84C" }}
                    labelStyle={{ color: "#FFF" }}
                  />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500 italic">
                No pipeline data recorded. Scan and add prospects to initialize chart data.
              </div>
            )}
          </div>
        </Card>

        {/* Site performance stats chart */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 rounded-none p-5 space-y-4">
          <CardHeader className="p-0 border-b border-zinc-900 pb-2">
            <CardTitle className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
              Audited Clients Speed vs SEO
            </CardTitle>
          </CardHeader>
          <div className="h-64 w-full">
            {speedData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={speedData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="#1A1A1A" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#6b6375" fontSize={9} />
                  <YAxis stroke="#6b6375" fontSize={10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#C9A84C", color: "#F5F0E8" }}
                    itemStyle={{ color: "#C9A84C" }}
                    labelStyle={{ color: "#FFF" }}
                  />
                  <Line type="monotone" dataKey="speed" name="PageSpeed" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="seo" name="SEO" stroke="#38BDF8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500 italic">
                No technical speed records. Run One-Click AI Audits on active prospects.
              </div>
            )}
          </div>
        </Card>

      </div>
      
    </div>
  );
});

// Mock component helper for cell mappings inside charts
function Cell(props: any) {
  const { fill, x, y, width, height, radius } = props;
  return (
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={fill} 
      rx={radius?.[0] || 0} 
      ry={radius?.[1] || 0} 
    />
  );
}
