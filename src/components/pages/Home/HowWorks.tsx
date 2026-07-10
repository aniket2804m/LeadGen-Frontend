import {
  Search,
  Star,
  MonitorSmartphone,
  Send,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Scrape Google Maps",
    description:
      "Pick a niche and city. LeadEmpire pulls every local business name, phone, rating, website and address in seconds.",
    icon: Search,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    number: "02",
    title: "AI Scores Each Lead",
    description:
      "Scout AI visits every website, grades it from 1–10 on how urgently they need help and labels it Hot / Warm / Cool.",
    icon: Star,
    bg: "bg-sky-100",
    color: "text-sky-600",
  },
  {
    number: "03",
    title: "Build Demo Sites",
    description:
      "One click generates a full, custom demo website for any lead. A tangible proof-of-value before you even send an email.",
    icon: MonitorSmartphone,
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    number: "04",
    title: "Send & Close",
    description:
      "Automated personalized emails go out with the demo link attached. Track opens, replies and convert leads into paying clients.",
    icon: Send,
    bg: "bg-green-100",
    color: "text-green-600",
  },
];

const HowWorks = () => {
  return (
    <section className="bg-[#faf9fc] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Heading */}
        <span className="text-xs font-bold uppercase tracking-[3px] text-violet-600">
          How LeadEmpire Works
        </span>

        <h2 className="mt-4 text-4xl md:text-5xl font-bold text-slate-900 leading-tight max-w-3xl">
          From zero to booked client
          <br />
          in 4 steps.
        </h2>

        <p className="mt-6 text-gray-500 max-w-2xl text-base md:text-lg leading-8">
          No manual prospecting. No cold-calling lists. No agency middleman.
          Just your target niche, a city, and our AI.
        </p>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border border-gray-200 rounded-2xl overflow-hidden bg-white">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="border-b sm:border-r border-gray-200 xl:border-b-0 last:border-r-0 p-8 hover:bg-gray-50 transition"
              >
                <p className="text-xs font-bold text-violet-600">
                  {step.number}
                </p>

                <div
                  className={`mt-5 w-12 h-12 rounded-xl flex items-center justify-center ${step.bg}`}
                >
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>

                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-4 text-gray-500 leading-7 text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowWorks;