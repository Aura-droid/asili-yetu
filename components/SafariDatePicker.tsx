"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";

interface SafariDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder: string;
}

export default function SafariDatePicker({ value, onChange, placeholder }: SafariDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 320 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCalendar = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const calW = 320;
      let left = rect.left;
      if (left + calW > window.innerWidth - 8) left = window.innerWidth - calW - 8;
      if (left < 8) left = 8;
      // If opening would go below viewport, open upward
      const spaceBelow = window.innerHeight - rect.bottom - 8;
      const calH = 370; // approx height
      const top = spaceBelow < calH ? rect.top - calH - 8 : rect.bottom + 8;
      setDropdownPos({ top, left, width: calW });
    }
    setIsOpen((prev) => !prev);
  };

  // Close on click outside portal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const portal = document.getElementById("safari-calendar-portal");
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !(portal && portal.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2024, i, 1))
  );
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2024, 0, i + 7))
  );

  const handlePrevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const handleDateSelect = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getFullYear() === viewDate.getFullYear() &&
      d.getMonth() === viewDate.getMonth() &&
      d.getDate() === day;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === viewDate.getFullYear() &&
      today.getMonth() === viewDate.getMonth() &&
      today.getDate() === day;
  };

  const isPast = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  const renderDays = () => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`e-${i}`} className="h-9 w-9" />);
    }
    for (let day = 1; day <= totalDays; day++) {
      const past = isPast(day);
      const selected = isSelected(day);
      const today = isToday(day);
      days.push(
        <button
          key={day}
          disabled={past}
          onClick={() => handleDateSelect(day)}
          className={[
            "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all",
            past ? "text-foreground/15 cursor-not-allowed" : "text-foreground hover:bg-primary hover:text-black",
            selected ? "bg-primary !text-black shadow-lg" : "",
            today && !selected ? "border border-primary text-primary" : "",
          ].join(" ")}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const portalContent = (
    <div
      id="safari-calendar-portal"
      style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 99999 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="bg-background border border-foreground/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
                <ChevronLeft className="w-5 h-5 text-foreground/60" />
              </button>
              <span className="text-sm font-black uppercase tracking-widest text-foreground">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-foreground/5 transition-colors">
                <ChevronRight className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 mb-1">
              {weekDays.map((d) => (
                <div key={d} className="h-8 flex items-center justify-center text-[9px] font-black text-foreground/30 uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-y-1">
              {renderDays()}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-foreground/10 flex justify-between">
              <button onClick={() => setViewDate(new Date())} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                Today
              </button>
              <button onClick={() => setIsOpen(false)} className="text-[10px] font-black text-foreground/40 uppercase tracking-widest hover:text-foreground">
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="relative w-full" ref={triggerRef}>
      <div onClick={openCalendar} className="flex items-center justify-start gap-3 w-full cursor-pointer text-left">
        <CalendarIcon className="text-primary w-6 h-6 flex-shrink-0" />
        <div className="flex-1 overflow-hidden text-left">
          {value ? (
            <span className="block text-left text-foreground font-semibold">{value}</span>
          ) : (
            <span className="block truncate text-left text-foreground/60 font-semibold">{placeholder}</span>
          )}
        </div>
      </div>
      {mounted && createPortal(portalContent, document.body)}
    </div>
  );
}
