import { Users, Car, Map, Briefcase, TrendingUp, Zap, Radio, ArrowUpRight, ShieldCheck, Activity } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getLatestFleetTelemetry } from "@/app/actions/telemetry";
import dynamic from "next/dynamic";
import DynamicSentinelMap from "@/components/DynamicSentinelMap";
import AIReportGenerator from "@/components/AIReportGenerator";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch live metrics
  const [{ count: bookingsCount }, { count: toursCount }, { count: guidesCount }, { count: fleetCount }] = await Promise.all([
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('packages').select('*', { count: 'exact', head: true }),
    supabase.from('guides').select('*', { count: 'exact', head: true }),
    supabase.from('vehicles').select('*', { count: 'exact', head: true })
  ]);

  // 2. Fetch live metrics for ROI Intelligence
  const { data: allInquiries } = await supabase.from('inquiries').select('status, quoted_price');

  // Calculate ROI Metrics
  const totalLeads = allInquiries?.length || 0;
  const confirmedLeads = allInquiries?.filter(i => i.status === 'confirmed').length || 0;
  const pipelineValue = allInquiries?.reduce((sum, i) => sum + (Number(i.quoted_price) || 0), 0) || 0;
  const conversionRate = totalLeads > 0 ? ((confirmedLeads / totalLeads) * 100).toFixed(1) : 0;

  // 3. Fetch Live Missions
  const { data: missions } = await supabase
    .from('missions')
    .select(`
      *,
      inquiries (client_name),
      guides:assigned_ranger_id (name)
    `)
    .order('dispatched_at', { ascending: false })
    .limit(3);

  // 4. Fetch Live Telemetry
  const latestTelemetry = await getLatestFleetTelemetry();

  // 5. Fetch all vehicles for the overview
  const { data: vehicles } = await supabase.from('vehicles').select('*').order('model_name', { ascending: true });

  const avgYield = confirmedLeads > 0 ? Math.round(pipelineValue / confirmedLeads) : 0;

  const stats = [
    { label: "Active Expeditions", value: bookingsCount || 0, icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Curated Packages", value: toursCount || 0, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Expert Guides", value: guidesCount || 0, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Elite Fleet", value: fleetCount || 0, icon: Car, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="p-10 w-full mb-32 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-foreground tracking-tighter italic uppercase leading-none">Command <span className="text-primary">Center</span></h1>
          <p className="text-xs font-bold text-foreground/40 mt-4 uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            Operational Intelligence Engine — v2.4.0
          </p>
        </div>
        <div className="bg-black text-white px-6 py-4 rounded-3xl flex items-center gap-4 shadow-xl shadow-black/10 border border-white/10">
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(guidesCount || 0, 3) }).map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-primary border-2 border-black flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-black" />
              </div>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">{guidesCount || 0} Rangers on Grid</span>
        </div>
      </div>

      {/* CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-black/5 hover:border-primary/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-black/5 relative overflow-hidden">
            <div className={`p-4 rounded-2xl w-fit mb-6 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-1 leading-none">{stat.label}</h3>
            <p className="text-4xl font-black text-foreground italic">{stat.value}</p>
            <div className="absolute top-8 right-8 text-black/5 group-hover:text-primary/20 transition-colors">
              <ArrowUpRight className="w-8 h-8" />
            </div>
          </div>
        ))}
      </div>

      {/* ROI & PIPELINE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        <div className="lg:col-span-2 bg-black rounded-[3rem] p-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-48 h-48 -rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black italic uppercase tracking-tight">ROI Intelligence</h2>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Global Revenue Pipeline</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Estimated Pipeline</p>
                <p className="text-3xl font-black italic">${pipelineValue.toLocaleString()}</p>
                <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%]"></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Total Inquiries</p>
                <p className="text-3xl font-black italic">{totalLeads}</p>
                <p className="text-[10px] font-bold text-white/30 mt-2 uppercase">From all platforms</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Conversion Rate</p>
                <p className="text-3xl font-black italic">{conversionRate}%</p>
                <p className="text-[10px] font-bold text-white/30 mt-2 uppercase">Confirmed bookings</p>
              </div>
            </div>
          </div>
        </div>

        <AIReportGenerator 
          metrics={{ 
            totalInquiries: totalLeads, 
            conversionRate: Number(conversionRate), 
            totalRevenue: pipelineValue, 
            avgYield: avgYield 
          }} 
        />
      </div>

      {/* MISSION SENTINEL FEED */}
      <h2 className="text-2xl font-black text-foreground mb-8 mt-16 tracking-tighter uppercase italic flex items-center gap-4">
        Live Mission <span className="text-primary italic underline decoration-4 decoration-primary/30">Sentinel</span>
        <div className="flex-1 h-px bg-black/5"></div>
      </h2>

      {/* MAP TERMINAL */}
      <div className="mb-16">
        <DynamicSentinelMap telemetry={latestTelemetry} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {missions?.map((mission) => (
          <div key={mission.id} className="bg-white rounded-[2.5rem] p-8 border border-black/5 hover:border-primary/50 transition-all group shadow-sm hover:shadow-2xl hover:shadow-black/5">
            <div className="flex items-start justify-between mb-6">
              <div className={`p-4 rounded-2xl transition-all ${mission.status === 'accepted' ? 'bg-primary text-black' : 'bg-black/5 text-black/20 group-hover:text-black/40'}`}>
                <Zap className="w-6 h-6" />
              </div>
              <span className={`text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border ${mission.status === 'accepted'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-black/5 text-black/40 border-black/5'
                }`}>
                {mission.status}
              </span>
            </div>
            <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-2 leading-none">
              {mission.status === 'accepted' ? 'Ranger on Point' : 'Dispatch Pending'}
            </p>
            <h4 className="text-xl font-black text-foreground italic mb-4 leading-none truncate">
              {mission.guides?.name || 'Awaiting Response'}
            </h4>
            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <span className="text-[10px] font-bold text-foreground/50 italic truncate max-w-[150px]">
                Guest: {mission.inquiries?.client_name || 'Custom Expedition'}
              </span>
              <span className="text-[10px] font-bold text-foreground/50">
                {new Date(mission.dispatched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TACTICAL FLEET OVERVIEW */}
      <h2 className="text-2xl font-black text-foreground mb-8 mt-16 tracking-tighter uppercase italic flex items-center gap-4">
        Elite Fleet <span className="text-primary italic underline decoration-4 decoration-primary/30">Registry</span>
        <div className="flex-1 h-px bg-black/5"></div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
        {vehicles?.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-[2rem] p-6 border border-black/5 hover:border-primary/50 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6 text-foreground/20 group-hover:text-primary transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] leading-none mb-1">UNIT IDENTIFIER</p>
              <h4 className="font-black text-foreground text-sm truncate uppercase tracking-tight italic">"{vehicle.model_name}"</h4>
              {vehicle.plate_number && (
                <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/20">
                  {vehicle.plate_number}
                </span>
              )}
            </div>
            <div className={`ml-auto w-2 h-2 rounded-full ${vehicle.is_available ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]'}`} />
          </div>
        ))}
        {!vehicles?.length && (
          <div className="col-span-full py-12 text-center bg-foreground/[0.02] rounded-[2rem] border border-dashed border-foreground/10">
            <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest italic">No assets registered in the digital garage.</p>
          </div>
        )}
      </div>
    </div>
  );
}
