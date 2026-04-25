"use server";

import { createClient } from "@/utils/supabase/server";

export async function pulseLocation(guideId: string, location: { lat: number, lng: number }, batteryStatus?: number) {
  const supabase = await createClient();

  const { error } = await supabase.from('fleet_telemetry').insert({
    guide_id: guideId,
    lat: location.lat,
    lng: location.lng,
    battery_level: batteryStatus || 100,
    speed: 0,
    status: 'moving'
  });

  if (error) {
    console.error("Telemetry Pulse Failure:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getGuideInfo(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('guides').select('id, name, fleet_assigned, specialization').eq('id', id).single();
    if (error) return null;
    return data;
}

export async function getLatestFleetTelemetry() {
  try {
    const supabase = await createClient();
    
    // 1. Fetch all active guides with their mission status
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select(`
        id,
        name,
        image_url,
        fleet_assigned,
        missions:missions!missions_assigned_ranger_id_fkey (
          status
        )
      `)
      .eq('is_active', true);

    if (guidesError) {
      console.error("Guides Retrieval Error:", guidesError);
      return [];
    }

    // 2. Fetch the LATEST telemetry for each guide
    // We use a query that gets the most recent record per guide_id
    const { data: telemetry, error: telError } = await supabase
      .from('fleet_telemetry')
      .select('*')
      .order('timestamp', { ascending: false });

    if (telError) {
      console.error("Telemetry Retrieval Error:", telError);
      return [];
    }

    // 3. Merge Logic: Every active guide gets a marker
    const guideMap = new Map();
    
    // Seed with guide info
    guides.forEach(g => {
      const hasAcceptedMission = g.missions?.some((m: any) => m.status === 'accepted');
      guideMap.set(g.id, {
        guide_id: g.id,
        guides: {
          name: g.name,
          image_url: g.image_url,
          fleet_assigned: g.fleet_assigned
        },
        status: hasAcceptedMission ? 'On Mission' : 'Idle',
        lat: -3.3667, // Default Arusha HQ
        lng: 36.6833,
        battery_level: 0,
        is_offline: true,
        timestamp: null
      });
    });

    // Layer on latest telemetry
    if (telemetry) {
      telemetry.forEach(record => {
        const existing = guideMap.get(record.guide_id);
        if (existing && existing.is_offline) {
          guideMap.set(record.guide_id, {
            ...existing,
            ...record,
            is_offline: false, // It has historical data
            // We keep the 'status' calculated from missions as it's more accurate than 'Active/Idle' in telemetry log
            status: existing.status 
          });
        }
      });
    }

    return Array.from(guideMap.values());
  } catch (err: any) {
    console.error("Unholy Telemetry Error:", err.message || "Unknown Error", err);
    return [];
  }
}
