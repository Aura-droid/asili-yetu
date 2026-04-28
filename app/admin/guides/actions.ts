'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addGuide(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const specialty = formData.get('specialty') as string
  const bio = formData.get('bio') as string
  const file = formData.get('image') as File | null

  const phone_number = formData.get('phone_number') as string
  const fleet_assigned = formData.get('fleet_assigned') as string
  const experience_years = formData.get('experience_years') ? parseInt(formData.get('experience_years') as string) : null
  const languages_raw = formData.get('languages') as string
  const languages = languages_raw ? languages_raw.split(',').map(l => l.trim()).filter(l => l !== '') : []

  if (!name) return { error: "Name is required" }
  
  let image_url = null;

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('asili-images')
      .upload(`guides/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      return { error: `Upload failed: ${uploadError.message}` };
    }
    
    const { data } = supabase.storage
      .from('asili-images')
      .getPublicUrl(`guides/${fileName}`);
      
    image_url = data.publicUrl;
  }

  const { error } = await supabase.from('guides').insert({
    name,
    specialty: specialty || null,
    bio: bio || null,
    phone_number: phone_number || null,
    fleet_assigned: fleet_assigned || 'Land Cruiser 300',
    experience_years,
    languages,
    image_url,
    is_active: true
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/guides')
  return { success: true }
}

export async function toggleGuideStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('guides')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/guides')
  return { success: true }
}

export async function getGuides() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .order('name', { ascending: true })

  if (error) return []
  return data
}

export async function deleteGuide(id: string) {
  const supabase = await createClient()
  
  // 1. Get guide info to potentially delete image
  const { data: guide } = await supabase.from('guides').select('image_url').eq('id', id).single()
  
  // 2. Handle constraints: Nullify assignments in missions table
  // This ensures we don't violate the missions_assigned_ranger_id_fkey constraint
  const { error: unlinkError } = await supabase
    .from('missions')
    .update({ assigned_ranger_id: null })
    .eq('assigned_ranger_id', id)

  if (unlinkError) {
    console.error("Failed to unlink missions:", unlinkError);
  }

  // 3. Delete guide from DB
  const { error } = await supabase.from('guides').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  // 4. Optional: Cleanup storage
  if (guide?.image_url && guide.image_url.includes('guides/')) {
    const fileName = guide.image_url.split('/').pop()
    if (fileName) {
      await supabase.storage.from('asili-images').remove([`guides/${fileName}`])
    }
  }

  revalidatePath('/admin/guides')
  return { success: true }
}

export async function updateGuide(id: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const specialty = formData.get('specialty') as string
  const bio = formData.get('bio') as string
  const file = formData.get('image') as File | null
  const phone_number = formData.get('phone_number') as string
  const fleet_assigned = formData.get('fleet_assigned') as string

  const updates: any = {
    name,
    specialty: specialty || null,
    bio: bio || null,
    phone_number: phone_number || null,
    fleet_assigned: fleet_assigned || 'Land Cruiser 300',
    experience_years: formData.get('experience_years') ? parseInt(formData.get('experience_years') as string) : null,
    languages: formData.get('languages') ? (formData.get('languages') as string).split(',').map(l => l.trim()).filter(l => l !== '') : []
  }

  if (file && file.size > 0) {
    // Handle new image upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('asili-images')
      .upload(`guides/${fileName}`, file);
      
    if (!uploadError) {
      const { data } = supabase.storage.from('asili-images').getPublicUrl(`guides/${fileName}`);
      updates.image_url = data.publicUrl;

      // Optional: Delete old image if it was a custom one
      const { data: oldGuide } = await supabase.from('guides').select('image_url').eq('id', id).single();
      if (oldGuide?.image_url && oldGuide.image_url.includes('guides/')) {
         const oldFileName = oldGuide.image_url.split('/').pop();
         if (oldFileName) await supabase.storage.from('asili-images').remove([`guides/${oldFileName}`]);
      }
    }
  }

  const { error } = await supabase
    .from('guides')
    .update(updates)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/guides')
  return { success: true }
}
