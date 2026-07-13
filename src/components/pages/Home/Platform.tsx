import {
  Search,
  Users,
  KanbanSquare,
  FileBarChart2,
} from "lucide-react";

const stats = [
  {
    title: "Leads found",
    value: "486",
    sub: "+12% this week",
  },
  {
    title: "AI qualified",
    value: "132",
    sub: "+9%",
  },
  {
    title: "Avg lead score",
    value: "7.9",
    extra: "/10",
    sub: "Stable",
  },
  {
    title: "Deals closed",
    value: "7",
    sub: "+2",
  },
];

const leads = [
  {
    business: "Summit Roofing Co.",
    gap: "No mobile site",
    score: "9.4",
    color: "text-green-600",
  },
  {
    business: "Bloom Dental Studio",
    gap: "No booking form",
    score: "9.1",
    color: "text-green-600",
  },
  {
    business: "Verde Landscaping",
    gap: "Outdated design",
    score: "8.2",
    color: "text-yellow-500",
  },
  {
    business: "Harbor Auto Repair",
    gap: "Slow load speed",
    score: "7.8",
    color: "text-orange-500",
  },
];

const bars = [45, 62, 54, 78, 70, 88, 86];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Platform() {
  return (
    <section className="bg-[#faf8ff] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-[11px] md:text-xs uppercase tracking-[4px] text-violet-600 font-semibold">
            THE PLATFORM
          </p>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
            One lead generation platform
            <br className="hidden sm:block" />
            for your entire client pipeline
          </h2>

          <p className="mt-5 text-gray-500 text-sm sm:text-base lg:text-lg leading-7">
            Stop stitching together spreadsheets, scrapers, and CRMs.
            LeadEmpire is a complete lead generation system: discovery,
            analysis, qualification, and follow-up in a single dashboard.
          </p>
        </div>

        {/* Dashboard */}
        <div className="mt-14 lg:mt-20 overflow-x-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl min-w-[900px] lg:min-w-full">

            {/* Browser */}
            <div className="h-10 bg-gray-50 border-b flex items-center px-5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="w-3 h-3 rounded-full bg-gray-300" />
              </div>

              <div className="ml-5 bg-white border rounded-full px-4 py-1 text-xs text-gray-400">
                app.purnovalead.io/dashboard
              </div>
            </div>

            {/* Main */}
            <div className="flex flex-col lg:flex-row">

              {/* Sidebar */}
              <aside className="lg:w-44 border-b lg:border-b-0 lg:border-r bg-gray-50">

                {/* Mobile Menu */}
                <div className="flex lg:block overflow-x-auto p-4 gap-3 whitespace-nowrap">

                  <div className="bg-violet-100 text-violet-700 px-3 py-2 rounded-lg text-sm font-semibold">
                    Dashboard
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Search size={16} />
                    Searches
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} />
                    Leads
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <KanbanSquare size={16} />
                    Pipeline
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileBarChart2 size={16} />
                    Reports
                  </div>

                </div>

              </aside>

              {/* Content */}
              <div className="flex-1 p-4 md:p-6">

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                  {stats.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-xl p-4"
                    >
                      <p className="text-xs text-gray-400">
                        {item.title}
                      </p>

                      <h3 className="text-3xl font-bold mt-2">
                        {item.value}
                        <span className="text-base text-gray-400">
                          {item.extra}
                        </span>
                      </h3>

                      <p className="text-green-500 text-xs mt-2">
                        {item.sub}
                      </p>
                    </div>
                  ))}

                </div>

                {/* Bottom */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

                  {/* Chart */}
                  <div className="border rounded-xl p-5">

                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        Leads discovered
                      </h3>

                      <span className="bg-violet-100 text-violet-600 text-xs px-3 py-1 rounded-full">
                        Last 7 days
                      </span>
                    </div>

                    <div className="flex items-end justify-between h-56 mt-8">

                      {bars.map((height, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div
                            className="w-6 sm:w-8 rounded-md bg-gradient-to-t from-violet-600 to-violet-400"
                            style={{
                              height: `${height}%`,
                            }}
                          />

                          <span className="text-[10px] sm:text-xs text-gray-400">
                            {days[i]}
                          </span>
                        </div>
                      ))}

                    </div>

                  </div>

                  {/* Table */}
                  <div className="border rounded-xl p-5 overflow-x-auto">

                    <div className="flex justify-between items-center mb-5">
                      <h3 className="font-semibold">
                        Top qualified leads
                      </h3>

                      <span className="bg-violet-100 text-violet-600 text-xs px-3 py-1 rounded-full">
                        AI scored
                      </span>
                    </div>

                    <div className="min-w-[420px]">

                      <div className="grid grid-cols-3 text-xs text-gray-400 border-b pb-3">
                        <span>BUSINESS</span>
                        <span>GAP FOUND</span>
                        <span className="text-right">
                          SCORE
                        </span>
                      </div>

                      {leads.map((lead, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 py-4 border-b last:border-none text-sm"
                        >
                          <span className="font-medium">
                            {lead.business}
                          </span>

                          <span className="text-gray-500">
                            {lead.gap}
                          </span>

                          <span
                            className={`text-right font-semibold ${lead.color}`}
                          >
                            {lead.score}
                          </span>
                        </div>
                      ))}

                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}