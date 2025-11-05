'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: Date
  kbArticles?: Array<{ title: string; excerpt: string; relevance: number }>
}

interface Ticket {
  id: string
  status: 'pending' | 'resolved' | 'escalated'
  escalationEmail?: string
}

export default function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I am the IT Support Agent. I can help you with technical issues, software installation, network problems, and policy questions. Please describe your IT issue.',
      timestamp: new Date(Date.now() - 60000),
      kbArticles: []
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [showEscalationPreview, setShowEscalationPreview] = useState(false)
  const [escalationPreview, setEscalationPreview] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const sampleKBArticles = {
    'email': [
      { title: 'Mobile Email Setup Guide', excerpt: 'Configure email on iOS and Android devices...', relevance: 0.95 },
      { title: 'Common Email Sync Issues', excerpt: 'Troubleshoot email synchronization problems...', relevance: 0.92 }
    ],
    'password': [
      { title: 'Password Reset Procedures', excerpt: 'Step-by-step guide to reset your password...', relevance: 0.98 },
      { title: 'Account Security Best Practices', excerpt: 'Protect your account with strong passwords...', relevance: 0.85 }
    ],
    'vpn': [
      { title: 'VPN Connection Guide', excerpt: 'Connect to company VPN securely...', relevance: 0.96 },
      { title: 'Remote Access Policies', excerpt: 'Company policies for remote work access...', relevance: 0.88 }
    ],
    'network': [
      { title: 'WiFi Troubleshooting', excerpt: 'Resolve WiFi connectivity issues...', relevance: 0.90 },
      { title: 'Network Security Policies', excerpt: 'Company network security guidelines...', relevance: 0.82 }
    ]
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const findRelevantArticles = (text: string) => {
    const lowerText = text.toLowerCase()
    let articles: Message['kbArticles'] = []

    Object.entries(sampleKBArticles).forEach(([key, items]) => {
      if (lowerText.includes(key)) {
        articles = [...articles, ...items]
      }
    })

    return articles.slice(0, 3)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Call the IT Support Agent via API
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          agent_id: '68fd263d71c6b27d6c8eb80f', // IT Support Agent ID
          user_id: 'employee-001',
          session_id: 'session-' + Date.now()
        })
      })

      const data = await response.json()

      if (data.success) {
        // Extract agent response - handle both string and object responses
        let agentResponse = ''
        if (typeof data.response === 'string') {
          agentResponse = data.response
        } else if (typeof data.response === 'object' && data.response !== null) {
          agentResponse = data.response.response || data.response.answer || JSON.stringify(data.response)
        }

        const relevantArticles = findRelevantArticles(input)
        const needsEscalation = agentResponse.toLowerCase().includes('escalate') ||
                                input.toLowerCase().includes('urgent') ||
                                input.toLowerCase().includes('critical') ||
                                (data.response?.requires_escalation === true)

        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: agentResponse,
          timestamp: new Date(),
          kbArticles: relevantArticles
        }

        setMessages(prev => [...prev, agentMessage])

        if (needsEscalation) {
          const newTicket: Ticket = {
            id: `TKT-${Date.now()}`,
            status: 'escalated',
            escalationEmail: 'vidur@lyzr.ai'
          }
          setTicket(newTicket)
          setEscalationPreview(`To: vidur@lyzr.ai\nSubject: Escalated IT Support Ticket - ${newTicket.id}\n\nTicket ID: ${newTicket.id}\nIssue: ${input}\n\nAgent Response:\n${agentResponse}\n\nEmployee has reported an issue requiring specialized support. Please review the conversation history and provide resolution.`)
          setShowEscalationPreview(true)
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: 'I encountered an error processing your request. Please try again.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Agent API error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'Failed to connect to the support agent. Please check your connection and try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleEscalation = async () => {
    setShowEscalationPreview(false)
    if (ticket) {
      setTicket({ ...ticket, status: 'escalated' })
      const confirmMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'agent',
        content: `Your issue has been escalated to our support team (Ticket ID: ${ticket.id}). You will receive updates via email. Expected response time is 2-4 hours for urgent issues.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, confirmMessage])
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-lg rounded-tr-none'
                    : 'bg-gray-100 text-gray-900 rounded-lg rounded-tl-none'
                } p-4`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg rounded-tl-none p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {ticket?.status === 'escalated' && (
          <div className="px-6 py-2">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Ticket {ticket.id} escalated to {ticket.escalationEmail}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <div className="border-t border-gray-200 p-6 bg-white">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your IT issue..."
              className="flex-1"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-auto">
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Knowledge Base Articles</h3>
          <div className="space-y-3">
            {messages[messages.length - 1]?.kbArticles && messages[messages.length - 1].kbArticles.length > 0 ? (
              messages[messages.length - 1].kbArticles.map((article, idx) => (
                <Card key={idx} className="p-4 cursor-pointer hover:shadow-md transition">
                  <h4 className="font-medium text-sm text-gray-900 mb-2">{article.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600">Relevance: {Math.round(article.relevance * 100)}%</span>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-sm text-gray-500">KB articles will appear here as you chat</p>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showEscalationPreview} onOpenChange={setShowEscalationPreview}>
        <DialogContent className="max-w-md">
          <DialogTitle>Escalation Email Preview</DialogTitle>
          <DialogDescription>Review and confirm escalation details</DialogDescription>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{escalationPreview}</pre>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <Button
              onClick={() => setShowEscalationPreview(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEscalation}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle size={18} className="mr-2" />
              Confirm & Escalate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
