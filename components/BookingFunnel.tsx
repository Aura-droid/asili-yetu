"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, CheckCircle2, ChevronRight, ChevronLeft, Flag, Utensils, Camera, Tent } from "lucide-react";
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
}

export default function BookingFunnel({ itinerary, onClose, initialGuests, initialDates }: BookingFunnelProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const t = useTranslations("Booking");
  const locale = useLocale();
  const { setIsLoading: setGlobalLoading } = useLoading();

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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
    >
      <div className="w-full max-w-4xl h-[85vh] sm:h-[600px] bg-background border border-foreground/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Summary Panel */}
        <div className="w-full md:w-1/3 bg-foreground/5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-foreground/10">
          <div>
            <h3 className="text-sm uppercase tracking-widest font-bold text-primary mb-2">{t("booking")}</h3>
            <h2 className="text-3xl font-extrabold text-foreground leading-tight mb-4">
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
        <div className="w-full md:w-2/3 p-8 md:p-12 relative flex flex-col justify-center overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors z-50 text-foreground"
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
                      type="text"
                      className="w-full bg-foreground/5 border-none outline-none focus:ring-2 focus:ring-primary rounded-xl px-5 py-4 text-foreground font-semibold placeholder:text-foreground/30"
                      placeholder={t("phone_placeholder")}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.email || !formData.phone}
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
                <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest flex items-center text-foreground/50 hover:text-foreground mb-4">
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
                  onClick={() => setStep(3)}
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
                <button onClick={() => setStep(2)} className="text-xs font-bold uppercase tracking-widest flex items-center text-foreground/50 hover:text-foreground mb-4">
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
