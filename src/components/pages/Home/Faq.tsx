import React, { useState } from "react";
// import { faqData } from "../../data/faqData";

const faqData = [
  {
    question: "What is Purnova Lead?",
    answer:
      "Purnova Lead is an AI-powered lead generation platform that helps agencies and freelancers discover local businesses, analyze their websites, qualify leads, and manage their entire sales pipeline from one dashboard.",
  },
  {
    question: "How does AI prospecting work?",
    answer:
      "Our AI researches every business by analyzing its website, online presence, reviews, and digital performance. It identifies missing opportunities and provides personalized insights to help you close more clients.",
  },
  {
    question: "What type of businesses can I find?",
    answer:
      "You can search for any local business by city, niche, or industry, including dentists, restaurants, roofers, plumbers, salons, gyms, real estate agencies, and many more.",
  },
  {
    question: "Does Purnova Lead provide verified contact details?",
    answer:
      "Yes. Purnova Lead provides verified business information, including business names, websites, email addresses (where available), phone numbers, and Google Business Profile details.",
  },
  {
    question: "Can I export my leads?",
    answer:
      "Absolutely. You can export your qualified leads in CSV format or integrate them directly with your favorite CRM and outreach tools.",
  },
  {
    question: "How does AI lead scoring work?",
    answer:
      "Every lead receives an AI score based on website quality, online presence, customer reviews, SEO performance, and business growth potential, helping you prioritize high-value prospects.",
  },
  {
    question: "Can I manage my sales pipeline inside Purnova Lead?",
    answer:
      "Yes. Purnova Lead includes a built-in pipeline where you can organize leads, track conversations, add notes, assign statuses, and monitor your sales progress without using another CRM.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes. Every new account starts with a free trial so you can explore the platform, discover leads, and experience AI-powered prospecting before choosing a paid plan.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null as any : index);
  };

  return (
    <section className="relative overflow-hidden py-10 bg-[#0A0A0A] text-[#F5F0E8] border-t border-[#C9A84C]/10 font-montserrat">
      {/* Dotted pattern background overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(#C9A84C_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10" />
      
      {/* Ambient luxury glows */}
      <div className="absolute -top-40 -left-40 h-[450px] w-[450px] rounded-none bg-[#C9A84C]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-none bg-[#C9A84C]/1 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header Badge */}
        <div className="text-center mb-4">
          <span className="inline-flex rounded-none border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#C9A84C] font-montserrat">
            COMMON QUESTIONS
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold uppercase leading-tight text-[#F5F0E8] md:text-5xl font-cinzel tracking-wider text-center mb-16">
          Frequently Asked{" "}
          <span className="text-[#C9A84C]">
            Questions
          </span>
        </h2>

        {/* Accordion Wrapper */}
        <div className="space-y-4 font-montserrat">
          {faqData.map((item, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className={`group rounded-none cursor-pointer transition-all duration-500 overflow-hidden backdrop-blur-lg ${
                activeIndex === index
                  ? "bg-[#101010]/80 border border-[#C9A84C] shadow-[0_10px_30px_rgba(201,168,76,0.1)]"
                  : "bg-[#101010]/40 border border-[#C9A84C]/10 hover:bg-[#101010]/60 hover:border-[#C9A84C]/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
              }`}
            >
              {/* Question Header */}
              <div className="flex justify-between items-center p-6 gap-4">
                <h4 className="font-semibold text-base md:text-lg text-[#F5F0E8] font-cinzel tracking-wide group-hover:text-[#C9A84C] transition-colors duration-300">
                  {item.question}
                </h4>

                <span className={`text-xl text-[#C9A84C] font-bold w-8 h-8 rounded-none border border-[#C9A84C]/25 bg-[#C9A84C]/10 flex items-center justify-center transition-all duration-300 ${activeIndex === index ? "rotate-180 border-[#C9A84C]/45 bg-[#C9A84C]/25" : ""}`}>
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>

              {/* Answer Box */}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  activeIndex === index
                    ? "max-h-[300px] opacity-100 px-6 pb-6 pt-1"
                    : "max-h-0 opacity-0 pointer-events-none"
                } overflow-hidden`}
              >
                <p className="text-[#F5F0E8]/70 text-sm md:text-base leading-relaxed font-light">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default React.memo(FAQ);