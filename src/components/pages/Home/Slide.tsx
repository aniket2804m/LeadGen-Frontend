import React from "react";

const CLIENTS = [
  "AI AUDIT REPORT",
  "CLIENT PORTAL",
  "GOOGLE MAPS SCRAPING",
  "AI LEAD SCORING",
  "DEMO SITE BUILDER",
  "COLD MAIL OUTREACH",
  "SHARE LEAD WHATSAPP",
  
];

const Slide = () => {
  return (
    <section className="bg-[#f2c94c] overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...CLIENTS, ...CLIENTS].map((client, index) => (
          <span
            key={index}
            className="mx-8 text-xl font-semibold text-black"
          >
            {client}  ✓
          </span>
        ))}
      </div>
    </section>
  );
};

export default Slide;