import { ScoredLead, Invoice } from "./types";

/**
 * Helper: Parses JSON code block out of text
 */
export const parseJsonBlock = (text: string): any => {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON boundaries found");
    const raw = text.substring(start, end + 1);
    return JSON.parse(raw);
  } catch (e) {
    console.error("JSON parse failure on raw block:", text);
    throw e;
  }
};

/**
 * WhatsApp Redirect builder
 */
export const openWhatsAppOutreach = (phone: string, text: string) => {
  const cleanPhone = phone.replace(/[^0-9+]/g, "");
  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
};

/**
 * Helper to compile website & social media flags
 */
export const getAuditFlags = (lead: ScoredLead) => {
  const flags: { title: string; desc: string; type: "error" | "warning" }[] = [];
  if (!lead.website) {
    flags.push({
      title: "Missing Website Portal",
      desc: "No website listed. Losing 100% of organic mobile prospects.",
      type: "error"
    });
  } else if (lead.auditData?.pageSpeed) {
    const perf = lead.auditData.pageSpeed.performance;
    if (perf < 50) {
      flags.push({
        title: `Slow Site Load (${perf}%)`,
        desc: "Fails Google Web Vitals. Causes high visitor bounce rates.",
        type: "error"
      });
    }
    
    const metaDesc = lead.auditData.seoReport?.metaDescription;
    if (!metaDesc || metaDesc === "N/A" || metaDesc.toLowerCase().includes("missing")) {
      flags.push({
        title: "Missing SEO Metadata",
        desc: "No homepage description. Fails standard search ranking indexes.",
        type: "warning"
      });
    }
  }
  
  if (lead.auditData?.socialPresence) {
    const sp = lead.auditData.socialPresence;
    if (!sp.facebook && !sp.instagram && !sp.linkedin) {
      flags.push({
        title: "Inactive Social Footprint",
        desc: "No active channels (Facebook, Instagram, LinkedIn) detected.",
        type: "warning"
      });
    }
  }
  
  if (lead.rating && lead.rating < 4.2) {
    flags.push({
      title: `Low Reputation Index (${lead.rating} ★)`,
      desc: "Sub-par google review rating. High risk of losing leads to competition.",
      type: "warning"
    });
  }
  
  return flags;
};

/**
 * Helper to split Subject and Body out of cold outreach email draft
 */
export const parseEmailDraft = (draftText: string) => {
  const lines = draftText.split("\n");
  let subject = "Digital Audit & Growth Proposal - Purnova";
  let body = draftText;
  
  const subjectLine = lines.find(l => l.toLowerCase().startsWith("subject:"));
  if (subjectLine) {
    subject = subjectLine.replace(/subject:\s*/i, "").trim();
    body = lines.filter(l => !l.toLowerCase().startsWith("subject:")).join("\n").trim();
  }
  
  return { subject, body };
};

/**
 * Printable proposals generator
 */
