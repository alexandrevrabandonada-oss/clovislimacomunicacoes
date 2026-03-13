// Preços e prazos típicos para pacotes e prints/licenciamento
export const PRICING = {
  packages: {
    'charge-avulsa': { price: 'a partir de R$ 350', prazo: '2 dias úteis' },
    'pacote-mensal': { price: 'a partir de R$ 1200', prazo: 'entrega semanal' },
    'serie-especial': { price: 'a partir de R$ 1800', prazo: '5 a 10 dias úteis' },
    'landing-rapida': { price: 'a partir de R$ 900', prazo: '3 dias úteis' },
    'site-completo': { price: 'a partir de R$ 3500', prazo: '10 a 15 dias úteis' }
  },
  prints: {
    prints: { price: 'a partir de R$ 290', prazo: '7 dias úteis + envio' },
    'licenca-editorial': { price: 'a partir de R$ 180', prazo: 'imediato' },
    'licenca-campanha': { price: 'sob consulta', prazo: 'a definir' }
  },
  services: {
    'editorial': { price: 'sob consulta', prazo: '3 a 5 dias úteis' },
    'licença': { price: 'a partir de R$ 180', prazo: 'imediato (digital)' },
    'tech': { price: 'a partir de R$ 900', prazo: '3 a 15 dias úteis' }
  }
}
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
