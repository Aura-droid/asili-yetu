'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { translateContent } from '@/utils/translate'

export async function addVehicle(formData: FormData) {
  const supabase = await createClient()

  const model_name = formData.get('model_name') as string
  const capacity = formData.get('capacity') as string
  const featuresStr = formData.get('features') as string
  const file = formData.get('image') as File | null
  const plate_number = formData.get('plate_number') as string

  if (!model_name) return { error: "Model Name is required" }
  
  let image_url = null;

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('asili-images')
      .upload(`fleet/${fileName}`, file, { cacheControl: '3600', upsert: false })
      
    if (uploadError) return { error: `Upload failed: ${uploadError.message}` }
    
    const { data } = supabase.storage.from('asili-images').getPublicUrl(`fleet/${fileName}`)
    image_url = data.publicUrl
  }

  // Parse comma separated features
  const features = featuresStr ? featuresStr.split(',').map(f => f.trim()).filter(Boolean) : []

  // Magic Translate
  const translations = await translateContent(`Machine: ${model_name}. Features: ${featuresStr}`);

  const { error } = await supabase.from('vehicles').insert({
    model_name,
    plate_number: plate_number || null,
    capacity: parseInt(capacity) || 6,
    features,
    image_url,
    is_available: true,
    translations
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/fleet')
  return { success: true }
}

export async function deleteVehicle(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/fleet')
  return { success: true }
}

export async function toggleMaintenance(id: string, currentlyAvailable: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('vehicles')
    .update({ is_available: !currentlyAvailable })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/fleet')
  return { success: true }
}