export const printProposal = (lead: ScoredLead, agencyName = "PURNOVA", logoUrl = "") => {
  const audit = lead.auditData;
  if (!audit) return;

  const info = audit.businessInfo;
  const gbp = audit.googleBusinessProfile;
  const web = audit.websiteAnalysis;
  const social = audit.socialMedia;
  const comps = audit.competitors || [];
  const summary = audit.aiBusinessSummary;
  const recs = audit.recommendations || [];
  const confidence = audit.confidenceScores || {};

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const resolvedLogoHtml = logoUrl 
    ? `<img src="${logoUrl}" style="max-height: 50px; margin-bottom: 8px;" alt="Agency Logo" />` 
    : "";

  // Progress Bar Helper
  const getProgressBar = (score: number, max: number) => {
    const pct = Math.round((score / max) * 100);
    let color = "#EF4444"; // Red
    if (pct >= 80) color = "#10B981"; // Green
    else if (pct >= 60) color = "#F59E0B"; // Yellow
    else if (pct >= 40) color = "#F97316"; // Orange
    
    return `
      <div style="background: #E2E8F0; border-radius: 4px; height: 8px; width: 100%; overflow: hidden; margin-top: 4px;">
        <div style="background: ${color}; width: ${pct}%; height: 100%; border-radius: 4px;"></div>
      </div>
    `;
  };

  const scorePct = audit.digitalFootprintScore || 0;
  let scoreColor = "#EF4444";
  if (scorePct >= 80) scoreColor = "#10B981";
  else if (scorePct >= 60) scoreColor = "#F59E0B";
  else if (scorePct >= 40) scoreColor = "#F97316";

  printWindow.document.write(`
    <html>
      <head>
        <title>Premium Digital Audit Report - ${lead.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0F172A;
            line-height: 1.5;
            background: #FFFFFF;
            margin: 0;
            padding: 0;
            font-size: 13px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #E2E8F0;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          .agency-title {
            font-family: 'Cinzel', serif;
            font-size: 24px;
            font-weight: 700;
            color: #B45309;
            letter-spacing: 2px;
          }
          .report-meta {
            text-align: right;
            font-size: 11px;
            color: #64748B;
          }
          h1, h2, h3, h4 {
            font-family: 'Cinzel', serif;
            color: #0F172A;
            margin-top: 0;
          }
          h1 {
            font-size: 22px;
            margin-bottom: 15px;
            text-align: center;
            color: #1E293B;
          }
          h2 {
            font-size: 15px;
            border-bottom: 1px solid #CBD5E1;
            padding-bottom: 6px;
            margin-top: 25px;
            margin-bottom: 15px;
            color: #1E293B;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .card {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
          }
          .metric-label {
            font-size: 11px;
            color: #64748B;
            font-weight: 600;
            text-transform: uppercase;
          }
          .metric-value {
            font-weight: 700;
            font-size: 13px;
            color: #1E293B;
          }
          .score-badge {
            background: ${scoreColor}15;
            color: ${scoreColor};
            border: 1px solid ${scoreColor}30;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 11px;
            display: inline-block;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 12px;
          }
          th, td {
            border: 1px solid #E2E8F0;
            padding: 10px 12px;
            text-align: left;
          }
          th {
            background: #F1F5F9;
            font-weight: 600;
            color: #334155;
          }
          .priority-badge {
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 700;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .priority-Critical { background: #FEE2E2; color: #991B1B; }
          .priority-High { background: #FFEDD5; color: #9A3412; }
          .priority-Medium { background: #FEF9C3; color: #854D0E; }
          .priority-Low { background: #F0FDF4; color: #166534; }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #E2E8F0;
            padding-top: 15px;
            text-align: center;
            font-size: 10px;
            color: #94A3B8;
          }
          @media print {
            body {
              background: #FFF;
              color: #000;
            }
            .card {
              background: #FFF;
              border: 1px solid #CCC;
              page-break-inside: avoid;
            }
            tr {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div>
              ${resolvedLogoHtml}
              <div class="agency-title">${agencyName.toUpperCase()}</div>
            </div>
            <div class="report-meta">
              <div><strong>AUDIT REPORT</strong></div>
              <div>Generated: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}</div>
              <div>Software Version: v2.0 | Engine: AI-Powered</div>
            </div>
          </div>

          <h1>Local Search Dominance Audit</h1>
          <p style="text-align: center; margin-bottom: 25px; color: #64748B;">
            A detailed search engine visibility, reputation footprint, and technical performance analysis prepared for <strong>${lead.name}</strong>.
          </p>

          <!-- Overall Digital Health Score -->
          <div class="card" style="text-align: center; padding: 25px 15px; border-left: 4px solid ${scoreColor};">
            <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1.5px;">Digital Footprint Score</div>
            <div style="font-size: 48px; font-weight: 800; color: ${scoreColor}; font-family: 'Cinzel', serif; margin: 10px 0;">
              ${scorePct}<span style="font-size: 18px; color: #94A3B8;">/100</span>
            </div>
            <div class="score-badge" style="margin-bottom: 12px;">
              Digital Maturity: ${summary?.maturityLevel || "Emerging"}
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #475569; max-width: 600px; margin: 0 auto;">
              ${lead.reasoning}
            </div>
            ${audit.aeoGeoAnalysis ? `
              <div style="display: flex; justify-content: center; gap: 40px; margin-top: 15px; border-top: 1px solid #E2E8F0; padding-top: 15px;">
                <div>
                  <span style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; display: block;">AEO Score</span>
                  <span style="font-size: 18px; font-weight: 700; color: #B45309;">${audit.aeoGeoAnalysis.aeoScore}/100</span>
                </div>
                <div style="border-left: 1px solid #E2E8F0; height: 35px;"></div>
                <div>
                  <span style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; display: block;">GEO Score</span>
                  <span style="font-size: 18px; font-weight: 700; color: #B45309;">${audit.aeoGeoAnalysis.geoScore}/100</span>
                </div>
              </div>
            ` : ""}
          </div>

          <!-- Section 1: Business Profile -->
          <h2>1. Business Info & Citations</h2>
          <div class="card grid-2">
            <div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Name:</span> <span class="metric-value">${lead.name}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Category:</span> <span class="metric-value">${info?.category || lead.address.split(',')[0]}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Address:</span> <span class="metric-value">${lead.address}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Phone Number:</span> <span class="metric-value">${lead.phoneNumber || "N/A"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Website:</span> <span class="metric-value">${lead.website || "N/A"}</span>
              </div>
            </div>
            <div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Latitude/Longitude:</span> <span class="metric-value">${info?.latitude || "N/A"}, ${info?.longitude || "N/A"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Opening Hours:</span> <span class="metric-value">${info?.openingHours || "N/A"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Data Sources:</span> <span class="metric-value">${info?.sourceOfData || "Google, OSM"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Maps Link:</span> <span class="metric-value">${info?.googleMapsLink !== "N/A" ? `<a href="${info?.googleMapsLink}" target="_blank">View on Google Maps</a>` : "Not Detected"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Confidence:</span> <span class="metric-value">${confidence?.businessInfo?.confidenceLevel || "High"} (${confidence?.businessInfo?.apiUsed || "Google API"})</span>
              </div>
            </div>
          </div>

          <!-- Section 2: Score Breakdowns Explained -->
          <h2>2. Digital Footprint Breakdown</h2>
          <div class="card" style="padding: 10px 15px;">
            ${Object.entries(audit.breakdown || {}).map(([key, item]: [string, any]) => {
              const formattedName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return `
                <div style="margin-bottom: 15px; border-bottom: 1px dashed #E2E8F0; padding-bottom: 12px; page-break-inside: avoid;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 12px;">
                    <span style="color: #1E293B;">${formattedName}</span>
                    <span style="color: #B45309;">${item.score} / ${item.max} Points</span>
                  </div>
                  ${getProgressBar(item.score, item.max)}
                  <div style="font-size: 11px; margin-top: 6px; color: #475569;">
                    <strong>Observation:</strong> ${item.reason}
                  </div>
                  <div style="font-size: 11px; color: #0369A1; margin-top: 2px;">
                    <strong>Recommendation:</strong> ${item.recommendation}
                  </div>
                  <div style="font-size: 10px; color: #15803D; margin-top: 2px; font-weight: 600;">
                    <strong>Expected Uplift:</strong> ${item.expectedImprovement}
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Section 3: Google Business Profile Analysis -->
          <h2>3. Google Business Profile & Reputation</h2>
          <div class="card grid-2">
            <div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Profile Exists:</span> <span class="metric-value">${gbp?.profileExists ? "✓ Yes" : "✗ No"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Verification:</span> <span class="metric-value">${gbp?.verifiedStatus || "Not Found"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Average Star Rating:</span> <span class="metric-value">${gbp?.averageRating || "N/A"} ★</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Total Google Reviews:</span> <span class="metric-value">${gbp?.totalReviews || "N/A"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Review Velocity:</span> <span class="metric-value">${gbp?.reviewGrowth || "Not Available"}</span>
              </div>
            </div>
            <div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Business Photos Count:</span> <span class="metric-value">${gbp?.photosCount || 0} photos</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Categories Listed:</span> <span class="metric-value">${gbp?.categories?.join(", ") || "N/A"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Missing Data Fields:</span> <span class="metric-value" style="color: #DC2626;">${gbp?.missingInformation?.join(", ") || "None"}</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span class="metric-label">Sentiment Quality:</span> <span class="metric-value">Positive Sentiment Dominates</span>
              </div>
            </div>
          </div>

          <!-- Section 4: Website Analysis -->
          <h2>4. Website Technical SEO & Speed</h2>
          ${!web?.exists ? `
            <div class="card" style="text-align: center; border: 1px dashed #F59E0B; background: #FFFBEB;">
              <span style="font-weight: 700; color: #B45309; display: block; margin-bottom: 4px;">Website Status: Not Found / N/A</span>
              <p style="font-size: 11px; margin: 0; color: #78350F;">
                No web domain is currently linked to this business profile. Development of a search-optimized web landing page is highly recommended.
              </p>
            </div>
          ` : `
            <div class="card grid-2">
              <div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">HTTPS Status:</span> <span class="metric-value">${web.https ? "✓ Secure" : "✗ Insecure"}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">SSL Validity:</span> <span class="metric-value">${web.ssl || "N/A"}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">CMS / Tech Stack:</span> <span class="metric-value">${web.cms || "Custom"} (${web.technologyStack?.join(", ") || "N/A"})</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Mobile Friendliness:</span> <span class="metric-value">${web.mobileFriendly ? "✓ Fully Responsive" : "✗ Needs Work"}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Mobile Speed Score:</span> <span class="metric-value">${web.pageSpeed || "N/A"}/100</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">SEO Score:</span> <span class="metric-value">${web.seoScore || "N/A"}/100</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Title Tag:</span> <span class="metric-value" style="font-size: 11px;">"${web.titleTag || "N/A"}"</span>
                </div>
              </div>
              <div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Robots.txt / Sitemap:</span> <span class="metric-value">Robots: ${web.robotsTxt || "N/A"} | Sitemap: ${web.sitemapXml || "N/A"}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Canonical Tags:</span> <span class="metric-value">${web.canonicalTags || "N/A"}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Schema.org Markup:</span> <span class="metric-value">${web.schemaMarkup || "N/A"}</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Meta Description:</span> <span class="metric-value" style="font-size: 11px;">"${web.metaDescription || "N/A"}"</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Broken Links Count:</span> <span class="metric-value">${web.brokenLinks || 0} broken</span>
                </div>
                <div style="margin-bottom: 8px;">
                  <span class="metric-label">Security Headers:</span> <span class="metric-value">Security Rating: ${web.securityScore || "N/A"}/100</span>
                </div>
              </div>
            </div>
          `}

          <!-- Section 5: AEO & GEO Search Engine Visibility -->
          ${audit.aeoGeoAnalysis ? `
            <h2>5. AI Search & Generative Engine Optimization (AEO/GEO)</h2>
            <div class="card grid-2">
              <div>
                <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 10px; color: #1E293B;">Answer Engine Optimization (AEO)</h3>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">Schema Markup:</span> <span class="metric-value">${audit.aeoGeoAnalysis.aeoDetails?.schemaMarkup || "N/A"}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">FAQ Structuring:</span> <span class="metric-value">${audit.aeoGeoAnalysis.aeoDetails?.faqStructured ? "Structured ✓" : "Missing ✗"}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">Conversational Readability:</span> <span class="metric-value">${audit.aeoGeoAnalysis.aeoDetails?.conversationalReadability || "N/A"}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">Factual Density:</span> <span class="metric-value">${audit.aeoGeoAnalysis.aeoDetails?.factualDensity || "N/A"}</span>
                </div>
                <div style="margin-top: 10px; font-size: 11px;">
                  <strong style="color: #1E293B; display: block; margin-bottom: 3px;">Strengths:</strong>
                  <ul style="margin: 0 0 8px 0; padding-left: 15px; color: #475569;">
                    ${(audit.aeoGeoAnalysis.aeoDetails?.strengths || []).map((s: string) => `<li>${s}</li>`).join("")}
                    ${(audit.aeoGeoAnalysis.aeoDetails?.strengths || []).length === 0 ? "<li>None identified.</li>" : ""}
                  </ul>
                  <strong style="color: #B45309; display: block; margin-bottom: 3px;">Recommendations:</strong>
                  <ul style="margin: 0; padding-left: 15px; color: #475569;">
                    ${(audit.aeoGeoAnalysis.aeoDetails?.recommendations || []).map((r: string) => `<li>${r}</li>`).join("")}
                    ${(audit.aeoGeoAnalysis.aeoDetails?.recommendations || []).length === 0 ? "<li>AEO fully optimized.</li>" : ""}
                  </ul>
                </div>
              </div>
              <div>
                <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 10px; color: #1E293B;">Generative Engine Optimization (GEO)</h3>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">Citation Authority:</span> <span class="metric-value">${audit.aeoGeoAnalysis.geoDetails?.citationAuthority || "N/A"}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">Generative Sentiment Index:</span> <span class="metric-value">${audit.aeoGeoAnalysis.geoDetails?.sentimentScore !== undefined ? `${audit.aeoGeoAnalysis.geoDetails.sentimentScore}%` : "N/A"}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">Source Diversity:</span> <span class="metric-value">${audit.aeoGeoAnalysis.geoDetails?.sourceDiversity || "N/A"}</span>
                </div>
                <div style="margin-bottom: 6px;">
                  <span class="metric-label">AI Training Corp. Brand Mentions:</span> <span class="metric-value">${audit.aeoGeoAnalysis.geoDetails?.brandMentionFrequency || "N/A"}</span>
                </div>
                <div style="margin-top: 10px; font-size: 11px;">
                  <strong style="color: #1E293B; display: block; margin-bottom: 3px;">Strengths:</strong>
                  <ul style="margin: 0 0 8px 0; padding-left: 15px; color: #475569;">
                    ${(audit.aeoGeoAnalysis.geoDetails?.strengths || []).map((s: string) => `<li>${s}</li>`).join("")}
                    ${(audit.aeoGeoAnalysis.geoDetails?.strengths || []).length === 0 ? "<li>None identified.</li>" : ""}
                  </ul>
                  <strong style="color: #B45309; display: block; margin-bottom: 3px;">Recommendations:</strong>
                  <ul style="margin: 0; padding-left: 15px; color: #475569;">
                    ${(audit.aeoGeoAnalysis.geoDetails?.recommendations || []).map((r: string) => `<li>${r}</li>`).join("")}
                    ${(audit.aeoGeoAnalysis.geoDetails?.recommendations || []).length === 0 ? "<li>GEO fully optimized.</li>" : ""}
                  </ul>
                </div>
              </div>
            </div>
          ` : ""}

          <!-- Section 6: Competitor Comparison -->
          <h2>6. Local Competitor Benchmark</h2>
          <div class="card" style="padding: 5px;">
            <table>
              <thead>
                <tr>
                  <th>Business Name</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>SEO Score</th>
                  <th>Speed Score</th>
                  <th>Footprint</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${lead.name} (You)</strong></td>
                  <td>${lead.rating || "N/A"} ★</td>
                  <td>${gbp?.totalReviews || 0}</td>
                  <td>${web?.seoScore || "N/A"}</td>
                  <td>${web?.pageSpeed || "N/A"}</td>
                  <td><span style="font-weight:700;">${scorePct}</span></td>
                </tr>
                ${comps.map((c: any) => `
                  <tr>
                    <td>${c.name}</td>
                    <td>${c.rating} ★</td>
                    <td>${c.reviewsCount}</td>
                    <td>${c.seo}</td>
                    <td>${c.speed}</td>
                    <td>${c.footprintScore}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <!-- Section 7: Growth Blueprint -->
          <h2>7. Growth Recommendations & Action Plan</h2>
          <div class="card" style="padding: 10px 15px;">
            ${recs.map((r: any) => `
              <div style="margin-bottom: 12px; border-bottom: 1px solid #F1F5F9; padding-bottom: 10px; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: 700; font-size: 12px; color: #1E293B;">${r.title}</span>
                  <span class="priority-badge priority-${r.priority}">${r.priority}</span>
                </div>
                <p style="font-size: 11px; margin: 0 0 6px 0; color: #475569;">${r.description}</p>
                <div style="display: flex; gap: 15px; font-size: 10px; color: #64748B;">
                  <span><strong>Impact:</strong> ${r.estimatedImpact}</span>
                  <span><strong>Difficulty:</strong> ${r.difficulty}</span>
                  <span><strong>Est. Time:</strong> ${r.estimatedTime}</span>
                  <span><strong>Est. ROI:</strong> <span style="color: #166534; font-weight: 700;">${r.expectedROI}</span></span>
                </div>
              </div>
            `).join("")}
            ${recs.length === 0 ? `
              <div style="text-align: center; color: #64748B; font-size: 11px; padding: 10px;">
                No pending recommendations found. Digital presence is optimized.
              </div>
            ` : ""}
          </div>

          <!-- Disclaimer & Footer -->
          <div class="footer">
            <div>CONFIDENTIAL REPORT GENERATED BY AI FOR: ${lead.name.toUpperCase()} | AGENCY: ${agencyName.toUpperCase()}</div>
            <div style="margin-top: 4px; font-size: 9px; max-width: 650px; margin-left: auto; margin-right: auto; line-height: 1.3;">
              <strong>Disclaimer:</strong> This local footprint report is generated based on automated crawl metrics, OpenStreetMap directories, and Google Places listings. Third-party data indices can change; actual metrics may vary. Proposed services and SLA are subjects to direct agency contracts.
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 800);
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

/**
 * CSV Exporter for full CRM pipeline data
 */
export const exportCrmToCSV = (crmLeads: ScoredLead[], addLog: (text: string, type?: "success") => void) => {
  if (crmLeads.length === 0) return;

  const headers = [
    "Name",
    "Status",
    "Lead Score Category",
    "Audit Score",
    "Rating",
    "Website",
    "Phone",
    "Address",
    "PageSpeed Performance",
    "PageSpeed SEO",
    "Pain Points",
    "Proposed Pricing",
    "Email Outreach Draft",
    "WhatsApp Text"
  ];

  const rows = crmLeads.map((l) => [
    l.name,
    l.status,
    l.score,
    l.auditScore ? `${l.auditScore}/100` : "N/A",
    l.rating || "N/A",
    l.website || "N/A",
    l.phoneNumber || "N/A",
    l.address,
    l.auditData?.pageSpeed?.performance || "N/A",
    l.auditData?.pageSpeed?.seo || "N/A",
    l.auditData?.proposal?.painPoints?.join("; ") || "N/A",
    l.auditData?.proposal?.pricing || "N/A",
    l.auditData?.emailDraft || "N/A",
    l.auditData?.whatsAppDraft || "N/A"
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "purnova_digital_crm_leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  addLog("📥 Downloaded CRM database export as CSV file.", "success");
};

/**
 * Printable invoices generator
 */
export const printInvoice = (invoice: Invoice) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Purnova Invoice - ${invoice.invoiceNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Montserrat', sans-serif; color: #0A0A0A; line-height: 1.6; margin: 45px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #C9A84C; padding-bottom: 20px; margin-bottom: 40px; }
          .logo { font-family: 'Cinzel', serif; font-size: 26px; font-weight: bold; color: #C9A84C; letter-spacing: 3px; }
          .invoice-details { text-align: right; font-size: 12px; }
          h1, h2, h3 { font-family: 'Cinzel', serif; color: #0A0A0A; }
          .client-billing { margin: 30px 0; font-size: 14px; }
          .invoice-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .invoice-table th, .invoice-table td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; font-size: 13px; }
          .invoice-table th { background: #FAF9F6; font-family: 'Cinzel', serif; font-weight: bold; }
          .invoice-total { text-align: right; font-size: 16px; font-weight: bold; color: #8C7030; margin-top: 20px; }
          .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #E5E7EB; padding-top: 15px; }
          @media print { body { margin: 15px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">PURNOVA</div>
            <div style="font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 5px;">Digital Marketing Solutions</div>
          </div>
          <div class="invoice-details">
            <h2 style="margin: 0; font-size: 18px; color: #C9A84C;">INVOICE</h2>
            <p style="margin: 3px 0;"><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
            <p style="margin: 3px 0;"><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
            <p style="margin: 3px 0;"><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="client-billing">
          <p><strong>Billed To:</strong></p>
          <p style="font-size: 16px; font-weight: bold; margin: 5px 0 0 0;">${invoice.leadName}</p>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="width: 150px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoice.description}</td>
              <td style="text-align: right;">$${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-total">
          Total Amount Due: $${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>

        <div style="margin-top: 40px; font-size: 12px; color: #555;">
          <p><strong>Payment Instructions:</strong></p>
          <p>Please send payments via wire transfer or ACH according to your agreement SLA. Standard payment term is Net 15.</p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Purnova Digital Agency. All rights reserved. Confidential Invoice.
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
