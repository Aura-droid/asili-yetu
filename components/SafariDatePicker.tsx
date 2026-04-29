"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from "lucide-react";
import { useLocale } from "next-intl";

interface SafariDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder: string;
}

export default function SafariDatePicker({ value, onChange, placeholder }: SafariDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = Array.from({ length: 12 }, (_, i) => 
    new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, i, 1))
  );

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, i + 7))
  );

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Format as YYYY-MM-DD for consistency
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');
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

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of current month
    for (let day = 1; day <= totalDays; day++) {
      const past = isPast(day);
      const selected = isSelected(day);
      const today = isToday(day);

      days.push(
        <button
          key={day}
          disabled={past}
          onClick={() => handleDateSelect(day)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
            ${past ? 'text-foreground/10 cursor-not-allowed' : 'text-foreground hover:bg-primary hover:text-black'}
            ${selected ? 'bg-primary text-black' : ''}
            ${today && !selected ? 'border border-primary text-primary' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Input Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full cursor-pointer group"
      >
        <CalendarIcon className="text-primary w-6 h-6 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          {value ? (
            <span className="text-foreground font-semibold">{value}</span>
          ) : (
            <span className="text-foreground/60 font-semibold truncate block">{placeholder}</span>
          )}
        </div>
      </div>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-4 z-[200] w-[320px] bg-background border border-foreground/10 rounded-3xl shadow-2xl p-6 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-sm font-black uppercase tracking-widest text-foreground">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-[10px] font-black text-foreground/30 uppercase">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderDays()}
            </div>

            {/* Quick Footer */}
            <div className="mt-6 pt-4 border-t border-foreground/10 flex justify-between items-center">
              <button 
                onClick={() => {
                  setViewDate(new Date());
                }}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                Today
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-foreground/40 uppercase tracking-widest hover:text-foreground"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
