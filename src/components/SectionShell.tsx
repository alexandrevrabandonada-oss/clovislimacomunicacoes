"use client"
import React from 'react'

interface SectionShellProps {
  id?: string
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

/**
 * SectionShell
 * Standard wrapper for homepage sections to ensure structural stability.
 * - Position relative for local coordinate system
 * - Z-index isolation
 * - Consistent vertical spacing
 */
export default function SectionShell({ 
  id, 
  children, 
  className = "", 
  noPadding = false 
}: SectionShellProps) {
  return (
    <section 
      id={id} 
      className={`relative z-0 ${noPadding ? '' : 'mt-8 md:mt-12'} ${className}`}
    >
      {/* Anchor for navigation if id is provided */}
      {id && <div className="absolute -top-24" aria-hidden="true" />}
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {children}
      </div>
    </section>
  )
}
