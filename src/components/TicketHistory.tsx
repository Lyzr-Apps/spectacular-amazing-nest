'use client'

import { useState } from 'react'
import { Search, Filter, Download, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'

interface SampleTicket {
  id: string
  employeeName: string
  employeeEmail: string
  issueSummary: string
  status: 'resolved' | 'escalated' | 'pending'
  timestamp: Date
  resolution?: string
  escalationDetails?: string
}

const sampleTickets: SampleTicket[] = [
  {
    id: 'TKT-001',
    employeeName: 'John Smith',
    employeeEmail: 'john.smith@company.com',
    issueSummary: 'Email not syncing on mobile device',
    status: 'resolved',
    timestamp: new Date(Date.now() - 86400000 * 2),
    resolution: 'Configured OAuth authentication and enabled less secure app access. Issue resolved in 15 minutes.'
  },
  {
    id: 'TKT-002',
    employeeName: 'Sarah Johnson',
    employeeEmail: 'sarah.johnson@company.com',
    issueSummary: 'Cannot connect to VPN from home',
    status: 'escalated',
    timestamp: new Date(Date.now() - 86400000 * 1),
    escalationDetails: 'Escalated to Network Team. Sent at vidur@lyzr.ai. Investigating ISP connectivity issues.'
  },
  {
    id: 'TKT-003',
    employeeName: 'Michael Chen',
    employeeEmail: 'michael.chen@company.com',
    issueSummary: 'Forgot password - account locked',
    status: 'resolved',
    timestamp: new Date(Date.now() - 86400000 * 3),
    resolution: 'Sent password reset link via email. Account unlocked after 3 failed attempts. Resolved in 5 minutes.'
  },
  {
    id: 'TKT-004',
    employeeName: 'Emily Rodriguez',
    employeeEmail: 'emily.rodriguez@company.com',
    issueSummary: 'Software installation permission denied',
    status: 'resolved',
    timestamp: new Date(Date.now() - 86400000 * 4),
    resolution: 'Escalated to admin panel and installed required software. Updated user permissions for future installations.'
  },
  {
    id: 'TKT-005',
    employeeName: 'David Wilson',
    employeeEmail: 'david.wilson@company.com',
    issueSummary: 'WiFi keeps disconnecting - urgent',
    status: 'escalated',
    timestamp: new Date(Date.now() - 86400000 * 5),
    escalationDetails: 'Urgent escalation sent to IT Support Team. Expected response time 2-4 hours.'
  },
  {
    id: 'TKT-006',
    employeeName: 'Lisa Anderson',
    employeeEmail: 'lisa.anderson@company.com',
    issueSummary: 'Two-factor authentication setup guide needed',
    status: 'resolved',
    timestamp: new Date(Date.now() - 86400000 * 6),
    resolution: 'Provided step-by-step guide from knowledge base. Successfully configured 2FA. Resolved in 10 minutes.'
  },
  {
    id: 'TKT-007',
    employeeName: 'Robert Martinez',
    employeeEmail: 'robert.martinez@company.com',
    issueSummary: 'Printer not responding on network',
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000),
    resolution: 'Investigating printer driver compatibility. Will follow up within 24 hours.'
  },
  {
    id: 'TKT-008',
    employeeName: 'Jessica Lee',
    employeeEmail: 'jessica.lee@company.com',
    issueSummary: 'Cannot access shared drives',
    status: 'resolved',
    timestamp: new Date(Date.now() - 86400000 * 7),
    resolution: 'Re-indexed network permissions and restarted file service. Access restored within 20 minutes.'
  },
  {
    id: 'TKT-009',
    employeeName: 'Thomas Brown',
    employeeEmail: 'thomas.brown@company.com',
    issueSummary: 'Outlook calendar sync issues across devices',
    status: 'escalated',
    timestamp: new Date(Date.now() - 86400000 * 8),
    escalationDetails: 'Complex calendar sync issue escalated to Exchange Admin team. Investigating cloud sync conflict.'
  },
  {
    id: 'TKT-010',
    employeeName: 'Amanda White',
    employeeEmail: 'amanda.white@company.com',
    issueSummary: 'Need backup software installation',
    status: 'resolved',
    timestamp: new Date(Date.now() - 86400000 * 9),
    resolution: 'Installed and configured backup software. Provided usage documentation. System operational.'
  }
]

export default function TicketHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'escalated' | 'pending'>('all')
  const [selectedTicket, setSelectedTicket] = useState<SampleTicket | null>(null)

  const filteredTickets = sampleTickets.filter(ticket => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.issueSummary.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'escalated':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'pending':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-600'
      case 'escalated':
        return 'bg-orange-600'
      case 'pending':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Ticket History</h2>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search by ticket ID, employee name, or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={18} />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={18} />
            Export
          </Button>
        </div>

        <div className="flex gap-2">
          {(['all', 'resolved', 'escalated', 'pending'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="p-4 cursor-pointer hover:shadow-md transition border-l-4 border-l-blue-600"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusDot(ticket.status)}`}></div>
                    <span className="font-mono text-sm font-semibold text-gray-900">{ticket.id}</span>
                    <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{ticket.issueSummary}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{ticket.employeeName}</span>
                    <span>{ticket.employeeEmail}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {ticket.timestamp.toLocaleDateString()} at {ticket.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No tickets found matching your search</p>
          </Card>
        )}
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-96 overflow-auto">
          {selectedTicket && (
            <>
              <DialogTitle>{selectedTicket.id} - {selectedTicket.issueSummary}</DialogTitle>
              <DialogDescription>Ticket Details</DialogDescription>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Employee</p>
                    <p className="text-gray-900">{selectedTicket.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Email</p>
                    <p className="text-gray-900">{selectedTicket.employeeEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Date</p>
                    <p className="text-gray-900">{selectedTicket.timestamp.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Issue Summary</p>
                  <p className="text-gray-900">{selectedTicket.issueSummary}</p>
                </div>

                {selectedTicket.resolution && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-2">Resolution</p>
                    <p className="text-green-800 text-sm">{selectedTicket.resolution}</p>
                  </div>
                )}

                {selectedTicket.escalationDetails && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-900 mb-2">Escalation Details</p>
                    <p className="text-orange-800 text-sm">{selectedTicket.escalationDetails}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
