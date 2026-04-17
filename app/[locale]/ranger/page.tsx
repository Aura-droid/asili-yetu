import { getGuideInfo } from "@/app/actions/telemetry";
import RangerHeartbeat from "./RangerHeartbeat";
import RangerAuthGate from "./RangerAuthGate";
import { AlertTriangle, Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranger Sentinel | Asili Yetu Safaris",
  description: "Field Operative Telemetry & Mission Briefing Center.",
};

export default async function RangerPage({ searchParams }: { searchParams: { id?: string } }) {
  const guideId = searchParams.id;

  if (!guideId) {
    return <RangerAuthGate />;
  }

  const guide = await getGuideInfo(guideId);

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#0d1511] flex flex-col items-center justify-center p-8 text-center">
         <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500 w-10 h-10" />
         </div>
         <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Registry Mismatch</h1>
         <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-xs leading-relaxed">
            Guide ID <span className="text-red-400">[{guideId.slice(0,8)}...]</span> was not found in the Asili Registry. Check connection and retry.
         </p>
      </div>
    );
  }

  return <RangerHeartbeat guide={guide} />;
}
