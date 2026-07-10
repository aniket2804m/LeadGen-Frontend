import React, { useState } from "react";
import { Shield, Sparkles, Zap, Award, Search, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import API from "../../config/api";

export default function UserHome() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMsg("Please provide your name and email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      await API.post("/leadgen/public-audit-request", formData);
      setSuccessMsg("✓ Request Received! Our consultants at GGM Agency are compiling your local ranking reports. We will reach out shortly.");
      setFormData({ name: "", email: "", phone: "", website: "" });
    } catch (err: any) {
      setErrorMsg("Failed to submit request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 font-montserrat relative overflow-hidden text-left">
      
      {/* Background radial gold glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A84C]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A84C]/3 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/5 text-[#C9A84C] text-[10px] uppercase font-bold tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Premium Performance Marketing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white uppercase tracking-tight leading-none">
            Automate Your Growth. <br/>
            <span className="gold-text-glow text-[#C9A84C]">Dominate Search.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#F5F0E8]/70 leading-relaxed max-w-xl">
            Gaurav Growth Marketing (GGM Agency) builds elite client pipeline engines. We crawl your local service footprint, diagnose SEO bottleneck flaws, and accelerate your website speed in real-time.
          </p>

          {/* Features bullet list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold">✓</span>
              <span>Google Maps SEO Optimization</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold">✓</span>
              <span>Ultra-Fast Page Speed Accelerators</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold">✓</span>
              <span>Automated Outreach Pipelines</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold">✓</span>
              <span>Premium Custom Funnels</span>
            </div>
          </div>
        </div>

        {/* Audit Form Card */}
        <Card className="bg-[#0F0F0F] border border-zinc-800 p-6 sm:p-8 rounded-none relative shadow-2xl">
          <div className="space-y-2 mb-6">
            <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-widest">
              Request Free Growth Audit
            </h3>
            <p className="text-[11px] text-[#F5F0E8]/50">
              Submit your company details. Our AI scoring engine evaluates your site load speeds and lists critical competitive flaws.
            </p>
          </div>

          {successMsg && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 px-4 py-3 text-xs mb-6 text-center">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-200 px-4 py-3 text-xs mb-6 text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">Your Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Gaurav Sharma"
                required
                className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs py-5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">Email Address *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@business.com"
                  required
                  className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs py-5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">Phone Number</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs py-5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-semibold">Website URL</label>
              <Input
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="e.g. mybusiness.com"
                className="bg-black border border-zinc-850 text-white rounded-none focus-visible:ring-0 text-xs py-5"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#C9A84C] hover:bg-white text-black font-semibold text-xs tracking-widest uppercase rounded-none px-6 py-5 h-auto w-full transition-all duration-300 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? "Registering Request..." : (
                <>
                  <Send className="w-3.5 h-3.5" /> Submit Audit Request
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>

      {/* Services Grid Section */}
      <div className="bg-black/50 border-t border-zinc-900 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white uppercase tracking-wider">
              High-Ticket SEO Services
            </h2>
            <p className="text-xs text-[#F5F0E8]/50 max-w-lg mx-auto">
              We leverage advanced technical indicators and AI analytics to optimize client performance indexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 border border-zinc-850 space-y-4">
              <div className="w-10 h-10 bg-[#C9A84C]/10 border border-[#C9A84C]/35 flex items-center justify-center text-[#C9A84C]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-widest">
                Lighthouse Acceleration
              </h3>
              <p className="text-[11px] text-[#F5F0E8]/60 leading-relaxed">
                Poor speed rankings lose clients. We refactor assets, optimize databases, and cache requests to guarantee top-tier mobile scores.
              </p>
            </div>

            <div className="glass p-6 border border-zinc-850 space-y-4">
              <div className="w-10 h-10 bg-[#C9A84C]/10 border border-[#C9A84C]/35 flex items-center justify-center text-[#C9A84C]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-widest">
                Google Maps Domination
              </h3>
              <p className="text-[11px] text-[#F5F0E8]/60 leading-relaxed">
                Dominate localized search in your region. We audit competitor reviews, optimize tags, and manage local citations dynamically.
              </p>
            </div>

            <div className="glass p-6 border border-zinc-850 space-y-4">
              <div className="w-10 h-10 bg-[#C9A84C]/10 border border-[#C9A84C]/35 flex items-center justify-center text-[#C9A84C]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-widest">
                AI Cold Outreach
              </h3>
              <p className="text-[11px] text-[#F5F0E8]/60 leading-relaxed">
                Connect directly with high-intent localized prospects via automated personal email campaigns matching specific flaws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
