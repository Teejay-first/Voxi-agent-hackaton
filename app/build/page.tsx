"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Check, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

const buildSteps = [
  { id: 1, label: "Analyzing store data", duration: 2000 },
  { id: 2, label: "Learning product catalog", duration: 2500 },
  { id: 3, label: "Understanding brand voice", duration: 2000 },
  { id: 4, label: "Training conversation flows", duration: 2500 },
  { id: 5, label: "Configuring agent personality", duration: 2000 },
  { id: 6, label: "Finalizing your agent", duration: 1500 },
]

function BuildPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [productCount, setProductCount] = useState(0)
  const [buildError, setBuildError] = useState<string | null>(null)

  const storeUrl = searchParams.get("storeUrl")
  const useDummyData = searchParams.get("useDummyData") === "true"

  useEffect(() => {
    const runBuildSteps = async () => {
      // Step 2 is the product catalog learning step
      if (currentStep === 1 && !useDummyData && storeUrl) {
        try {
          console.log("[Voxi] Fetching products from Firecrawl for URL:", storeUrl)

          // Call Firecrawl API to scrape products
          const firecrawlResponse = await fetch("/api/scrape-products-bulk", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              urls: [storeUrl],
            }),
          })

          if (!firecrawlResponse.ok) {
            const errorData = await firecrawlResponse.json()
            throw new Error(errorData.error || "Failed to scrape products")
          }

          const firecrawlData = await firecrawlResponse.json()
          console.log("[Voxi] Firecrawl response:", firecrawlData)

          if (firecrawlData.products && firecrawlData.products.length > 0) {
            // Save products to Supabase
            const saveResponse = await fetch("/api/products/save", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                products: firecrawlData.products,
              }),
            })

            if (!saveResponse.ok) {
              const saveErrorData = await saveResponse.json()
              throw new Error(saveErrorData.error || "Failed to save products")
            }

            const saveData = await saveResponse.json()
            console.log("[Voxi] Products saved:", saveData)
            setProductCount(saveData.savedCount)

            if (saveData.errors && saveData.errors.length > 0) {
              console.warn("[Voxi] Some products had errors:", saveData.errors)
            }
          } else {
            console.warn("[Voxi] No products returned from Firecrawl")
            setBuildError("No products found on the store. Using demo products instead.")
            setProductCount(3) // Default demo products
          }
        } catch (error) {
          console.error("[Voxi] Error during product scraping:", error)
          setBuildError(
            error instanceof Error
              ? error.message
              : "Failed to fetch products from store. Using demo products instead."
          )
          setProductCount(3) // Fallback to demo products
        }
      }

      // Continue to next step
      if (currentStep < buildSteps.length) {
        const timer = setTimeout(() => {
          setCurrentStep(currentStep + 1)
          setProgress(((currentStep + 1) / buildSteps.length) * 100)
        }, buildSteps[currentStep].duration)

        return () => clearTimeout(timer)
      } else {
        setIsComplete(true)
      }
    }

    runBuildSteps()
  }, [currentStep, useDummyData, storeUrl])

  const handleContinue = () => {
    router.push("/dashboard")
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Success Animation - emerald gradient */}
            <div className="relative mb-8 animate-scaleIn">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
                <Check className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-300 to-green-300 blur-xl opacity-40 animate-pulse" />
            </div>

            {/* Success Message - white card */}
            <div className="bg-white border border-neutral-200/70 rounded-[28px] p-8 max-w-2xl w-full text-center shadow-2xl animate-fadeInUp animation-delay-100">
              <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4 font-poppins tracking-tighter">
                Your Agent is Ready!
              </h1>
              <p className="text-neutral-600 text-base sm:text-lg mb-8 leading-relaxed font-poppins tracking-tight">
                Meet <span className="text-emerald-600 font-semibold">ShopBot Pro</span> - your new AI-powered sales
                assistant. I've trained it on your product catalog and optimized it for customer conversations.
              </p>

              {/* Agent Preview Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-neutral-900 font-poppins tracking-tight">ShopBot Pro</h3>
                    <p className="text-neutral-600 text-sm font-poppins tracking-tight">E-commerce Voice Agent</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600 font-poppins">
                      {productCount || 247}
                    </div>
                    <div className="text-xs text-neutral-500 font-poppins tracking-tight">Products Learned</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600 font-poppins">12</div>
                    <div className="text-xs text-neutral-500 font-poppins tracking-tight">Conversation Flows</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600 font-poppins">5</div>
                    <div className="text-xs text-neutral-500 font-poppins tracking-tight">Languages</div>
                  </div>
                </div>
              </div>

              {buildError && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-amber-800 font-poppins tracking-tight">{buildError}</p>
                </div>
              )}

              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 h-12 text-base rounded-xl font-poppins tracking-tight shadow-lg transition-all"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          {/* Voxie Working Animation */}
          <div className="relative mb-12 animate-scaleIn">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 animate-pulse shadow-2xl shadow-emerald-500/30" />
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-300 to-green-300 blur-xl opacity-40 animate-pulse" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white animate-spin" />

            {/* Small agent orb being created */}
            <div className="absolute -right-8 top-8 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 opacity-50 animate-pulse" />
          </div>

          {/* Build Progress Card - white card */}
          <div className="bg-white border border-neutral-200/70 rounded-[28px] p-8 max-w-2xl w-full shadow-2xl animate-fadeInUp animation-delay-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 font-poppins tracking-tighter">
                  Building Your Agent
                </h2>
                <p className="text-neutral-600 font-poppins tracking-tight">
                  I'm creating a custom AI agent tailored to your store. This will just take a moment...
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <Progress value={progress} className="h-2 mb-2" />
              <div className="flex justify-between text-sm text-neutral-500 font-poppins tracking-tight">
                <span>
                  Step {currentStep} of {buildSteps.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Build Steps */}
            <div className="space-y-3">
              {buildSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    index < currentStep
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : index === currentStep
                        ? "bg-emerald-500/10 border border-emerald-500/30"
                        : "bg-neutral-50 border border-neutral-200"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index < currentStep
                        ? "bg-emerald-500"
                        : index === currentStep
                          ? "bg-emerald-500"
                          : "bg-neutral-300"
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : index === currentStep ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <span className="text-xs text-neutral-600 font-poppins">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-poppins tracking-tight ${index <= currentStep ? "text-neutral-900 font-medium" : "text-neutral-500"}`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BuildPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuildPageContent />
    </Suspense>
  )
}
