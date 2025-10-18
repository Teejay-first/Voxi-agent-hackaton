import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

interface CookieToSet {
  name: string
  value: string
  options: CookieOptions
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export interface AgentData {
  id: string
  name: string
  short_desc?: string
  tagline?: string
  status_type?: string
  average_rating?: number
  total_ratings?: number
  avatar_url?: string
  category?: string
}

export async function fetchAgents(): Promise<AgentData[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('agents')
    .select('id, name, short_desc, tagline, status_type, average_rating, total_ratings, avatar_url, category')
    .limit(100)
  
  if (error) {
    console.error('Error fetching agents:', error)
    return []
  }
  
  return (data || []).map((agent: any) => ({
    id: agent.id,
    name: agent.name || 'Unnamed Agent',
    short_desc: agent.short_desc,
    tagline: agent.tagline,
    status_type: agent.status_type || 'testing',
    average_rating: agent.average_rating || 0,
    total_ratings: agent.total_ratings || 0,
    avatar_url: agent.avatar_url,
    category: agent.category,
  }))
}
