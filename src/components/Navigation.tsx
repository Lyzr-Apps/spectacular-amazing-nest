'use client'

import { MessageSquare, History, BookOpen, Settings as SettingsIcon } from 'lucide-react'

interface NavigationProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const navItems = [
    { id: 'support', label: 'Support Chat', icon: MessageSquare },
    { id: 'tickets', label: 'Ticket History', icon: History },
    { id: 'knowledge', label: 'Knowledge Management', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-blue-600">IT Helpdesk</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>v1.0.0</p>
      </div>
    </aside>
  )
}
