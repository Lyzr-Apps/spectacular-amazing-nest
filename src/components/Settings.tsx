'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function Settings() {
  const [escalationEmail, setEscalationEmail] = useState('vidur@lyzr.ai')
  const [agentTone, setAgentTone] = useState('professional')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [slackNotifications, setSlackNotifications] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [testResult, setTestResult] = useState<'pending' | 'success' | 'error'>('pending')

  const handleTestEscalation = async () => {
    setTestResult('pending')
    await new Promise(resolve => setTimeout(resolve, 1500))
    setTestResult('success')
    setTimeout(() => setShowTestDialog(false), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure escalation rules and agent behavior</p>
      </div>

      <div className="space-y-6">
        {/* Escalation Configuration */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Escalation Configuration</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="escalation-email" className="text-gray-700 font-medium mb-2 block">
                Escalation Email Recipient
              </Label>
              <div className="flex gap-2">
                <Input
                  id="escalation-email"
                  value={escalationEmail}
                  onChange={(e) => setEscalationEmail(e.target.value)}
                  type="email"
                  className="flex-1"
                />
                <Button variant="outline">Save</Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Issues that cannot be resolved will be escalated to this email address
              </p>
            </div>

            <div className="border-t pt-4">
              <Label className="text-gray-700 font-medium mb-3 block">Escalation Criteria</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Escalate on urgent queries</p>
                    <p className="text-xs text-gray-500">Automatically escalate when "urgent" keyword is detected</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Escalate on KB search failure</p>
                    <p className="text-xs text-gray-500">Escalate if no relevant articles are found after search</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Escalate on low confidence</p>
                    <p className="text-xs text-gray-500">Escalate if agent confidence score falls below threshold</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Button
                onClick={() => setShowTestDialog(true)}
                variant="outline"
                className="w-full"
              >
                Test Escalation Email
              </Button>
            </div>
          </div>
        </Card>

        {/* Agent Configuration */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Settings</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="agent-tone" className="text-gray-700 font-medium mb-2 block">
                Agent Communication Tone
              </Label>
              <Select value={agentTone} onValueChange={setAgentTone}>
                <SelectTrigger id="agent-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal & Professional</SelectItem>
                  <SelectItem value="professional">Professional & Friendly</SelectItem>
                  <SelectItem value="casual">Casual & Approachable</SelectItem>
                  <SelectItem value="technical">Technical & Detailed</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-2">
                Choose how the agent communicates with users
              </p>
            </div>

            <div className="border-t pt-4">
              <Label className="text-gray-700 font-medium mb-3 block">Agent Features</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Real-time KB search</p>
                    <p className="text-xs text-gray-500">Show relevant articles as user types</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Confidence scoring</p>
                    <p className="text-xs text-gray-500">Display agent confidence level in responses</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Follow-up suggestions</p>
                    <p className="text-xs text-gray-500">Suggest related issues user might have</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive email for ticket escalations and updates</p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Slack Notifications</p>
                <p className="text-xs text-gray-500">Send ticket updates to Slack channel</p>
              </div>
              <Switch
                checked={slackNotifications}
                onCheckedChange={setSlackNotifications}
              />
            </div>

            {slackNotifications && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-900">
                  Slack channel: <span className="font-semibold">#it-support</span>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Knowledge Base Management */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Base Management</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Upload Policy Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                <p className="text-gray-600 text-sm">Drag and drop your documents here or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">Supported: PDF, DOCX, TXT (Max 10MB)</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-gray-700 font-medium mb-2 block">Current KB Articles</Label>
              <div className="space-y-2">
                {[
                  'Mobile Email Setup Guide',
                  'Password Reset Procedures',
                  'VPN Connection Guide',
                  'WiFi Troubleshooting',
                  'Account Security Best Practices',
                  'Network Security Policies'
                ].map((article, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-900">{article}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">Edit</Button>
                      <Button size="sm" variant="ghost" className="text-red-600">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-900">
                KB articles are automatically indexed and made available to the IT Support Agent
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Test Escalation Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Test Escalation Email</DialogTitle>
          <DialogDescription>Send a test email to verify escalation is working</DialogDescription>

          <div className="space-y-4 py-4">
            {testResult === 'pending' && (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
                </div>
                <p className="text-sm text-gray-600">Sending test email to {escalationEmail}...</p>
              </div>
            )}

            {testResult === 'success' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle className="text-green-600" size={48} />
                <p className="text-sm font-medium text-green-600">Test email sent successfully!</p>
                <p className="text-xs text-gray-600 text-center">Check {escalationEmail} for the test email</p>
              </div>
            )}

            {testResult === 'error' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <AlertCircle className="text-red-600" size={48} />
                <p className="text-sm font-medium text-red-600">Failed to send test email</p>
                <p className="text-xs text-gray-600">Please check your email configuration</p>
              </div>
            )}
          </div>

          {testResult !== 'pending' && (
            <Button
              onClick={() => setShowTestDialog(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
