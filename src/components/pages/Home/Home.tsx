import {
  ArrowRight,
  PlayCircle,
  Circle,
  Globe,
  Send,
  FileText,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const leads = [
  {
    name: "MyFitMantra Gym",
    category: "Gym • Pune, IN",
    score: "9.0 / 10 - No website",
    width: "90%",
    color: "bg-pink-500",
    tag: "Hot Lead",
    tagColor: "text-red-500",
    button: "Build Demo",
  },
  {
    name: "Green Dental Clinic",
    category: "Dentist • Mumbai, IN",
    score: "7.8 / 10 - Outdated site",
    width: "75%",
    color: "bg-orange-400",
    tag: "Warm Lead",
    tagColor: "text-orange-500",
    button: "View Report",
  },
  {
    name: "Sunrise Auto Repair",
    category: "Auto • Delhi, IN",
    score: "4.5 / 10 - Decent site",
    width: "45%",
    color: "bg-sky-400",
    tag: "Cool Lead",
    tagColor: "text-sky-500",
    button: "Analyze",
  },
];

const Home = () => {

  const navigate = useNavigate();

const handleHowWork = () => {
  navigate("/");

  setTimeout(() => {
    document
      .getElementById("howwork")
      ?.scrollIntoView({ behavior: "smooth" });
  }, 100);
};
  return (
    <section className="min-h-screen bg-[#faf9fc] flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 border border-violet-200">
              <Circle className="w-2 h-2 fill-violet-600 text-violet-600" />
              <span className="text-sm font-medium text-violet-700">
                AI-Powered Lead Generation
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-8 text-5xl md:text-6xl xl:text-7xl font-bold leading-tight text-slate-900">
              Find local
              <br />
              <span className="text-violet-700">businesses</span>
              <br />
              that need
              <span className="text-violet-700"> your</span>
              <br />
              <span className="text-violet-700">help.</span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-gray-500 text-lg leading-8 max-w-lg">
              LeadEmpire scrapes Google Maps, scores every lead with AI,
              builds demo websites automatically, then sends cold emails on
              your behalf. You just close deals.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button className="bg-violet-700 hover:bg-violet-800 transition text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg">
                Start for free
                <ArrowRight size={18} />
              </button>

              <button  onClick={() =>
    document
      .getElementById("howwork")
      ?.scrollIntoView({ behavior: "smooth" })
  } className="bg-black border border-gray-200 hover:border-violet-300 px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm">
                <PlayCircle size={18} />
                See how it works
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-14">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">40+</h2>
                <p className="uppercase tracking-wider text-xs text-gray-400 mt-2">
                  Leads in Minutes
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900">9/10</h2>
                <p className="uppercase tracking-wider text-xs text-gray-400 mt-2">
                  AI Accuracy Score
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900">3×</h2>
                <p className="uppercase tracking-wider text-xs text-gray-400 mt-2">
                  Faster Outreach
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
              {/* Browser */}
              <div className="border-b bg-gray-50 px-5 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>

                <div className="ml-5 flex-1 h-8 rounded-md border bg-white text-center text-xs text-gray-400 flex items-center justify-center">
                  LeadEmpire • My Leads
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <h3 className="font-bold text-lg">
                    Live Lead Scanner
                  </h3>

                  <span className="text-green-500 text-sm font-semibold">
                    ● SCANNING
                  </span>
                </div>

                <div className="space-y-5">
                  {leads.map((lead, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border p-5 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {lead.name}
                          </h4>

                          <p className="text-gray-500 text-sm">
                            {lead.category}
                          </p>
                        </div>

                        <span
                          className={`text-xs font-semibold ${lead.tagColor}`}
                        >
                          {lead.tag}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-gray-200 mt-5 overflow-hidden">
                        <div
                          className={`h-full ${lead.color}`}
                          style={{ width: lead.width }}
                        />
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-500">
                          {lead.score}
                        </p>

                        <button className="px-4 py-2 rounded-lg bg-violet-100 text-violet-700 text-sm font-medium hover:bg-violet-200">
                          {lead.button}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-6">
                  <button className="rounded-xl bg-orange-100 text-orange-700 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <Globe size={16} />
                    Build Demos
                  </button>

                  <button className="rounded-xl bg-sky-100 text-sky-700 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <Send size={16} />
                    Send Outreach
                  </button>

                  <button className="rounded-xl bg-green-100 text-green-700 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                    <FileText size={16} />
                    AI Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;