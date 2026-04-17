"use client";

import dynamic from "next/dynamic";
import { RefreshCw } from "lucide-react";

const LazySentinelMap = dynamic(() => import("@/components/AdminSentinelMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-black/5 rounded-[3rem] animate-pulse flex flex-col items-center justify-center border border-white/5 bg-[#0a0a0a]">
       <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Calibrating Satellite Radar...</p>
    </div>
  )
});

export default function DynamicSentinelMap({ telemetry }: { telemetry: any }) {
  return <LazySentinelMap initialData={telemetry} />;
}
