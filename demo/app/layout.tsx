import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'TreeView Demo',
  description: 'TreeView component demo',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}

