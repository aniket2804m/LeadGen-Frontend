import React from "react";
import { Key, ShieldAlert } from "lucide-react";

interface KeysPanelProps {
  anthropicKeyInput: string;
  googleKeyInput: string;
  geminiKeyInput: string;
  handleAnthropicKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGoogleKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGeminiKeyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default React.memo(function KeysPanel({}: KeysPanelProps) {
  return (
    <div className="glass border border-[#C9A84C]/20 p-5 space-y-3 animate-fadeIn text-left">
      <h3 className="font-cinzel text-xs uppercase tracking-wider font-semibold text-white flex items-center gap-2">
        <Key className="w-4 h-4 text-[#C9A84C]" /> Secure Environment Configuration
      </h3>
      <div className="flex items-center gap-3 bg-[#C9A84C]/10 border border-[#C9A84C]/25 p-3 rounded-none">
        <ShieldAlert className="w-5 h-5 text-[#C9A84C]" />
        <div>
          <p className="text-xs font-semibold text-white uppercase tracking-wider">
            API Keys Managed Server-Side
          </p>
          <p className="text-[10px] text-[#F5F0E8]/70">
            For security, Google Places, PageSpeed, and Gemini LLM keys are hosted securely on the GGM backend. Client-side input is disabled.
          </p>
        </div>
      </div>
    </div>
  );
});
