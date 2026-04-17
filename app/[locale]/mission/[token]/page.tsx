import { Metadata } from "next";
import { getMissionByToken } from "@/app/actions/missions";
import { getGuides } from "@/app/admin/guides/actions";
import MissionAcceptanceUI from "./MissionAcceptanceUI";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Mission Briefing | Asili Yetu Safaris",
  description: "Secure tactical briefing for field operatives.",
};

export default async function MissionPage({ params }: { params: Promise<{ token: string; locale: string }> }) {
  const { token, locale } = await params;
  const { data: mission, error } = await getMissionByToken(token);
  const guides = await getGuides();

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center text-white">
         <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
               <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Authorization Failure</h2>
            <p className="text-white/40 text-sm font-medium leading-relaxed">
              {error || "Mission token not recognized. Check Sentinel Registry."}
            </p>
            {error && (
               <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-[10px] font-mono text-white/30 text-left overflow-auto">
                  RAW MISSION TRACE: {error}
               </div>
            )}
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
       <MissionAcceptanceUI mission={mission} guides={guides || []} />
    </div>
  );
}
