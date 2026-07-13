import {
  Sparkles,
  MapPin,
  Globe,
  BadgeCheck,
  Users,
  BarChart3,
  Zap,
  FolderKanban,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI prospecting",
    description:
      "Replace hours of manual research with AI sales prospecting that reads, understands, and summarizes every business for you.",
  },
  {
    icon: MapPin,
    title: "Google Maps business search",
    description:
      "Turn any niche and city into a fresh prospect list. Every lead is a real business with real contact details, generated on demand.",
  },
  {
    icon: Globe,
    title: "Website analysis",
    description:
      "Automatic local business website analysis reveals outdated design, slow pages, and missing features you can fix for them.",
  },
  {
    icon: BadgeCheck,
    title: "AI lead qualification",
    description:
      "Every prospect receives a lead score and a written summary of why they are worth your time, so priorities set themselves.",
  },
  {
    icon: Users,
    title: "AI lead management",
    description:
      "Statuses, notes, tags, and follow-up reminders keep every conversation organized without a separate CRM subscription.",
  },
  {
    icon: BarChart3,
    title: "Business insights",
    description:
      "See ratings, review counts, and market gaps at a glance, and spot which neighborhoods and niches are underserved.",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "Searches, audits, and scoring run automatically in the background. You open the dashboard to results, not work.",
  },
  {
    icon: FolderKanban,
    title: "Pipeline management",
    description:
      "Drag leads from discovered to contacted to closed. Your whole client acquisition process, visible on one screen.",
  },
];

export default function Feature() {
  return (
    <section className="bg-[#f8f6ff] py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[4px] text-violet-500 font-semibold">
            EVERYTHING YOU NEED
          </p>

          <h2 className="mt-3 text-5xl font-bold text-gray-900 leading-tight">
            AI prospecting tools that
            <br />
            do the research for you
          </h2>

          <p className="mt-5 text-gray-500 text-lg leading-8">
            Most AI prospecting tools stop at contact data. LeadEmpire keeps
            going: it studies each business, finds what they are missing, and
            hands you the pitch.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-violet-600" />
                </div>

                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-gray-500 text-sm leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}