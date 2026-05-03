"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is the best time to visit Tanzania for a safari?",
    answer: "The best time for a safari in Tanzania is during the dry season from late June to October. This period offers the best wildlife viewing as animals gather around water sources, and the Great Migration is typically in the Serengeti. However, the 'Green Season' (November to May) offers lush landscapes and is excellent for birdwatching and calving season."
  },
  {
    question: "What should I pack for my Tanzanian safari?",
    answer: "We recommend neutral-colored, lightweight clothing (khaki, beige, green) to blend in. Essential items include a wide-brimmed hat, high-SPF sunscreen, insect repellent, comfortable walking shoes, a warm jacket for cool mornings/evenings, and quality binoculars. Don't forget your camera with extra memory cards!"
  },
  {
    question: "Do I need a visa and vaccinations to visit Tanzania?",
    answer: "Most nationalities require a visa to enter Tanzania, which can be obtained online (e-visa) or upon arrival. Regarding health, we recommend consulting your doctor about yellow fever, malaria prophylaxis, and other routine vaccinations like Hepatitis A/B and Typhoid before travel."
  },
  {
    question: "What kind of accommodation can I expect on an Asili Yetu safari?",
    answer: "We offer a range of premium accommodations tailored to your preference: from luxury boutique lodges with full amenities to authentic luxury tented camps that bring you closer to nature without sacrificing comfort. Each choice is hand-picked for its location, service quality, and sustainability."
  },
  {
    question: "Is it safe to travel on safari in Tanzania?",
    answer: "Tanzania is one of Africa's most stable and safe destinations. On safari, your safety is our primary concern. Our professional guides are highly trained in wildlife behavior and safety protocols. We use well-maintained 4x4 vehicles and only partner with reputable lodges and camps."
  }
];

export default function StrategicFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Schema.org FAQPage data for AEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-24 px-6 md:px-12 bg-white overflow-hidden" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Strategic Intelligence
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-6 uppercase italic">
            Expedition <span className="text-primary italic">Intelligence</span>
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto font-medium">
            Essential knowledge for the modern explorer. We've distilled the most frequent inquiries into actionable strategic insights.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={false}
              className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
                openIndex === index 
                  ? "bg-foreground/5 border-primary/20 shadow-xl shadow-primary/5" 
                  : "bg-white border-foreground/10 hover:border-primary/30"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                    openIndex === index ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : "bg-foreground/5 text-foreground/40"
                  }`}>
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <span className={`text-lg md:text-xl font-black tracking-tight transition-colors duration-500 ${
                    openIndex === index ? "text-foreground" : "text-foreground/70"
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-500 ${
                  openIndex === index ? "rotate-180" : ""
                }`} />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  >
                    <div className="px-6 md:px-8 pb-8 pt-2">
                      <div className="p-6 md:p-8 bg-white rounded-2xl border border-primary/10 shadow-inner">
                        <div className="flex gap-4">
                          <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-1" />
                          <p className="text-foreground/70 leading-relaxed text-base md:text-lg font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-foreground text-white rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-black/20">
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black tracking-tight mb-2">Still have strategic questions?</h4>
            <p className="text-white/60 font-medium">Our concierge team is standing by for real-time intelligence dispatch.</p>
          </div>
          <a 
            href="#contact"
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            Dispatch Inquiry
          </a>
        </div>
      </div>
    </section>
  );
}
