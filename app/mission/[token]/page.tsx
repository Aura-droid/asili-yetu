import { getMissionByToken, claimMission } from "@/app/actions/missions";
import { getGuides } from "@/app/admin/guides/actions";
import MissionAcceptanceUI from "./MissionAcceptanceUI";
import { AlertCircle, Map } from "lucide-react";

export default async function MissionPage({ params }: { params: { token: string } }) {
  const { data: mission, error } = await getMissionByToken(params.token);
  const guides = await getGuides();

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-center">
         <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
               <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Invalid Mission Link</h2>
            <p className="text-white/40 text-sm font-medium leading-relaxed">This transmission has expired or the token is unauthorized. Please contact base for a new signal.</p>
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
