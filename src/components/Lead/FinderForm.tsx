import React from "react";
import { Briefcase, MapPin, Sparkles, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinderFormProps {
  industry: string;
  setIndustry: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  keywords: string;
  setKeywords: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  isSandboxMode: boolean;
  isSearching: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default React.memo(function FinderForm({
  industry,
  setIndustry,
  location,
  setLocation,
  keywords,
  setKeywords,
  model,
  setModel,
  isSandboxMode,
  isSearching,
  onSubmit,
}: FinderFormProps) {
  return (
    <div className="glass p-6 md:p-8 space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-[#C9A84C]/15 pb-3">
        <h2 className="font-cinzel text-base text-white uppercase tracking-wider font-semibold">
          Find Prospects
        </h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="model-choice" className="text-[10px] uppercase text-[#F5F0E8]/50 font-semibold tracking-wider">Model:</Label>
            <select
              id="model-choice"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={isSandboxMode}
              className={`bg-black border border-[#C9A84C]/20 text-[#F5F0E8] text-[10px] px-2.5 py-1 focus:border-[#C9A84C] outline-none rounded-none cursor-pointer ${isSandboxMode ? 'opacity-40' : ''}`}
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
            </select>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ind" className="text-xs uppercase text-[#F5F0E8]/70 tracking-widest font-semibold flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-[#C9A84C]" /> Industry Niche
            </Label>
            <Input
              id="ind"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Dentists, Roofer, Boutique Hotel"
              disabled={isSearching}
              className="bg-[#0F0F0F] border-[#C9A84C]/20 focus:border-[#C9A84C] text-[#F5F0E8] placeholder-[#F5F0E8]/30 rounded-none py-5 focus-visible:ring-0 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loc" className="text-xs uppercase text-[#F5F0E8]/70 tracking-widest font-semibold flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" /> Location
            </Label>
            <Input
              id="loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Austin TX, London, Seattle"
              disabled={isSearching}
              className="bg-[#0F0F0F] border-[#C9A84C]/20 focus:border-[#C9A84C] text-[#F5F0E8] placeholder-[#F5F0E8]/30 rounded-none py-5 focus-visible:ring-0 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key" className="text-xs uppercase text-[#F5F0E8]/70 tracking-widest font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> Audience Filter Keywords
            </Label>
            <Input
              id="key"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. needs SEO, slow speed, no web"
              disabled={isSearching}
              className="bg-[#0F0F0F] border-[#C9A84C]/20 focus:border-[#C9A84C] text-[#F5F0E8] placeholder-[#F5F0E8]/30 rounded-none py-5 focus-visible:ring-0 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#C9A84C]/10">
          <Button
            type="submit"
            disabled={isSearching}
            className="bg-[#C9A84C] hover:bg-[#F5F0E8] text-black font-montserrat font-bold uppercase tracking-wider text-xs px-8 py-5 rounded-none flex items-center gap-2"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search Google Places
          </Button>
        </div>
      </form>
    </div>
  );
});
