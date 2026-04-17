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
