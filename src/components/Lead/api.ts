import API from "../../config/api";

type LogCallback = (text: string, type?: "info" | "success" | "warning" | "error" | "action") => void;

/**
 * Google Places API Search (via secure Backend Proxy)
 */
export const callGooglePlaces = async (
  searchIndustry: string,
  searchLocation: string,
  addLog: LogCallback
): Promise<{ source: string; geocodeFailed: boolean; leads: any[] }> => {
  addLog(`📞 Querying backend Overpass API for: "${searchIndustry}" in "${searchLocation}"`, "action");

  try {
    const response = await API.get("/search", {
      params: {
        city: searchLocation,
        category: searchIndustry
      }
    });
    
    const data = response.data;
    if (data && typeof data === "object" && "leads" in data) {
      addLog(`✨ Search complete. Found ${data.leads.length} listings.`, "info");
      return {
        source: data.source || "osm",
        geocodeFailed: !!data.geocodeFailed,
        leads: data.leads || []
      };
    } else {
      const leadsArray = Array.isArray(data) ? data : [];
      addLog(`✨ Search complete. Found ${leadsArray.length} listings.`, "info");
      return {
        source: "osm",
        geocodeFailed: false,
        leads: leadsArray
      };
    }
  } catch (err: any) {
    const errMsg = err.response?.data?.message || err.message || err;
    addLog(`❌ Failed Overpass search: ${errMsg}`, "error");
    throw new Error(errMsg);
  }
};

/**
 * Triggers Jina scrape, PageSpeed testing, LLM analysis, scoring, and saving on the backend.
 */
export const callBackendLeadAudit = async (
  lead: {
    id: string;
    name: string;
    rating: number | null;
    website: string | null;
    address: string;
    phoneNumber: string | null;
  },
  addLog: LogCallback
): Promise<any> => {
  addLog(`🚀 Requesting secure server-side AI audit pipeline for: "${lead.name}"`, "action");

  try {
    const response = await API.post("/leadgen/audit-lead", {
      id: lead.id,
      name: lead.name,
      rating: lead.rating,
      website: lead.website,
      address: lead.address,
      phoneNumber: lead.phoneNumber
    });
    addLog(`✅ Audit complete on backend for ${lead.name}`, "success");
    return response.data;
  } catch (err: any) {
    const errMsg = err.response?.data?.message || err.message || err;
    addLog(`❌ AI Audit failed via backend: ${errMsg}`, "error");
    throw new Error(errMsg);
  }
};

/**
 * Calls backend to generate customized cold email with Gemini
 */
export const callBackendEmailRegeneration = async (
  payload: {
    name: string;
    website: string | null;
    rating: number | null;
    performance?: number;
    seo?: number;
    customPrompt?: string;
  },
  addLog: LogCallback
): Promise<string> => {
  addLog(`🤖 Requesting AI email generation for: "${payload.name}"`, "action");
  try {
    const response = await API.post("/leadgen/generate-email", payload);
    addLog(`✅ AI Email generation complete`, "success");
    return response.data.emailDraft;
  } catch (err: any) {
    const errMsg = err.response?.data?.message || err.message || err;
    addLog(`❌ AI Email generation failed: ${errMsg}`, "error");
    throw new Error(errMsg);
  }
};

/**
 * Calls backend to verify email validity
 */
export const callBackendEmailVerification = async (
  email: string,
  addLog: LogCallback
): Promise<{ isValid: boolean; status: string; bounceRisk: string; details?: string }> => {
  addLog(`✉️ Triggering email verification for: "${email}"`, "action");
  try {
    const response = await API.post("/leadgen/verify-email", { email });
    addLog(`✅ Email check result: ${response.data.status} (Bounce Risk: ${response.data.bounceRisk})`, response.data.isValid ? "success" : "warning");
    return response.data;
  } catch (err: any) {
    const errMsg = err.response?.data?.message || err.message || err;
    addLog(`❌ Email verification failed: ${errMsg}`, "error");
    throw new Error(errMsg);
  }
};
