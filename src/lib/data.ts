import { supabase } from './supabase/client'

export async function fetchWorks(){
  const { data, error } = await supabase.from('works').select('*')
  if(error) throw error
  return data
}

export async function fetchServices(){
  const { data, error } = await supabase.from('services').select('*')
  if(error) throw error
  return data
}
