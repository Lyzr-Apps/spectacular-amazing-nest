'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, X, Lightbulb, TrendingUp } from 'lucide-react'

interface Suggestion {
  id: string
  title: string
  category: string
  proposedContent: string
  impact: 'high' | 'medium' | 'low'
  frequency: number
  status: 'pending' | 'approved' | 'rejected'
}

const analyticData = [
  { category: 'Email Issues', count: 28, escalated: 8 },
  { category: 'Password Reset', count: 22, escalated: 3 },
  { category: 'VPN Connection', count: 19, escalated: 6 },
  { category: 'Network Issues', count: 15, escalated: 4 },
  { category: 'Software Install', count: 12, escalated: 2 },
  { category: 'Mobile Setup', count: 10, escalated: 3 },
  { category: 'Security Issues', count: 8, escalated: 5 }
]

const trendData = [
  { month: 'Aug', resolved: 45, escalated: 12 },
  { month: 'Sep', resolved: 52, escalated: 14 },
  { month: 'Oct', resolved: 67, escalated: 11 },
  { month: 'Nov', resolved: 71, escalated: 9 }
]

const initialSuggestions: Suggestion[] = [
  {
    id: 'SUG-001',
    title: 'iOS Email Sync Troubleshooting Guide',
    category: 'Email Issues',
    proposedContent: 'Step-by-step guide for resolving email synchronization issues on iOS devices. Includes OAuth setup, app cache clearing, and security settings configuration.',
    impact: 'high',
    frequency: 23,
    status: 'pending'
  },
  {
    id: 'SUG-002',
    title: 'VPN Connection Best Practices',
    category: 'VPN Connection',
    proposedContent: 'Comprehensive guide covering VPN client installation, connection troubleshooting, split tunneling configuration, and performance optimization tips.',
    impact: 'high',
    frequency: 19,
    status: 'pending'
  },
  {
    id: 'SUG-003',
    title: 'Two-Factor Authentication Setup',
    category: 'Security Issues',
    proposedContent: 'Complete documentation for enabling and managing 2FA across all company services. Includes backup codes, authenticator app setup, and recovery procedures.',
    impact: 'medium',
    frequency: 14,
    status: 'pending'
  },
  {
    id: 'SUG-004',
    title: 'Remote Work Network Security',
    category: 'Network Issues',
    proposedContent: 'Guidelines for secure remote work setup including WiFi security, firewall configuration, and company network access policies.',
    impact: 'high',
    frequency: 17,
    status: 'pending'
  },
  {
    id: 'SUG-005',
    title: 'Software Installation Policy Update',
    category: 'Software Install',
    proposedContent: 'Updated procedures for requesting and installing business software. Includes approved software list, license management, and installation restrictions.',
    impact: 'medium',
    frequency: 12,
    status: 'pending'
  }
]

export default function KnowledgeManagement() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleApprove = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s))
    setShowDetails(false)
  }

  const handleReject = (id: string) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s))
    setShowDetails(false)
    setRejectionReason('')
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAnalyzing(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return ''
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      default:
        return ''
    }
  }

  const pendingSuggestions = suggestions.filter(s => s.status === 'pending')
  const approvedSuggestions = suggestions.filter(s => s.status === 'approved')
  const resolutionRate = ((approvedSuggestions.length + 10) / (suggestions.length + 10) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Management</h2>
          <p className="text-gray-600">Analyze ticket patterns and improve knowledge base documentation</p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {analyzing ? 'Analyzing...' : 'Analyze & Improve KB'}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-600">
          <p className="text-sm text-gray-600 mb-1">Total Tickets Analyzed</p>
          <p className="text-2xl font-bold text-gray-900">186</p>
          <p className="text-xs text-gray-500 mt-2">Last 90 days</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-600">
          <p className="text-sm text-gray-600 mb-1">Resolution Rate</p>
          <p className="text-2xl font-bold text-gray-900">{resolutionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Without escalation</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-600">
          <p className="text-sm text-gray-600 mb-1">Escalation Rate</p>
          <p className="text-2xl font-bold text-gray-900">8.6%</p>
          <p className="text-xs text-gray-500 mt-2">Avg per category</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-600">
          <p className="text-sm text-gray-600 mb-1">Pending Suggestions</p>
          <p className="text-2xl font-bold text-gray-900">{pendingSuggestions.length}</p>
          <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Total Issues" />
              <Bar dataKey="escalated" fill="#f97316" name="Escalated" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Resolution Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" strokeWidth={2} />
              <Line type="monotone" dataKey="escalated" stroke="#f97316" name="Escalated" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Lightbulb size={24} className="text-blue-600" />
          Improvement Suggestions
        </h3>

        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="p-4 cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setSelectedSuggestion(suggestion)
                setShowDetails(true)
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900">{suggestion.id}</span>
                    <Badge className={`text-xs ${getStatusColor(suggestion.status)}`}>
                      {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                    </Badge>
                    <Badge className={`text-xs ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{suggestion.category}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      Appears in {suggestion.frequency} tickets
                    </span>
                  </div>
                </div>
                {suggestion.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApprove(suggestion.id)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSuggestion(suggestion)
                        setShowDetails(true)
                      }}
                    >
                      <X size={16} className="mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-96 overflow-auto">
          {selectedSuggestion && (
            <>
              <DialogTitle>{selectedSuggestion.title}</DialogTitle>
              <DialogDescription>{selectedSuggestion.category}</DialogDescription>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Impact Level</p>
                    <Badge className={`text-xs ${getImpactColor(selectedSuggestion.impact)}`}>
                      {selectedSuggestion.impact.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Frequency</p>
                    <p className="text-gray-900">{selectedSuggestion.frequency} tickets</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Proposed Content</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedSuggestion.proposedContent}</p>
                  </div>
                </div>

                {selectedSuggestion.status === 'pending' && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Optional: Reason for rejection (visible only if rejecting)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="text-sm"
                      rows={3}
                    />
                    <div className="flex gap-3 justify-end">
                      <Button
                        onClick={() => setShowDetails(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedSuggestion.id)}
                        variant="outline"
                        className="text-red-600"
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedSuggestion.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve & Update KB
                      </Button>
                    </div>
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
