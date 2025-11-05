'use client'

import { useState } from 'react'
import SupportChat from '@/components/SupportChat'
import TicketHistory from '@/components/TicketHistory'
import KnowledgeManagement from '@/components/KnowledgeManagement'
import Settings from '@/components/Settings'
import Navigation from '@/components/Navigation'

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState('support')

  const renderPage = () => {
    switch (currentPage) {
      case 'support':
        return <SupportChat />
      case 'tickets':
        return <TicketHistory />
      case 'knowledge':
        return <KnowledgeManagement />
      case 'settings':
        return <Settings />
      default:
        return <SupportChat />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">IT Operations Helpdesk</h1>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                IT
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
