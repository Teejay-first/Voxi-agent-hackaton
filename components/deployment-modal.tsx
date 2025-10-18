"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Globe, Phone, Code, Copy, Check, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DeploymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentName: string
  agentId: string
}

export function DeploymentModal({ open, onOpenChange, agentName, agentId }: DeploymentModalProps) {
  const [copiedWidget, setCopiedWidget] = useState(false)
  const [copiedApi, setCopiedApi] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567")

  const widgetCode = `<!-- Voxie Agent Widget -->
<script src="https://cdn.voxie.ai/widget.js"></script>
<script>
  Voxie.init({
    agentId: "${agentId}",
    position: "bottom-right",
    theme: "auto"
  });
</script>`

  const apiExample = `// API Integration Example
const response = await fetch('https://api.voxie.ai/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    agentId: '${agentId}',
    message: 'Hello, I need help with my order',
    sessionId: 'user-session-123'
  })
});

const data = await response.json();
console.log(data.response);`

  const copyToClipboard = (text: string, type: "widget" | "api") => {
    navigator.clipboard.writeText(text)
    if (type === "widget") {
      setCopiedWidget(true)
      setTimeout(() => setCopiedWidget(false), 2000)
    } else {
      setCopiedApi(true)
      setTimeout(() => setCopiedApi(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl bg-white border-neutral-200 text-neutral-900 max-h-[90vh] overflow-y-auto rounded-[28px] p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-poppins tracking-tighter">Deploy {agentName}</DialogTitle>
          <DialogDescription className="text-sm md:text-base text-neutral-600 font-poppins tracking-tight">
            Choose how you want to deploy your AI agent across different channels
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="widget" className="w-full mt-4">
          <TabsList className="bg-neutral-100 border border-neutral-200 w-full rounded-xl grid grid-cols-3 h-auto">
            <TabsTrigger
              value="widget"
              className="rounded-lg font-poppins tracking-tight text-xs md:text-sm py-2 md:py-2.5 flex flex-col md:flex-row items-center gap-1 md:gap-2"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">Website Widget</span>
              <span className="md:hidden">Widget</span>
            </TabsTrigger>
            <TabsTrigger
              value="phone"
              className="rounded-lg font-poppins tracking-tight text-xs md:text-sm py-2 md:py-2.5 flex flex-col md:flex-row items-center gap-1 md:gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Phone Bot</span>
              <span className="md:hidden">Phone</span>
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="rounded-lg font-poppins tracking-tight text-xs md:text-sm py-2 md:py-2.5 flex flex-col md:flex-row items-center gap-1 md:gap-2"
            >
              <Code className="w-4 h-4" />
              <span>API</span>
            </TabsTrigger>
          </TabsList>

          {/* Website Widget */}
          <TabsContent value="widget" className="space-y-4 mt-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-2 font-poppins tracking-tight">
                Embed on Your Website
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 mb-4 font-poppins tracking-tight">
                Add this code snippet to your website to enable the chat widget
              </p>
            </div>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <Label className="text-neutral-900 font-poppins tracking-tight text-sm md:text-base">
                  Installation Code
                </Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 bg-white rounded-lg font-poppins tracking-tight w-full md:w-auto"
                  onClick={() => copyToClipboard(widgetCode, "widget")}
                >
                  {copiedWidget ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-white border border-neutral-200 rounded-lg p-3 md:p-4 overflow-x-auto text-xs md:text-sm text-neutral-900">
                <code>{widgetCode}</code>
              </pre>
            </Card>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 md:p-4">
              <h4 className="font-semibold text-neutral-900 mb-3 font-poppins tracking-tight text-sm md:text-base">
                Widget Settings
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neutral-700 mb-2 block font-poppins tracking-tight text-sm">Position</Label>
                    <select className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-poppins text-sm">
                      <option>Bottom Right</option>
                      <option>Bottom Left</option>
                      <option>Top Right</option>
                      <option>Top Left</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-neutral-700 mb-2 block font-poppins tracking-tight text-sm">Theme</Label>
                    <select className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-poppins text-sm">
                      <option>Auto</option>
                      <option>Light</option>
                      <option>Dark</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-700 mb-2 block font-poppins tracking-tight text-sm">
                    Primary Color
                  </Label>
                  <Input
                    type="color"
                    defaultValue="#10b981"
                    className="w-full h-10 bg-white border-neutral-200 rounded-lg"
                  />
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-2 p-3 md:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <p className="text-xs md:text-sm text-emerald-700 font-poppins tracking-tight">
                Widget is ready to deploy. Add the code to your website's HTML.
              </p>
            </div>
          </TabsContent>

          {/* Phone Bot */}
          <TabsContent value="phone" className="space-y-4 mt-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-2 font-poppins tracking-tight">
                Phone Bot Integration
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 mb-4 font-poppins tracking-tight">
                Get a dedicated phone number for your AI agent to handle customer calls
              </p>
            </div>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-1 font-poppins tracking-tight text-sm md:text-base">
                    Your Agent Phone Number
                  </h4>
                  <p className="text-xs md:text-sm text-neutral-600 font-poppins tracking-tight">
                    Customers can call this number to reach your agent
                  </p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 w-fit">Active</Badge>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-3 md:p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 md:w-8 md:h-8 text-emerald-600 flex-shrink-0" />
                    <div>
                      <div className="text-xl md:text-2xl font-bold text-neutral-900 font-poppins">{phoneNumber}</div>
                      <div className="text-xs md:text-sm text-neutral-600 font-poppins tracking-tight">
                        US Toll-Free Number
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 bg-white rounded-lg font-poppins tracking-tight w-full md:w-auto"
                  >
                    Change Number
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-white border border-neutral-200 rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-neutral-600 mb-1 font-poppins tracking-tight">
                    Total Calls
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-neutral-900 font-poppins">1,247</div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-neutral-600 mb-1 font-poppins tracking-tight">
                    Avg Duration
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-neutral-900 font-poppins">3:42</div>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 md:p-4">
              <h4 className="font-semibold text-neutral-900 mb-3 font-poppins tracking-tight text-sm md:text-base">
                Voice Settings
              </h4>
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-700 mb-2 block font-poppins tracking-tight text-sm">Voice Type</Label>
                  <select className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-poppins text-sm">
                    <option>Professional Female</option>
                    <option>Professional Male</option>
                    <option>Friendly Female</option>
                    <option>Friendly Male</option>
                  </select>
                </div>
                <div>
                  <Label className="text-neutral-700 mb-2 block font-poppins tracking-tight text-sm">Language</Label>
                  <select className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-poppins text-sm">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-2 p-3 md:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <p className="text-xs md:text-sm text-emerald-700 font-poppins tracking-tight">
                Phone bot is active and ready to receive calls.
              </p>
            </div>
          </TabsContent>

          {/* API Integration */}
          <TabsContent value="api" className="space-y-4 mt-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-2 font-poppins tracking-tight">
                API Integration
              </h3>
              <p className="text-xs md:text-sm text-neutral-600 mb-4 font-poppins tracking-tight">
                Integrate your agent into custom applications using our REST API
              </p>
            </div>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <Label className="text-neutral-900 font-poppins tracking-tight text-sm md:text-base">
                  API Endpoint
                </Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 bg-white rounded-lg font-poppins tracking-tight w-full md:w-auto"
                  onClick={() => copyToClipboard("https://api.voxie.ai/v1/chat", "api")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-3 overflow-x-auto">
                <code className="text-xs md:text-sm text-emerald-600 font-mono whitespace-nowrap">
                  https://api.voxie.ai/v1/chat
                </code>
              </div>
            </Card>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <Label className="text-neutral-900 font-poppins tracking-tight text-sm md:text-base">API Key</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 bg-white rounded-lg font-poppins tracking-tight w-full md:w-auto"
                >
                  Regenerate
                </Button>
              </div>
              <div className="bg-white border border-neutral-200 rounded-lg p-3 flex items-center justify-between gap-2">
                <code className="text-xs md:text-sm text-neutral-600 font-mono truncate">
                  vx_sk_••••••••••••••••••••••••1a2b
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-neutral-600 hover:text-neutral-900 flex-shrink-0"
                  onClick={() => copyToClipboard("vx_sk_1234567890abcdef1234567890abcdef1a2b", "api")}
                >
                  {copiedApi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </Card>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <Label className="text-neutral-900 font-poppins tracking-tight text-sm md:text-base">
                  Example Code
                </Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 bg-white rounded-lg font-poppins tracking-tight w-full md:w-auto"
                  onClick={() => copyToClipboard(apiExample, "api")}
                >
                  {copiedApi ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <pre className="bg-white border border-neutral-200 rounded-lg p-3 md:p-4 overflow-x-auto text-xs md:text-sm text-neutral-900">
                <code>{apiExample}</code>
              </pre>
            </Card>

            <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <h4 className="font-semibold text-neutral-900 font-poppins tracking-tight text-sm md:text-base">
                  API Documentation
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-neutral-200 text-neutral-900 hover:bg-neutral-100 bg-white rounded-lg font-poppins tracking-tight w-full md:w-auto"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Docs
                </Button>
              </div>
              <p className="text-xs md:text-sm text-neutral-600 font-poppins tracking-tight">
                Access comprehensive API documentation with examples, authentication guides, and best practices.
              </p>
            </Card>

            <div className="flex items-center gap-2 p-3 md:p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <p className="text-xs md:text-sm text-emerald-700 font-poppins tracking-tight">
                API access is enabled. Use your API key to authenticate requests.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col md:flex-row justify-end gap-3 mt-6 pt-6 border-t border-neutral-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-neutral-200 text-neutral-900 rounded-xl font-poppins tracking-tight w-full md:w-auto"
          >
            Close
          </Button>
          <Button className="bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 rounded-xl font-poppins tracking-tight shadow-lg transition-all w-full md:w-auto">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
