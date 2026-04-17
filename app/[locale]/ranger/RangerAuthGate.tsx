"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

export default function RangerAuthGate() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "missing">("checking");

  useEffect(() => {
    const savedId = localStorage.getItem('asili_ranger_id');
    if (savedId) {
      router.push(`/ranger?id=${savedId}`);
    } else {
      setStatus("missing");
    }
  }, [router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#0d1511] flex flex-col items-center justify-center p-8 text-center">
         <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
         <h1 className="text-xl font-black text-white italic uppercase tracking-widest">Verifying Ranger Signal...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1511] flex flex-col items-center justify-center p-8 text-center">
       <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <ShieldAlert className="text-red-500 w-10 h-10" />
       </div>
       <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">No Ranger Key Found</h1>
       <p className="text-white/40 text-sm font-bold uppercase tracking-widest max-w-xs leading-relaxed">
          You must click a Mission Link from WhatsApp first to initialize your device identity.
       </p>
    </div>
  );
}
