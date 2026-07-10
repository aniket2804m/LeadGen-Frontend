import React, { useState, useEffect, useCallback } from "react";
import { Key } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-3.5 py-1 text-xs tracking-widest uppercase font-semibold rounded-none">
            Agency Core OS
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold tracking-wider text-white uppercase gold-text-glow">
            Agency Operating System
          </h1>
          <p className="text-sm md:text-base text-[#F5F0E8]/70 font-cormorant italic tracking-wide max-w-xl mx-auto">
            Scan markets, scrape portals, audit metrics, compile growth proposals, and control your outreach pipeline in one client-side console.
          </p>
          <div className="h-[1px] w-20 bg-[#C9A84C] mx-auto mt-4" />
        </div>

        {/* Console Mode Badging & Key Config Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 glass px-5 py-3 border border-[#C9A84C]/15">
          <div className="flex items-center gap-6">
            {/* Tab Navigation */}
            <div className="flex border border-[#C9A84C]/25 bg-black p-0.5 rounded-none flex-wrap">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                  activeTab === "dashboard" ? "bg-[#C9A84C] text-black" : "text-[#F5F0E8] hover:text-[#C9A84C]"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("finder")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                  activeTab === "finder" ? "bg-[#C9A84C] text-black" : "text-[#F5F0E8] hover:text-[#C9A84C]"
                }`}
              >
                Lead Finder
              </button>
              <button
                onClick={() => setActiveTab("crm")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                  activeTab === "crm" ? "bg-[#C9A84C] text-black" : "text-[#F5F0E8] hover:text-[#C9A84C]"
                }`}
              >
                CRM Pipeline ({crmLeads.length})
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                  activeTab === "calendar" ? "bg-[#C9A84C] text-black" : "text-[#F5F0E8] hover:text-[#C9A84C]"
                }`}
              >
                Calendar ({meetings.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors ${
                  activeTab === "users" ? "bg-[#C9A84C] text-black" : "text-[#F5F0E8] hover:text-[#C9A84C]"
                }`}
              >
                User Accounts
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${isSandboxMode ? 'bg-[#F5C518]' : 'bg-green-500'}`} />
              <span className={`font-semibold uppercase tracking-wider text-[10px] ${isSandboxMode ? 'text-[#F5C518]' : 'text-green-500'}`}>
                {isSandboxMode ? "Sandbox Simulation" : "Live OS Enabled"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#C9A84C] hover:text-white select-none">
              <input
                type="checkbox"
                checked={isSandboxMode}
                onChange={(e) => {
                  setIsSandboxMode(e.target.checked);
                  addLog(e.target.checked ? "🔄 Sandbox simulation active." : "🔄 Live Agent pipeline active.", "info");
                }}
                className="accent-[#C9A84C] h-3.5 w-3.5"
              />
              <span>Simulation Mode</span>
            </label>

            {(!import.meta.env.VITE_ANTHROPIC_API_KEY || !import.meta.env.VITE_GOOGLE_PLACES_API_KEY) && (
              <Button
                onClick={() => setShowKeysPanel(!showKeysPanel)}
                className="bg-transparent hover:bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] text-[10px] tracking-wider uppercase px-3 py-1.5 h-auto rounded-none"
              >
                <Key className="w-3 h-3 mr-1" />
                Security
              </Button>
            )}
          </div>
        </div>

        {/* Temporary API Keys Drawer */}
        {showKeysPanel && (
          <KeysPanel
            anthropicKeyInput={anthropicKeyInput}
            googleKeyInput={googleKeyInput}
            geminiKeyInput={geminiKeyInput}
            handleAnthropicKeyChange={handleAnthropicKeyChange}
            handleGoogleKeyChange={handleGoogleKeyChange}
            handleGeminiKeyChange={handleGeminiKeyChange}
          />
        )}

        {/* Tab 0: Admin Dashboard */}
        {activeTab === "dashboard" && (
          <AdminDashboard
            crmLeads={crmLeads}
            searchResultsCount={searchResults.length}
            isAutoFinding={isAutoFinding}
            onToggleAutoFinding={toggleAutoFinding}
            onNavigateToFinder={() => setActiveTab("finder")}
          />
        )}

        {/* Tab 1: Finder Workspace */}
        {activeTab === "finder" && (
          <div className="space-y-8">
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

            {/* Logs Monitor */}
            <LogsMonitor logs={logs} />

            {/* Results Grid */}
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
        )}

        {/* Tab 2: CRM board */}
        {activeTab === "crm" && (
          <CRMBoard
            crmLeads={crmLeads}
            onInspectLead={setSelectedLead}
            updateCRMLeadStatus={updateCRMLeadStatus}
            handleDeleteCRMLead={handleDeleteCRMLead}
            onExportCSV={() => exportCrmToCSV(crmLeads, (text) => addLog(text, "success"))}
          />
        )}

        {/* Tab 3: Calendar Meetings */}
        {activeTab === "calendar" && (
          <CalendarBooking
            meetings={meetings}
            crmLeads={crmLeads}
            onBookMeeting={handleBookMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        )}

        {/* Tab 4: User Directory */}
        {activeTab === "users" && (
          <div className="glass border border-zinc-800 p-6 space-y-4 text-left">
            <h3 className="font-cinzel text-sm font-bold text-white tracking-widest uppercase border-b border-zinc-900 pb-2">
              User Directory & Pipeline Monitoring
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-widest text-[9px]">
                    <th className="py-3 px-4 font-semibold">User Details</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">Leads Collected</th>
                    <th className="py-3 px-4 font-semibold">Created Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {isUsersLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500 italic">
                        Loading directory...
                      </td>
                    </tr>
                  ) : users.map((u) => (
                    <tr key={u._id} className="hover:bg-zinc-950/40 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-white block text-sm">{u.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{u.email}</span>
                      </td>
                      <td className="py-4 px-4 font-semibold uppercase text-[10px]">
                        <span className={u.role === "admin" ? "text-[#C9A84C]" : "text-zinc-400"}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-[#C9A84C] text-sm">
                        {u.leadCount}
                      </td>
                      <td className="py-4 px-4 text-zinc-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider ${
                          u.blocked 
                            ? "bg-red-500/10 text-red-500 border-red-500/20" 
                            : "bg-green-500/10 text-green-500 border-green-500/20"
                        }`}>
                          {u.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {u.role !== "admin" ? (
                          <Button
                            onClick={() => handleToggleBlock(u._id, u.blocked)}
                            disabled={actionUserId === u._id}
                            className={`rounded-none text-[9px] py-1 px-3 h-auto font-semibold ${
                              u.blocked 
                                ? "bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-500/20" 
                                : "bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/20"
                            }`}
                          >
                            {actionUserId === u._id ? "Processing..." : u.blocked ? "Unblock" : "Block"}
                          </Button>
                        ) : (
                          <span className="text-[10px] text-zinc-600 italic">Protected Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!isUsersLoading && users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500 italic">
                        No registered users found in directory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
