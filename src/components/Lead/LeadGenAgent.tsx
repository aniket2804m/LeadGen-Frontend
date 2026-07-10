import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Key, 
  LayoutDashboard, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  Monitor, 
  Mail, 
  Megaphone, 
  History, 
  Calendar, 
  UserCheck, 
  LogOut, 
  ChevronLeft, 
  Globe, 
  Plus, 
  Layers, 
  Compass, 
  Lock,
  Menu,
  Star,
  FileText,
  Settings
} from "lucide-react";
import API from "../../config/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useLeadGen } from "./useLeadGen";
import { printProposal, exportCrmToCSV, openWhatsAppOutreach } from "./utils";

import KeysPanel from "./KeysPanel";
import FinderForm from "./FinderForm";
import SearchResultsSection from "./SearchResultsSection";
import CRMBoard from "./CRMBoard";
import DeepAuditModal from "./DeepAuditModal";
import LogsMonitor from "./LogsMonitor";
import AdminDashboard from "./AdminDashboard";
import CalendarBooking from "./CalendarBooking";

export default function LeadGenAgent() {
  const {
    activeTab,
    setActiveTab,
    industry,
    setIndustry,
    location,
    setLocation,
    keywords,
    setKeywords,
    model,
    setModel,
    anthropicKeyInput,
    googleKeyInput,
    showKeysPanel,
    setShowKeysPanel,
    activeAnthropicKey,
    activeGoogleKey,
    isSandboxMode,
    setIsSandboxMode,
    searchResults,
    crmLeads,
    meetings,
    invoices,
    isSearching,
    hasSearched,
    logs,
    copiedLeadId,
    copiedTextType,
    selectedLead,
    setSelectedLead,
    isAutoFinding,
    isBulkAuditing,
    bulkProgress,
    executeBulkAudit,
    addLog,
    geminiKeyInput,
    handleAnthropicKeyChange,
    handleGoogleKeyChange,
    handleGeminiKeyChange,
    handlePlacesSearch,
    executeLeadAudit,
    handleAddNote,
    updateCRMLeadStatus,
    updateCRMLeadEmail,
    handleDeleteCRMLead,
    copyToClipboard,
    handleBookMeeting,
    handleDeleteMeeting,
    handleCreateInvoice,
    handleUpdateInvoiceStatus,
    handleDeleteInvoice,
    toggleAutoFinding,
    agencyName,
    setAgencyName,
    logoUrl,
    setLogoUrl,
    regenerateAIEmail,
    verifyLeadEmail,
  } = useLeadGen();

  // User accounts administration states
  interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    blocked: boolean;
    leadCount: number;
    createdAt: string;
  }

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [findLeadsDropdown, setFindLeadsDropdown] = useState(true);

  // Load current user details
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const profileName = currentUser?.name || "Aniket Tanaji Suryawanshi";
  const profileEmail = currentUser?.email || "suryawanshaniket7576@gmail.com";
  const profileInitials = profileName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (e: any) {
      console.error("Failed to load users directory:", e);
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);

  const handleToggleBlock = async (userId: string, isCurrentlyBlocked: boolean) => {
    setActionUserId(userId);
    try {
      await API.put(`/admin/users/${userId}/block`, { blocked: !isCurrentlyBlocked });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, blocked: !isCurrentlyBlocked } : u))
      );
      addLog(`✅ User account ${!isCurrentlyBlocked ? "blocked" : "unblocked"} successfully.`, "success");
    } catch (e) {
      addLog("❌ Failed to update user block state.", "error");
    } finally {
      setActionUserId(null);
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "dashboard": return "Dashboard";
      case "finder": return "Find Leads";
      case "crm": return "My Leads";
      case "demos": return "Demo Sites";
      case "outreach": return "Email Outreach";
      case "campaigns": return "Campaigns";
      case "activity": return "Activity";
      case "calendar": return "Calendar";
      case "users": return "User Accounts";
      case "scout": return "Scout AI";
      case "reports": return "Reports";
      case "settings": return "Settings";
      default: return tab;
    }
  };

  return (
    <div className="light-console min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col fixed top-0 bottom-0 left-0 transition-all duration-300 z-30 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        
        {/* Scrollable Container (Logo + Navigation Groups) */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
          
          {/* Logo Section */}
          <div className="h-20 flex items-center px-4 border-b border-slate-100 gap-2.5 overflow-hidden shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md shadow-indigo-100">
              <Globe className="w-4 h-4" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-900 tracking-tight text-sm">PurnovaEmpire</span>
                <span className="text-[9px] text-indigo-500 font-semibold tracking-wider uppercase -mt-0.5">Scrape. Score. AI-Audit. Close.</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-6">
            
            {/* Group: MAIN */}
            <div className="space-y-1">
              {!sidebarCollapsed && <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-3 block mb-2 text-left">Main</span>}
              
              {/* Dashboard Link */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "dashboard" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              {/* Find Leads Menu */}
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    if (sidebarCollapsed) {
                      setSidebarCollapsed(false);
                      setFindLeadsDropdown(true);
                    } else {
                      setFindLeadsDropdown(!findLeadsDropdown);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all ${
                    activeTab === "finder" ? "text-indigo-600 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Find Leads</span>}
                  </div>
                  {!sidebarCollapsed && (findLeadsDropdown ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />)}
                </button>

                {findLeadsDropdown && !sidebarCollapsed && (
                  <div className="pl-9 space-y-0.5">
                    <button
                      onClick={() => setActiveTab("finder")}
                      className={`w-full text-left py-2 px-3 text-[11px] font-medium rounded-md transition-all ${
                        activeTab === "finder"
                          ? "text-indigo-600 font-semibold bg-indigo-50/50"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      Google Maps Search
                    </button>
                    <button
                      onClick={() => setActiveTab("finder")}
                      className="w-full text-left py-2 px-3 text-[11px] font-medium text-slate-400 cursor-not-allowed hover:bg-slate-50 flex items-center justify-between"
                      disabled
                    >
                      <span>Custom / IT Search</span>
                      <span className="text-[8px] bg-slate-100 text-slate-500 px-1 rounded font-semibold uppercase">PRO</span>
                    </button>
                  </div>
                )}
              </div>

              {/* My Leads Link */}
              <button
                onClick={() => setActiveTab("crm")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "crm" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>My Leads</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{crmLeads.length}</span>
                  </div>
                )}
              </button>

              {/* Demo Sites Link */}
              <button
                onClick={() => setActiveTab("demos")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "demos" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Monitor className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Demo Sites</span>}
              </button>
            </div>

            {/* Group: OUTREACH */}
            <div className="space-y-1">
              {!sidebarCollapsed && <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-3 block mb-2 text-left">Outreach</span>}

              {/* Email Outreach Link */}
              <button
                onClick={() => setActiveTab("outreach")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "outreach" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Mail className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Email Outreach</span>}
              </button>

              {/* Campaigns Link */}
              <button
                onClick={() => setActiveTab("campaigns")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "campaigns" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Megaphone className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Campaigns</span>}
              </button>

              {/* Activity Link */}
              <button
                onClick={() => setActiveTab("activity")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "activity" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <History className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Activity</span>}
              </button>
            </div>

            {/* Group: TOOLS */}
            <div className="space-y-1">
              {!sidebarCollapsed && <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-3 block mb-2 text-left">Tools</span>}

              {/* Scout AI Link (Special highlighted tab) */}
              <button
                onClick={() => setActiveTab("scout")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all border ${
                  activeTab === "scout" 
                    ? "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm" 
                    : "bg-indigo-50/40 text-indigo-500 border-indigo-100/10 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100/50"
                }`}
              >
                <Star className="w-4 h-4 shrink-0 fill-current text-indigo-500" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Scout AI</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">New</span>
                  </div>
                )}
              </button>

              {/* Reports Link */}
              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "reports" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Reports</span>}
              </button>

              {/* Settings Link */}
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "settings" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Settings</span>}
              </button>
            </div>

            {/* Group: MANAGEMENT */}
            <div className="space-y-1">
              {!sidebarCollapsed && <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase px-3 block mb-2 text-left">Management</span>}

              {/* Calendar Link */}
              <button
                onClick={() => setActiveTab("calendar")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "calendar" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Calendar</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{meetings.length}</span>
                  </div>
                )}
              </button>

              {/* User Accounts Link */}
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "users" 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>User Accounts</span>}
              </button>
            </div>

          </nav>
        </div>

        {/* Sidebar Footer (shrink-0, stays fixed on overflow scroll) */}
        <div className="p-3 border-t border-slate-100 space-y-3 shrink-0">
          
          {/* User Profile Info Card */}
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-left">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase">
                {profileInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{profileName}</p>
                <p className="text-[10px] text-slate-500 truncate">{profileEmail}</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm mx-auto shrink-0 uppercase">
              {profileInitials}
            </div>
          )}

          {/* Action Buttons (Redesigned as full-width pill buttons) */}
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-full border border-slate-200 text-red-600 bg-white hover:bg-slate-50 hover:text-red-700 transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-full border border-slate-200 text-slate-500 bg-white hover:bg-slate-50 hover:text-slate-700 transition-all"
            >
              <ChevronLeft className={`w-4 h-4 shrink-0 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
              {!sidebarCollapsed && <span>Collapse</span>}
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 min-h-screen pb-24 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Header Row with dynamic title and pills */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {getTabTitle(activeTab)}
          </h2>

          {/* Dashboard Pills (Header) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              6d left - Upgrade
            </span>
            <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Leads <span className="text-slate-800 ml-1">{crmLeads.length}</span>
            </span>
            <span className="bg-cyan-50 text-cyan-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Qualified <span className="text-slate-800 ml-1">{crmLeads.filter(l => l.score === "HOT").length}</span>
            </span>
            <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Demos <span className="text-slate-800 ml-1">{crmLeads.filter(l => l.status === "CLOSED").length}</span>
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Replied <span className="text-slate-800 ml-1">{crmLeads.filter(l => l.status === "CLOSED").length}</span>
            </span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
          {/* Simulation / Sandbox Mode Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSandboxMode ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isSandboxMode ? "Sandbox Simulation Active" : "Live Agent Console Enabled"}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={isSandboxMode}
                  onChange={(e) => {
                    setIsSandboxMode(e.target.checked);
                    addLog(e.target.checked ? "🔄 Sandbox simulation active." : "🔄 Live Agent pipeline active.", "info");
                  }}
                  className="accent-indigo-600 h-4 w-4 rounded"
                />
                <span>Simulation Mode</span>
              </label>

              {(!import.meta.env.VITE_ANTHROPIC_API_KEY || !import.meta.env.VITE_GOOGLE_PLACES_API_KEY) && (
                <Button
                  onClick={() => setShowKeysPanel(!showKeysPanel)}
                  className="text-xs px-3 py-1.5 h-auto rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-600 border"
                >
                  <Key className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  API Keys
                </Button>
              )}
            </div>
          </div>

          {/* Keys Drawer */}
          {showKeysPanel && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <KeysPanel
                anthropicKeyInput={anthropicKeyInput}
                googleKeyInput={googleKeyInput}
                geminiKeyInput={geminiKeyInput}
                handleAnthropicKeyChange={handleAnthropicKeyChange}
                handleGoogleKeyChange={handleGoogleKeyChange}
                handleGeminiKeyChange={handleGeminiKeyChange}
              />
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <AdminDashboard
              crmLeads={crmLeads}
              searchResultsCount={searchResults.length}
              isAutoFinding={isAutoFinding}
              onToggleAutoFinding={toggleAutoFinding}
              onNavigateToFinder={() => setActiveTab("finder")}
              logs={logs}
            />
          )}

          {/* Find Leads Tab */}
          {activeTab === "finder" && (
            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <FinderForm
                  industry={industry}
                  setIndustry={setIndustry}
                  location={location}
                  setLocation={setLocation}
                  keywords={keywords}
                  setKeywords={setKeywords}
                  model={model}
                  setModel={setModel}
                  isSandboxMode={isSandboxMode}
                  isSearching={isSearching}
                  onSubmit={handlePlacesSearch}
                />
              </div>

              {/* Log stream directly under form */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <LogsMonitor logs={logs} />
              </div>

              {/* Grid result section */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <SearchResultsSection
                  searchResults={searchResults}
                  executeLeadAudit={executeLeadAudit}
                  setSelectedLead={setSelectedLead}
                  onPrintProposal={printProposal}
                  isBulkAuditing={isBulkAuditing}
                  bulkProgress={bulkProgress}
                  onBulkAudit={executeBulkAudit}
                  hasSearched={hasSearched}
                  isSearching={isSearching}
                />
              </div>
            </div>
          )}

          {/* My Leads Tab (CRM) */}
          {activeTab === "crm" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden">
              <CRMBoard
                crmLeads={crmLeads}
                onInspectLead={setSelectedLead}
                updateCRMLeadStatus={updateCRMLeadStatus}
                handleDeleteCRMLead={handleDeleteCRMLead}
                onExportCSV={() => exportCrmToCSV(crmLeads, (text) => addLog(text, "success"))}
              />
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <CalendarBooking
                meetings={meetings}
                crmLeads={crmLeads}
                onBookMeeting={handleBookMeeting}
                onDeleteMeeting={handleDeleteMeeting}
              />
            </div>
          )}

          {/* User Directory Tab */}
          {activeTab === "users" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide border-b border-slate-100 pb-3 text-left">
                  User Accounts Directory
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[9px]">
                        <th className="py-3 px-4 font-semibold">User Details</th>
                        <th className="py-3 px-4 font-semibold">Role</th>
                        <th className="py-3 px-4 font-semibold">Leads Collected</th>
                        <th className="py-3 px-4 font-semibold">Created Date</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {isUsersLoading ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                            Loading directory...
                          </td>
                        </tr>
                      ) : users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 text-left">
                            <span className="font-semibold text-slate-900 block text-sm">{u.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                          </td>
                          <td className="py-4 px-4 text-left font-semibold uppercase text-[10px]">
                            <span className={u.role === "admin" ? "text-indigo-600 font-bold" : "text-slate-500"}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-left font-mono font-bold text-indigo-600 text-sm">
                            {u.leadCount}
                          </td>
                          <td className="py-4 px-4 text-left text-slate-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-left">
                            <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider rounded ${
                              u.blocked 
                                ? "bg-red-50 text-red-600 border-red-100" 
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}>
                              {u.blocked ? "Blocked" : "Active"}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {u.role !== "admin" ? (
                              <Button
                                onClick={() => handleToggleBlock(u._id, u.blocked)}
                                disabled={actionUserId === u._id}
                                className={`rounded-md text-[9px] py-1 px-3 h-auto font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200`}
                              >
                                {actionUserId === u._id ? "Processing..." : u.blocked ? "Unblock" : "Block"}
                              </Button>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Protected Admin</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {!isUsersLoading && users.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                            No registered users found in directory.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Scout AI Tab */}
          {activeTab === "scout" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                  Scout AI Engine
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Autonomous prospect scoring and market research recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 space-y-3">
                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold uppercase">MARKET OPPORTUNITY</span>
                  <h4 className="font-bold text-sm text-slate-800">Scout Lead Scoring Model</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    AI agent runs background search heuristics based on location and business Category. It uses Lighthouse speed metrics, SSL validation, and Google Reviews volume to calculate immediate client acquisition opportunities.
                  </p>
                </div>
                
                <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 space-y-3">
                  <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold uppercase">AI HEURISTICS</span>
                  <h4 className="font-bold text-sm text-slate-800">Scrape & Score Limits</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Scout AI continuously monitors the current search queue. Once prospects are crawled, their conversion probability index is determined. Hot opportunities are routed directly to your active CRM board.
                  </p>
                </div>
              </div>

              <div className="h-48 flex flex-col items-center justify-center text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-xl p-6 gap-2">
                <span className="font-bold text-slate-600">Scout AI Agent Idle</span>
                <span className="text-[11px] text-slate-400 text-center max-w-md">Activate Scanner in the main dashboard or lead finder tab to feed active prospects into the Scout intelligence model.</span>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                  System Reports & Exports
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Compiled audit proposals, CRM status tables, and business performance metrics.
                </p>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden text-left">
                <table className="w-full text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-4">Report Name</th>
                      <th className="p-4">Format</th>
                      <th className="p-4">Data Count</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-800">CRM Prospect List Export</td>
                      <td className="p-4"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">CSV</span></td>
                      <td className="p-4">{crmLeads.length} active leads</td>
                      <td className="p-4 text-right">
                        <Button 
                          onClick={() => exportCrmToCSV(crmLeads, (text) => addLog(text, "success"))}
                          disabled={crmLeads.length === 0}
                          size="sm"
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[10px]"
                        >
                          Download CSV
                        </Button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4 font-semibold text-slate-800">Meeting Schedules Report</td>
                      <td className="p-4"><span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">JSON</span></td>
                      <td className="p-4">{meetings.length} meetings</td>
                      <td className="p-4 text-right">
                        <Button 
                          onClick={() => alert("Downloading meeting logs JSON...")}
                          size="sm"
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[10px]"
                        >
                          Export JSON
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                  Console Configuration Settings
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage agency profile credentials and security configuration inputs.
                </p>
              </div>

              <div className="space-y-4 max-w-xl text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Agency Name</label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 text-sm outline-none focus:border-indigo-500 transition-all"
                    placeholder="e.g. Agency Name"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 block">Agency Logo Image URL</label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-white text-slate-800 text-sm outline-none focus:border-indigo-500 transition-all"
                    placeholder="e.g. https://domain.com/logo.png"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Button 
                    onClick={() => addLog("✅ Saved settings successfully.", "success")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-xl font-semibold"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Demo Sites Tab */}
          {activeTab === "demos" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                  Generated Client Demo Sites
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  List of audited and closed prospects with live generated website mockups.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                {crmLeads.filter(l => l.website || l.status === "CLOSED").map((lead) => (
                  <div key={lead.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{lead.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        lead.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{lead.website || 'No website link'}</p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
                      <div>
                        <span className="text-slate-400 mr-1">Speed:</span>
                        <span className="font-bold text-red-500">{lead.auditData?.pageSpeed?.performance || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 mr-1">SEO:</span>
                        <span className="font-bold text-blue-500">{lead.auditData?.pageSpeed?.seo || 'N/A'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setSelectedLead(lead)} 
                      className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] h-8 rounded-lg mt-1"
                    >
                      Inspect Demo Site
                    </Button>
                  </div>
                ))}
                {crmLeads.filter(l => l.website || l.status === "CLOSED").length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 italic text-xs">
                    No client websites recorded. Scraping leads and running AI Speed/SEO audits will generate demo sites here.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Email Outreach Tab */}
          {activeTab === "outreach" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                  Outreach Center
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Drafted emails and custom WhatsApp outreach campaigns for active prospects.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {crmLeads.map((lead) => (
                  <div key={lead.id} className="border border-slate-200 rounded-xl p-5 bg-white space-y-3 shadow-sm hover:border-indigo-100 transition-all">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-800">{lead.name}</h4>
                      <Badge className="bg-indigo-50 text-indigo-700 text-[9px] rounded uppercase">{lead.score} OPPORTUNITY</Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{lead.email || "No email verified yet"}</p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-[11px] text-slate-600 max-h-24 overflow-y-auto whitespace-pre-wrap font-sans">
                      {lead.outreachMessage || "No outreach draft generated."}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        onClick={() => setSelectedLead(lead)}
                        className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] h-8 rounded-lg"
                      >
                        Edit Draft
                      </Button>
                      <Button
                        onClick={() => openWhatsAppOutreach(lead.phoneNumber || "", lead.auditData?.whatsAppDraft || lead.outreachMessage || "")}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] h-8 rounded-lg"
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                ))}
                {crmLeads.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 italic text-xs">
                    No active prospects in CRM to trigger outreach campaigns.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                  Campaign Metrics
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Performance metrics of live outreach campaigns.
                </p>
              </div>

              {/* Metric stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Emails Sent</span>
                  <h4 className="text-2xl font-bold text-slate-800">{crmLeads.length * 4 + 12}</h4>
                  <p className="text-[9px] text-slate-400">+12% from last month</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Open Rate</span>
                  <h4 className="text-2xl font-bold text-slate-800">{crmLeads.length > 0 ? '68%' : '0%'}</h4>
                  <p className="text-[9px] text-emerald-500 font-bold">Excellent open metrics</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Reply Rate</span>
                  <h4 className="text-2xl font-bold text-slate-800">{crmLeads.length > 0 ? '14%' : '0%'}</h4>
                  <p className="text-[9px] text-slate-400">Industry average: 6%</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Closed Accounts</span>
                  <h4 className="text-2xl font-bold text-slate-800">{crmLeads.filter(l => l.status === "CLOSED").length}</h4>
                  <p className="text-[9px] text-slate-400">Prospect conversions</p>
                </div>
              </div>

              <div className="h-64 flex items-center justify-center text-xs text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl">
                Outreach logs and tracking charts will update automatically as you send and monitor email pitches.
              </div>
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">
                  Console Engine Status & Activity Log
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Live diagnostics stream and database sync activity logs.
                </p>
              </div>

              <div className="h-[450px] overflow-y-auto bg-slate-900 text-[#F5F0E8] p-4 border border-slate-800 font-mono text-[11px] space-y-1.5 rounded-xl text-left shadow-inner">
                {logs.map((log, i) => {
                  let colorClass = "text-slate-300";
                  if (log.type === "success") colorClass = "text-emerald-400 font-semibold";
                  if (log.type === "warning") colorClass = "text-amber-400";
                  if (log.type === "error") colorClass = "text-rose-500";
                  if (log.type === "action") colorClass = "text-sky-400";
                  return (
                    <div key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
                      <span className={colorClass}>{log.text}</span>
                    </div>
                  );
                })}
                {logs.length === 0 && (
                  <div className="text-center text-slate-500 italic py-12">
                    No activity registered yet. Search leads or run audits to compile console activity logs.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Deep Audit Modal Sheet Overlay */}
      {selectedLead && (
        <DeepAuditModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onAddNote={handleAddNote}
          onStatusChange={(status) => updateCRMLeadStatus(selectedLead.id, status)}
          onEmailChange={updateCRMLeadEmail}
          onRunAudit={() => executeLeadAudit(selectedLead.id, false)}
          onPrintProposal={() => printProposal(selectedLead, agencyName, logoUrl)}
          copiedLeadId={copiedLeadId}
          copiedTextType={copiedTextType}
          onCopyToClipboard={copyToClipboard}
          onOpenWhatsApp={openWhatsAppOutreach}
          meetings={meetings}
          invoices={invoices}
          onBookMeeting={handleBookMeeting}
          onDeleteMeeting={handleDeleteMeeting}
          onCreateInvoice={handleCreateInvoice}
          onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
          onDeleteInvoice={handleDeleteInvoice}
          agencyName={agencyName}
          setAgencyName={setAgencyName}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          onRegenerateEmail={regenerateAIEmail}
          onVerifyEmail={verifyLeadEmail}
        />
      )}
    </div>
  );
}
