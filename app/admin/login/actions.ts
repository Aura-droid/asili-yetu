'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Login attempt for:', data.email)

  try {
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('Login error:', error.message)
      return { success: false, error: error.message }
    }
    
    revalidatePath('/admin', 'layout')
    return { success: true, redirectTo: '/admin' }
  } catch (err: any) {
    console.error('Unexpected login crash:', err)
    return { success: false, error: 'An internal system error occurred. Please check logs.' }
  }
}
