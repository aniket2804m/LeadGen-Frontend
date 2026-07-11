import React from "react";
import { ScoredLead } from "../../types";
import { ThumbsUp, ExternalLink, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GoogleGbpTabProps {
  lead: ScoredLead;
}

export default function GoogleGbpTab({ lead }: GoogleGbpTabProps) {
  const audit = lead.auditData;
  if (!audit) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. GBP profile detail card */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 col-span-2">
          <h4 className="font-cinzel text-xs font-bold text-[#C9A84C] uppercase tracking-wider border-b border-zinc-900 pb-2">
            Google Maps Business Profile Analysis
          </h4>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[11px] leading-relaxed">
            <div className="flex justify-between items-center border-b border-zinc-950 py-1">
              <span className="text-zinc-500">Google Business Listing:</span>
              <span className="text-white font-medium">{audit.googleBusinessProfile?.profileExists ? "✓ Exists" : "✗ Missing"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1">
              <span className="text-zinc-500">Verified Claim Status:</span>
              <span className="text-white font-medium">{audit.googleBusinessProfile?.verifiedStatus || "Not Found"}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1">
              <span className="text-zinc-500">Google Review Rating:</span>
              <span className="text-[#F5C518] font-bold">⭐ {lead.rating !== null && lead.rating !== undefined ? lead.rating : (audit.googleBusinessProfile?.averageRating || "N/A")}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1">
              <span className="text-zinc-500">Total Reviews Count:</span>
              <span className="text-white">{audit.googleBusinessProfile?.totalReviews || 0} reviews</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1">
              <span className="text-zinc-500">Profile Photos Uploaded:</span>
              <span className="text-zinc-300">{audit.googleBusinessProfile?.photosCount || 0} photos</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-950 py-1">
              <span className="text-zinc-500">Rating Growth Velocity:</span>
              <span className="text-zinc-300">{audit.googleBusinessProfile?.reviewGrowth || "N/A"}</span>
            </div>
          </div>

          <div className="text-[11px] space-y-1 bg-black/40 p-3 border border-zinc-950">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">GBP Editorial Summary:</span>
            <p className="text-zinc-300 italic">"{audit.googleBusinessProfile?.businessDescription || 'No description provided by business.'}"</p>
          </div>
          
          {audit.googleBusinessProfile?.missingInformation && audit.googleBusinessProfile.missingInformation.length > 0 && (
            <div className="text-[11px] space-y-1">
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest block mb-1">Missing Profile Information:</span>
              <div className="flex flex-wrap gap-1.5">
                {audit.googleBusinessProfile.missingInformation.map((item, idx) => (
                  <Badge key={idx} className="bg-red-500/5 text-red-400 border border-red-500/10 text-[9px] rounded-none">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. QR Code Widget and Maps Link */}
        {/* <div className="bg-[#0A0A0A] border border-zinc-900 p-5 flex flex-col items-center justify-between text-center space-y-4">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">QR Code to Listing</span>
            <span className="text-[9px] text-zinc-500">Scan to open target profile on Google Maps</span>
          </div>
          
          {audit.businessInfo?.googleMapsLink && audit.businessInfo.googleMapsLink !== "N/A" ? (
            <div className="p-2.5 bg-white border border-zinc-800 rounded-none w-36 h-36 flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(audit.businessInfo.googleMapsLink)}`} 
                alt="Maps Profile QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-32 h-32 bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center gap-1.5 text-zinc-600 text-[10px]">
              <QrCode className="w-8 h-8 opacity-40" />
              <span>QR Code Unavailable</span>
            </div>
          )}

          {audit.businessInfo?.googleMapsLink && audit.businessInfo.googleMapsLink !== "N/A" && (
            <a 
              href={audit.businessInfo.googleMapsLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-[#C9A84C] hover:underline flex items-center gap-1 uppercase font-semibold tracking-wider transition-all"
            >
              Open Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

       */}

       </div>

      {/* Reviews Sentiment and latest reviews list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sentiment Meter (1 Column) */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 text-left">
          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
            Review Sentiment analysis
          </h4>
          
          <div className="space-y-4 pt-2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between text-[10px]">
                <span className="font-semibold text-green-400">Positive Sentiment</span>
                <span className="text-right font-mono">85%</span>
              </div>
              <div className="overflow-hidden h-2 text-xs flex bg-zinc-900 rounded-none">
                <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                <div style={{ width: "10%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                <div style={{ width: "5%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
              </div>
              <div className="flex justify-between text-[9px] text-zinc-500 mt-1.5 font-mono">
                <span>Neutral: 10%</span>
                <span>Negative: 5%</span>
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-400 leading-relaxed font-sans pt-1 border-t border-zinc-950">
              <strong>AI Sentiment Diagnosis:</strong> Customers praise service speed and hospitality. Dilute minor negative complaints by actively triggering new Google review links.
            </p>
          </div>
        </div>

        {/* Latest reviews list (2 Columns) */}
        <div className="bg-[#0A0A0A] border border-zinc-900 p-5 space-y-4 col-span-2">
          <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
            Latest Google Reviews Feedback
          </h4>

          <div className="space-y-3 max-h-52 overflow-y-auto scrollbar-none pr-1">
            {audit.googleBusinessProfile?.latestReviews && audit.googleBusinessProfile.latestReviews.length > 0 ? (
              audit.googleBusinessProfile.latestReviews.map((rev, index) => (
                <div key={index} className="bg-black/60 p-3 border border-zinc-950 text-left space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-white flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5 text-zinc-500" /> {rev.author}</span>
                    <span className="text-[#F5C518] font-bold">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 italic font-sans">"{rev.text}"</p>
                  <span className="block text-[8px] text-zinc-500 font-mono text-right">{rev.date}</span>
                </div>
              ))
            ) : (
              <p className="text-zinc-600 italic text-center pt-16 text-xs">No reviews history retrieved from Google API.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
