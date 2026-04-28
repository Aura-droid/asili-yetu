"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, CheckCircle2, ChevronRight, ChevronLeft, Flag, Utensils, Camera, Tent, Users } from "lucide-react";
import RustlingButton from "./RustlingButton";
import { useTheme } from "./ThemeProvider";
import { useTranslations, useLocale } from "next-intl";
import { submitBookingInquiry } from "@/app/actions";
import { useLoading } from "@/providers/LoadingProvider";

interface BookingFunnelProps {
  itinerary: any;
  onClose: () => void;
  initialGuests?: string;
  initialDates?: string;
  packagePrice?: number;
  packageDiscount?: number;
  peopleCountText?: string;
  maxPeople?: number;
}

export default function BookingFunnel({ itinerary, onClose, initialGuests, initialDates, packagePrice, packageDiscount, peopleCountText, maxPeople }: BookingFunnelProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const t = useTranslations("Booking");
  const locale = useLocale();
  const { setIsLoading: setGlobalLoading } = useLoading();

  const nextStep = (s: number) => {
    setStep(s);
    // Scroll form container to top on mobile for better visibility
    const formContainer = document.getElementById("funnel-form-container");
    if (formContainer) formContainer.scrollTop = 0;
  };

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: initialGuests || "",
    dates: initialDates || "",
    dietary: "",
    addons: [] as string[],
  });

  const handleAddonToggle = (addon: string) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter((a) => a !== addon)
        : [...prev.addons, addon],
    }));
  };

  const submitBooking = async () => {
    setLoading(true);
    setGlobalLoading(true);
    try {
      const res = await submitBookingInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        guests: formData.guests,
        dates: formData.dates,
        dietary: formData.dietary,
        addons: formData.addons,
        itinerary: itinerary,
        locale: locale
      });
      if (!res.error) {
        setStep(4); // Success step
      } else {
        alert("Failed to send inquiry: " + res.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  const variants: Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    active: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, type: "spring", stiffness: 100 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-6"
    >
      <div className="w-full max-w-4xl h-full sm:h-[85vh] sm:max-h-[750px] bg-background sm:border sm:border-foreground/10 sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Summary Panel */}
        <div className="w-full md:w-1/3 bg-foreground/5 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-foreground/10 shrink-0">
          <div>
            <div className="flex items-center justify-between md:block mb-4 md:mb-0">
               <h3 className="text-xs md:text-sm uppercase tracking-widest font-bold text-primary mb-2">{t("booking")}</h3>
               <div className="md:hidden flex items-center gap-2">
                  <div className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Step {step}/3</div>
               </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-4">
              {itinerary?.recommendedTitle || "Custom Safari"}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground/80">
                <Tent className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">{t("luxury_camps")}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <Flag className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">{t("private_guide")}</span>
              </div>

              {peopleCountText && (
                <div className="flex items-center gap-3 text-foreground/80">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">{peopleCountText}</span>
                </div>
              )}

              {packagePrice && (
                <div className="pt-6 border-t border-foreground/10 space-y-4">
                   <div>
                      <p className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1">Price Per Person</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-black text-foreground">$ {(packageDiscount || packagePrice).toLocaleString()}</span>
                         {packageDiscount && <span className="text-xs line-through text-foreground/30 font-bold">${packagePrice.toLocaleString()}</span>}
                      </div>
                   </div>
                   
                   {formData.guests && parseInt(formData.guests) > 0 && (
                     <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">Total Investment</p>
                        <div className="flex items-baseline gap-1">
                           <span className="text-xl font-black text-primary">$ {((packageDiscount || packagePrice) * parseInt(formData.guests)).toLocaleString()}</span>
                           <span className="text-[10px] font-bold text-primary/60 uppercase">USD Total</span>
                        </div>
                        <p className="text-[8px] font-bold text-primary/40 uppercase mt-1 italic">Based on {formData.guests} explorers</p>
                     </div>
                   )}
                </div>
              )}

              <div className="pt-4 border-t border-foreground/10">
                 <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] animate-pulse italic">
                    ★ Negotiable & Tailor-made
                 </p>
                 <p className="text-[10px] text-foreground/40 font-medium leading-relaxed mt-2">
                    {t("negotiable_note")}
                 </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden mt-8">
              <motion.div 
                className="h-full bg-primary" 
                initial={{ width: "25%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-foreground/50 font-bold uppercase mt-3 tracking-widest text-center">
              {t("step")} {step} {t("of")} 3
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div id="funnel-form-container" className="w-full md:w-2/3 p-6 md:p-12 relative flex flex-col justify-start md:justify-center overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors z-50 text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait" custom={1}>
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                className="w-full max-w-md mx-auto space-y-6"
              >
                <h3 className="text-3xl font-bold text-foreground">{t("traveler_info")}</h3>
                <p className="text-foreground/60 text-sm">{t("who_joining")}</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">{t("full_name")}</label>
                    <input
                      type="text"
                      className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-xl px-5 py-4 text-foreground font-semibold placeholder:text-foreground/30"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">{t("email_address")}</label>
                    <input
                      type="email"
                      className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-xl px-5 py-4 text-foreground font-semibold placeholder:text-foreground/30"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">{t("whatsapp_phone")}</label>
                    <input
                      type="tel"
                      className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-xl px-5 py-4 text-foreground font-semibold placeholder:text-foreground/30"
                      placeholder={t("phone_placeholder")}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">Number of People</label>
                    <input
                      type="number"
                      min="1"
                      max={maxPeople || 20}
                      className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-xl px-5 py-4 text-foreground font-semibold placeholder:text-foreground/30"
                      placeholder="2"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    />
                    {maxPeople && (
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-2 italic">
                        Limit: {maxPeople} people for this expedition
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => nextStep(2)}
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.guests}
                  className="mt-8 w-full bg-foreground text-background font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                >
                  {t("continue")} <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Extras & Vibe */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                className="w-full max-w-md mx-auto space-y-6"
              >
                <button onClick={() => nextStep(1)} className="text-xs font-bold uppercase tracking-widest flex items-center text-foreground/50 hover:text-foreground mb-4">
                  <ChevronLeft className="w-4 h-4 mr-1" /> {t("back")}
                </button>
                <h3 className="text-3xl font-bold text-foreground">{t("enhance")}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "balloon", icon: <Tent />, label: t("hot_air_balloon") },
                    { id: "photo", icon: <Camera />, label: t("pro_photo") },
                  ].map((addon) => {
                    const isSelected = formData.addons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleAddonToggle(addon.id)}
                        className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all ${isSelected ? "border-primary bg-primary/10 shadow-md transform scale-105" : "border-foreground/10 bg-background hover:bg-foreground/5"}`}
                      >
                        <div className={`mb-2 ${isSelected ? "text-primary" : "text-foreground/50"}`}>{addon.icon}</div>
                        <span className={`text-sm font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>{addon.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50 mb-2">
                    <Utensils className="w-4 h-4" /> {t("dietary")}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-xl px-5 py-4 text-foreground font-semibold placeholder:text-foreground/30"
                    placeholder={t("dietary_placeholder")}
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  />
                </div>

                <button
                  onClick={() => nextStep(3)}
                  className="mt-8 w-full bg-foreground text-background font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                >
                  {t("final_review")} <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                className="w-full max-w-md mx-auto space-y-6"
              >
                <button onClick={() => nextStep(2)} className="text-xs font-bold uppercase tracking-widest flex items-center text-foreground/50 hover:text-foreground mb-4">
                  <ChevronLeft className="w-4 h-4 mr-1" /> {t("back")}
                </button>
                <h3 className="text-3xl font-bold text-foreground">{t("confirm_voyage")}</h3>

                <div className="bg-foreground/5 rounded-2xl p-6 space-y-4 shadow-inner">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-foreground/50 tracking-wider">{t("lead_explorer")}</span>
                    <span className="font-bold text-foreground text-lg">{formData.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-foreground/50 tracking-wider">{t("contact")}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{formData.email}</span>
                      <span className="font-medium text-foreground/70 text-sm italic">{formData.phone}</span>
                    </div>
                  </div>
                  {formData.addons.length > 0 && (
                     <div>
                       <span className="block text-[10px] uppercase font-bold text-foreground/50 tracking-wider">{t("addons")}</span>
                       <span className="font-medium text-primary">{formData.addons.map(a => t(a === "balloon" ? "hot_air_balloon" : "pro_photo")).join(", ")}</span>
                     </div>
                  )}
                </div>

                <RustlingButton
                  onClick={submitBooking}
                  disabled={loading}
                  className="mt-8 w-full bg-primary hover:bg-primary/90 text-[#0f172a] font-black py-5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center"
                >
                  {loading ? t("finalizing") : t("initialize")}
                </RustlingButton>
              </motion.div>
            )}

            {/* Step 4: Success State */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={1}
                variants={variants}
                initial="initial"
                animate="active"
                exit="exit"
                className="w-full h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                   className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2 shadow-2xl"
                >
                   <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <h3 className="text-4xl font-extrabold text-foreground">{t("welcome")}</h3>
                <p className="text-foreground/70 max-w-xs mx-auto">
                   {t("confirmed")} Our guide will reach out to {formData.email} shortly.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-10 py-4 bg-foreground/10 hover:bg-foreground/20 text-foreground font-bold rounded-full transition-all"
                >
                  {t("return")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
