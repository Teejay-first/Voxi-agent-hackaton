import { fetchAgents, type AgentData } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard-client"

export const dynamic = "force-dynamic"
export const dynamicParams = true

interface Agent extends AgentData {
  type?: string
  status?: string
  deployments?: string[]
  stats?: {
    conversations: number
    avgRating: number
    conversionRate: number
  }
}

export default async function DashboardPage() {
  const agents = await fetchAgents()
  
  const agentsWithDefaults: Agent[] = agents.map(agent => ({
    ...agent,
    type: agent.tagline || agent.category || "AI Agent",
    status: agent.status_type === "deployed" ? "active" : "inactive",
    deployments: [],
    stats: {
      conversations: 0,
      avgRating: agent.average_rating || 0,
      conversionRate: 0,
    }
  }))

  return <DashboardClient initialAgents={agentsWithDefaults} />
}
