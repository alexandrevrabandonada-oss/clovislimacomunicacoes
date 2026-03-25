import { Metadata } from 'next'
import LivrosClient from './LivrosClient'

export const metadata: Metadata = {
  title: 'Livros & Ilustração Editorial | ESBOÇO creation & art',
  description: 'Vertical comercial dedicada à construção de capas, personagens e universos visuais para literatura infantil, juvenil e educação estratégica.',
}

export default function LivrosPage() {
  return <LivrosClient />
}
