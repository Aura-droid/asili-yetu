"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Layers, Thermometer, Zap, Clock, X, Info } from "lucide-react";
import BiomePackageCard from "./BiomePackageCard";
import { motion, AnimatePresence } from "framer-motion";

export default function SafariExplorer({ packages, t }: { packages: any[], t: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBiome, setSelectedBiome] = useState<string | null>(null);
  const [selectedIntensity, setSelectedIntensity] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const biomes = useMemo(() => {
    const set = new Set(packages.map(p => p.biome_orientation).filter(Boolean));
    return Array.from(set);
  }, [packages]);

  const intensities = useMemo(() => {
    const set = new Set(packages.map(p => p.intensity_vibe).filter(Boolean));
    return Array.from(set);
  }, [packages]);

  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      const searchStr = `${pkg.title} ${pkg.description} ${pkg.biome_orientation} ${pkg.temperature_profile} ${pkg.intensity_vibe}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchQuery.toLowerCase());
      const matchesBiome = !selectedBiome || pkg.biome_orientation === selectedBiome;
      const matchesIntensity = !selectedIntensity || pkg.intensity_vibe === selectedIntensity;
      return matchesSearch && matchesBiome && matchesIntensity;
    });
  }, [packages, searchQuery, selectedBiome, selectedIntensity]);

  return (
    <div className="space-y-12">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-6 sticky top-24 z-40 bg-background/80 backdrop-blur-xl p-6 rounded-[3rem] border border-foreground/5 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30" />
            <input 
              type="text"
              placeholder="Search by biome, vibe, or destination (e.g. 'Savannah', 'Tropical', 'Extreme')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/5 border-none rounded-full py-6 pl-16 pr-8 text-lg font-bold text-foreground focus:ring-2 focus:ring-primary transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-foreground/5 rounded-full"
              >
                <X className="w-4 h-4 text-foreground/40" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-3 px-8 py-6 rounded-full font-black uppercase tracking-widest text-sm transition-all ${showFilters ? 'bg-primary text-black' : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? 'Lock Filters' : 'Refine'}
            {(selectedBiome || selectedIntensity) && (
               <span className="w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-[10px] animate-pulse">!</span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 pb-2 border-t border-foreground/5 mt-4">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Biome Filter
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedBiome(null)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!selectedBiome ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'}`}
                    >
                      All Biomes
                    </button>
                    {biomes.map(biome => (
                      <button 
                        key={biome}
                        onClick={() => setSelectedBiome(biome)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedBiome === biome ? 'bg-primary text-black' : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'}`}
                      >
                        {biome}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Intensity Filter
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedIntensity(null)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!selectedIntensity ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'}`}
                    >
                      All Levels
                    </button>
                    {intensities.map(vibe => (
                      <button 
                        key={vibe}
                        onClick={() => setSelectedIntensity(vibe)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedIntensity === vibe ? 'bg-primary text-black' : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10'}`}
                      >
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-4 px-6 md:px-0">
         <div className="h-px bg-foreground/10 flex-1"></div>
         <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em] italic">
           {filteredPackages.length} {filteredPackages.length === 1 ? 'Expedition' : 'Expeditions'} Located
         </p>
         <div className="h-px bg-foreground/10 flex-1"></div>
      </div>

      {/* Results List */}
      <div className="flex flex-col max-w-6xl mx-auto space-y-32">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <BiomePackageCard key={pkg.id} pkg={pkg} />
          ))
        ) : (
          <div className="text-center py-40 bg-foreground/5 rounded-[4rem] border border-dashed border-foreground/10">
            <Info className="w-20 h-20 mx-auto mb-6 text-foreground/10" />
            <h3 className="text-4xl font-black text-foreground/40 italic uppercase tracking-tighter">No Expeditions Fit This Criteria</h3>
            <p className="text-foreground/30 mt-4 font-bold uppercase tracking-widest text-xs">Try broadening your horizon or clearing filters</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedBiome(null);
                setSelectedIntensity(null);
              }}
              className="mt-10 px-10 py-5 bg-foreground text-background rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Reset Global Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
