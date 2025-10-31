import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'indigo' | 'pink' | 'teal' | 'purple'
  hover?: boolean
}

export function Card({ children, className = '', variant = 'default', hover = true }: CardProps) {
  const variants = {
    default: 'border-white/10',
    indigo: 'border-indigo-500/30',
    pink: 'border-pink-500/30',
    teal: 'border-teal-500/30',
    purple: 'border-purple-500/30'
  }
  
  return (
    <div className={`glass rounded-3xl p-8 border-2 ${variants[variant]} ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  )
}
