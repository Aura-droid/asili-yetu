"use client";

// SYNC-STAMP: 2026-04-18-BRANDING-UPDATE

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Car, Map, Briefcase, MessageSquare, 
  LogOut, Megaphone, MapPin, Camera, BookOpen, Settings, 
  Search, ChevronRight 
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLoading } from "@/providers/LoadingProvider";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === "/admin/login") return null;

  const groups = [
    {
      label: "Operational Pulse",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/bookings", label: "Bookings", icon: Briefcase },
        { href: "/admin/about", label: "About Strategy", icon: BookOpen },
        { href: "/admin/notices", label: "Global Notices", icon: Megaphone },
      ]
    },
    {
      label: "Expedition Atlas",
      items: [
        { href: "/admin/destinations", label: "Destinations", icon: MapPin },
        { href: "/admin/packages", label: "Packages", icon: Map },
        { href: "/admin/fleet", label: "Fleet Showroom", icon: Car },
        { href: "/admin/guides", label: "Ranger Roster", icon: Users },
      ]
    },
    {
      label: "Heritage & Aura",
      items: [
        { href: "/admin/culture", label: "Ancestral Archive", icon: BookOpen },
        { href: "/admin/gallery", label: "Exhibition", icon: Camera },
        { href: "/admin/reviews", label: "Guest Reviews", icon: MessageSquare },
      ]
    },
    {
      label: "Platform Helm",
      items: [
        { href: "/admin/settings", label: "Global Settings", icon: Settings },
      ]
    }
  ];

  const filteredGroups = groups.map(g => ({
    ...g,
    items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()))
  })).filter(g => g.items.length > 0);

  return (
    <div className="w-72 bg-[#0a0a0a] text-white flex flex-col h-full sticky top-0 min-h-screen border-r border-white/5">
        <div className="p-8 border-b border-white/5 flex flex-col items-start gap-4">
          <Image 
            src="/logo.png" 
            alt="Asili Yetu Safaris and Tours Admin" 
            width={56} 
            height={56} 
            className="w-14 h-14 object-contain brightness-110 drop-shadow-[0_0_15px_rgba(255,183,0,0.3)]"
            priority
          />
          {mounted ? (
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Command <span className="text-primary italic">Center</span></h2>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.4em] mt-1 leading-none">Asili Yetu Safaris and Tours Ops</p>
            </div>
          ) : (
            <div className="h-12 w-32 bg-white/5 animate-pulse rounded-lg" />
          )}
        </div>

      {/* Strategic Search */}
      <div className="px-6 pt-8 pb-4">
         <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Modules..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold focus:bg-white/10 focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-white/40"
            />
         </div>
      </div>
      
      <nav className="flex-1 py-8 px-4 space-y-10 overflow-y-auto custom-scrollbar">
        {filteredGroups.map((group) => (
          <div key={group.label} className="space-y-4">
             <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">{group.label}</h3>
             <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={() => setIsLoading(true)}
                      className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/10 shadow-lg shadow-black/40" 
                          : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-primary text-black" : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"}`}>
                            <item.icon className="w-5 h-5" />
                         </div>
                         <span className={`text-[13px] font-bold tracking-tight ${isActive ? "text-primary" : ""}`}>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-all ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 text-white/40"}`} />
                    </Link>
                  );
                })}
             </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
           <div className="px-4 py-10 text-center text-white/50 italic text-xs font-black uppercase tracking-widest">
              Zero Modules Found
           </div>
        )}
      </nav>

      <div className="p-8 bg-black/40 backdrop-blur-md border-t border-white/5">
        <button className="flex items-center gap-4 text-red-400/60 hover:text-red-400 transition-all w-full px-5 py-3 rounded-2xl hover:bg-red-500/5 font-black text-xs uppercase tracking-widest group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
      </div>
    </div>
  );
}

