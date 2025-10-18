"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Phone,
  Globe,
  Code,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  Play,
  Pause,
  MoreVertical,
  Plus,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeploymentModal } from "@/components/deployment-modal"

// Dummy data for agents
const agents = [
  {
    id: "1",
    name: "ShopBot Pro",
    type: "E-commerce Voice Agent",
    status: "active",
    deployments: ["widget", "phone"],
    stats: {
      conversations: 1247,
      avgRating: 4.8,
      conversionRate: 23,
    },
  },
  {
    id: "2",
    name: "Support Assistant",
    type: "Customer Support Agent",
    status: "active",
    deployments: ["widget"],
    stats: {
      conversations: 892,
      avgRating: 4.6,
      conversionRate: 18,
    },
  },
  {
    id: "3",
    name: "Product Advisor",
    type: "Product Recommendation Agent",
    status: "paused",
    deployments: ["api"],
    stats: {
      conversations: 456,
      avgRating: 4.9,
      conversionRate: 31,
    },
  },
]

const deploymentIcons = {
  widget: Globe,
  phone: Phone,
  api: Code,
}

export const dynamic = "force-dynamic"
export const dynamicParams = true

export default function DashboardPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [deploymentModalOpen, setDeploymentModalOpen] = useState(false)

  const handleTestCall = () => {
    if (typeof window !== "undefined") {
      window.location.href = `/agent/${selectedAgent.id}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-neutral-900 font-poppins tracking-tight">
                  Voxie Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-neutral-600 font-poppins tracking-tight">Manage your AI agents</p>
              </div>
            </div>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 rounded-xl font-poppins tracking-tight shadow-lg transition-all text-sm sm:text-base">
              <Plus className="w-4 h-4 mr-2" />
              Create New Agent
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4 font-poppins tracking-tight">
              Your Agents
            </h2>
            {agents.map((agent) => (
              <Card
                key={agent.id}
                className={`p-3 sm:p-4 cursor-pointer transition-all rounded-[28px] hover-lift ${
                  selectedAgent.id === agent.id
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-white border-neutral-200/70 hover:border-neutral-300"
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-neutral-900 font-poppins tracking-tight">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-neutral-600 font-poppins tracking-tight">{agent.type}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-neutral-200">
                      <DropdownMenuItem className="text-neutral-900">Edit Agent</DropdownMenuItem>
                      <DropdownMenuItem className="text-neutral-900">Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={agent.status === "active" ? "default" : "secondary"}
                    className={`text-xs ${
                      agent.status === "active"
                        ? "bg-emerald-500/20 text-emerald-700 border-emerald-500/30"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {agent.status}
                  </Badge>
                  <div className="flex gap-1">
                    {agent.deployments.map((deployment) => {
                      const Icon = deploymentIcons[deployment as keyof typeof deploymentIcons]
                      return (
                        <div
                          key={deployment}
                          className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-neutral-100 border border-neutral-200 flex items-center justify-center"
                        >
                          <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neutral-600" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white border-neutral-200/70 rounded-[28px] p-4 sm:p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-poppins tracking-tighter">
                      {selectedAgent.name}
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600 font-poppins tracking-tight">
                      {selectedAgent.type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none border-emerald-500/30 text-emerald-700 hover:bg-emerald-50 bg-white rounded-xl font-poppins tracking-tight text-xs sm:text-sm"
                    onClick={handleTestCall}
                  >
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Test Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none border-neutral-200 text-neutral-900 hover:bg-neutral-50 bg-white rounded-xl font-poppins tracking-tight text-xs sm:text-sm"
                  >
                    {selectedAgent.status === "active" ? (
                      <>
                        <Pause className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 rounded-xl font-poppins tracking-tight shadow-lg transition-all text-xs sm:text-sm"
                    onClick={() => setDeploymentModalOpen(true)}
                  >
                    Deploy
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm text-neutral-600 font-poppins tracking-tight hidden sm:inline">
                      Conversations
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-neutral-900 font-poppins">
                    {selectedAgent.stats.conversations}
                  </div>
                  <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-poppins tracking-tight">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">+12%</span>
                  </div>
                </Card>
                <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm text-neutral-600 font-poppins tracking-tight hidden sm:inline">
                      Rating
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-neutral-900 font-poppins">
                    {selectedAgent.stats.avgRating}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 font-poppins tracking-tight hidden sm:block">
                    out of 5.0
                  </div>
                </Card>
                <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm text-neutral-600 font-poppins tracking-tight hidden sm:inline">
                      Conversion
                    </span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-neutral-900 font-poppins">
                    {selectedAgent.stats.conversionRate}%
                  </div>
                  <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1 font-poppins tracking-tight">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">+5%</span>
                  </div>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-neutral-100 border border-neutral-200 rounded-xl w-full grid grid-cols-4">
                  <TabsTrigger value="overview" className="rounded-lg font-poppins tracking-tight text-xs sm:text-sm">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="deployment" className="rounded-lg font-poppins tracking-tight text-xs sm:text-sm">
                    Deploy
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="rounded-lg font-poppins tracking-tight text-xs sm:text-sm">
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="customize" className="rounded-lg font-poppins tracking-tight text-xs sm:text-sm">
                    Custom
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4 font-poppins tracking-tight">
                      Active Deployments
                    </h3>
                    <div className="space-y-3">
                      {selectedAgent.deployments.map((deployment) => {
                        const Icon = deploymentIcons[deployment as keyof typeof deploymentIcons]
                        return (
                          <Card key={deployment} className="bg-neutral-50 border-neutral-200 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-neutral-900 capitalize font-poppins tracking-tight">
                                    {deployment}
                                  </h4>
                                  <p className="text-sm sm:text-base text-neutral-600 font-poppins tracking-tight">
                                    {deployment === "widget"
                                      ? "Website Widget"
                                      : deployment === "phone"
                                        ? "Phone Bot"
                                        : "API Integration"}
                                  </p>
                                </div>
                              </div>
                              <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">Active</Badge>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-3 sm:mb-4 font-poppins tracking-tight">
                      Recent Activity
                    </h3>
                    <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 pb-3 border-b border-neutral-200">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                          <div className="flex-1">
                            <p className="text-sm sm:text-base text-neutral-900 font-poppins tracking-tight">
                              Conversation completed with high satisfaction
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-500 font-poppins tracking-tight">
                              2 minutes ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 pb-3 border-b border-neutral-200">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                          <div className="flex-1">
                            <p className="text-sm sm:text-base text-neutral-900 font-poppins tracking-tight">
                              New deployment activated on website
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-500 font-poppins tracking-tight">
                              1 hour ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                          <div className="flex-1">
                            <p className="text-sm sm:text-base text-neutral-900 font-poppins tracking-tight">
                              Agent personality updated
                            </p>
                            <p className="text-xs sm:text-sm text-neutral-500 font-poppins tracking-tight">
                              3 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="deployment" className="mt-6">
                  <div className="space-y-4">
                    <p className="text-neutral-600 font-poppins tracking-tight">
                      Deploy your agent across multiple channels to reach customers wherever they are.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-6 text-center hover-lift">
                        <Globe className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-neutral-900 mb-2 sm:mb-3 font-poppins tracking-tight">
                          Website Widget
                        </h4>
                        <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-5 font-poppins tracking-tight">
                          Embed on your website
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-neutral-200 text-neutral-900 bg-white rounded-xl font-poppins tracking-tight text-sm sm:text-base"
                        >
                          Configure
                        </Button>
                      </Card>
                      <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-6 text-center hover-lift">
                        <Phone className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-neutral-900 mb-2 sm:mb-3 font-poppins tracking-tight">
                          Phone Bot
                        </h4>
                        <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-5 font-poppins tracking-tight">
                          Handle phone calls
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-neutral-200 text-neutral-900 bg-white rounded-xl font-poppins tracking-tight text-sm sm:text-base"
                        >
                          Configure
                        </Button>
                      </Card>
                      <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-6 text-center hover-lift">
                        <Code className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-neutral-900 mb-2 sm:mb-3 font-poppins tracking-tight">API</h4>
                        <p className="text-sm sm:text-base text-neutral-600 mb-4 sm:mb-5 font-poppins tracking-tight">
                          Custom integration
                        </p>
                        <Button
                          variant="outline"
                          className="w-full border-neutral-200 text-neutral-900 bg-white rounded-xl font-poppins tracking-tight text-sm sm:text-base"
                        >
                          Configure
                        </Button>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-6">
                  <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-8 text-center">
                    <TrendingUp className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-2 sm:mb-3 font-poppins tracking-tight">
                      Analytics Coming Soon
                    </h3>
                    <p className="text-neutral-600 font-poppins tracking-tight">
                      Detailed analytics and insights will be available here to help you optimize your agent's
                      performance.
                    </p>
                  </Card>
                </TabsContent>

                <TabsContent value="customize" className="mt-6">
                  <Card className="bg-neutral-50 border-neutral-200 rounded-xl p-8 text-center">
                    <Settings className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-2 sm:mb-3 font-poppins tracking-tight">
                      Customization Options
                    </h3>
                    <p className="text-neutral-600 font-poppins tracking-tight">
                      Customize your agent's personality, voice, and behavior to match your brand perfectly.
                    </p>
                  </Card>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      <DeploymentModal
        open={deploymentModalOpen}
        onOpenChange={setDeploymentModalOpen}
        agentName={selectedAgent.name}
        agentId={selectedAgent.id}
      />
    </div>
  )
}
