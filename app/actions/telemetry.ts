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
    
    // Test point: Simple reachability check
    const { data: testData, error: testError } = await supabase.from('fleet_telemetry').select('count', { count: 'exact', head: true });
    
    if (testError) {
       console.error("Telemetry Reachability Check Failed:", JSON.stringify(testError, null, 2));
       return [];
    }

    // Full query with join
    const { data, error } = await supabase
      .from('fleet_telemetry')
      .select(`
        *,
        guides (
          name,
          fleet_assigned,
          image_url
        )
      `)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Telemetry Selective Retrieval Error:", JSON.stringify(error, null, 2));
      return [];
    }

    if (!data || data.length === 0) return [];

    // Filter for uniqueness by guide_id (taking the first/latest one)
    const uniqueGuides = new Map();
    data.forEach(record => {
      if (record.guide_id && !uniqueGuides.has(record.guide_id)) {
        uniqueGuides.set(record.guide_id, record);
      }
    });

    return Array.from(uniqueGuides.values());
  } catch (err: any) {
    console.error("Unholy Telemetry Error:", err.message || "Unknown Error", err);
    return [];
  }
}
