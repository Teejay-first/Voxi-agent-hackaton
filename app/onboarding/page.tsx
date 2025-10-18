"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sparkles, ArrowRight, Store, Database, Zap } from "lucide-react"

export const dynamic = "force-dynamic"

export default function OnboardingPage() {
  const router = useRouter()
  const [storeUrl, setStoreUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [useDummyData, setUseDummyData] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Navigate to build mode
    router.push("/build")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Voxie Orb - emerald gradient */}
          <div className="relative mb-8 animate-scaleIn">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 shadow-2xl shadow-emerald-500/30" />
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-300 to-green-300 blur-xl opacity-40 animate-pulse" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white" />
          </div>

          {/* Voxie Message - white card with design system styling */}
          <div className="bg-white border border-neutral-200/70 rounded-[28px] p-8 max-w-2xl w-full mb-8 shadow-2xl animate-fadeInUp animation-delay-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 font-poppins tracking-tighter">
                  Hi! I'm Voxie
                </h2>
                <p className="text-neutral-600 leading-relaxed font-poppins tracking-tight">
                  I'll be creating your custom AI agent. To get started, I need to learn about your store. Just share
                  your store URL, and I'll analyze your products, brand voice, and customer needs to build the perfect
                  agent for you.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeUrl" className="text-neutral-900 text-base font-poppins tracking-tight">
                  Your Store URL
                </Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <Input
                    id="storeUrl"
                    type="url"
                    placeholder="https://yourstore.com"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    className="pl-11 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 h-12 rounded-xl font-poppins"
                    required
                  />
                </div>
                <p className="text-sm text-neutral-500 font-poppins tracking-tight">
                  I'll analyze your store to understand your products and brand
                </p>
              </div>

              {/* Data Source Toggle */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {useDummyData ? (
                      <Database className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Zap className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <Label
                        htmlFor="data-source"
                        className="text-neutral-900 font-medium font-poppins tracking-tight cursor-pointer"
                      >
                        {useDummyData ? "Use Dummy Data" : "Use Live Data"}
                      </Label>
                      <p className="text-sm text-neutral-600 font-poppins tracking-tight mt-1">
                        {useDummyData
                          ? "Demo with sample products for testing"
                          : "Scrape real data from your store (coming soon)"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="data-source"
                    checked={!useDummyData}
                    onCheckedChange={(checked) => setUseDummyData(!checked)}
                    className="flex-shrink-0"
                  />
                </div>
                {!useDummyData && (
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <p className="text-xs text-neutral-500 font-poppins tracking-tight flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      Live data scraping will be available soon
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 h-12 text-base rounded-xl font-poppins tracking-tight shadow-lg group transition-all"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 w-5 h-5 animate-spin" />
                    Analyzing your store...
                  </>
                ) : (
                  <>
                    Let's Build Your Agent
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Trust Indicators - emerald accents */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-600 font-poppins tracking-tight animate-fadeIn animation-delay-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>5 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>No coding required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
