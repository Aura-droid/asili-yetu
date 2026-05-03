"use client";

import { useState } from "react";
import BookingFunnel from "./BookingFunnel";

export default function BookingFunnelWrapper({ 
  packageId, 
  packageTitle, 
  buttonClassName 
}: { 
  packageId: string; 
  packageTitle: string;
  buttonClassName?: string;
}) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowBooking(true)}
        className={buttonClassName || "bg-primary text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform"}
      >
        Book This Expedition
      </button>

      {showBooking && (
        <BookingFunnel 
          itinerary={{ package_id: packageId, title: packageTitle }} 
          onClose={() => setShowBooking(false)} 
        />
      )}
    </>
  );
}
