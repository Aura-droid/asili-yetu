'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Login attempt for:', data.email)

  try {
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('Login error:', error.message)
      redirect('/admin/login?error=' + encodeURIComponent(error.message))
    }
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') throw err;
    console.error('Unexpected login crash:', err)
    throw err;
  }

  console.log('Login successful for:', data.email)
  revalidatePath('/admin', 'layout')
  redirect('/admin')
}
