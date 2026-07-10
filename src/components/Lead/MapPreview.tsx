import React from "react";
import { MapPin } from "lucide-react";

interface MapPreviewProps {
  lat: number;
  lng: number;
}

export default React.memo(function MapPreview({
  lat,
  lng,
}: MapPreviewProps) {
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  return (
    <div className="space-y-2 text-left">
      <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
        Google Maps Location
      </h4>

      <div className="w-full h-48 border border-zinc-800 bg-black overflow-hidden relative">
        <iframe
          title="Google Map Location Preview"
          src={embedUrl}
          width="100%"
          height="100%"
          loading="lazy"
          className="border-none"
        />
      </div>
    </div>
  );
});