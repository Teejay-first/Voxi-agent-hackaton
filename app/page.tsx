import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Clock, Layers } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="relative mb-6 sm:mb-8 animate-scaleIn">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 shadow-2xl shadow-emerald-500/30" />
            <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-300 to-green-300 blur-xl opacity-40 animate-pulse" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-poppins font-bold text-neutral-900 mb-3 sm:mb-4 text-balance tracking-tighter leading-[0.9] animate-fadeInUp px-4">
            Meet Voxie.
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-600 mb-6 sm:mb-8 max-w-2xl text-balance font-poppins tracking-tight animate-fadeInUp animation-delay-100 px-4">
            Your AI agent creator. I'll help you build custom voice agents for your e-commerce store in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link href="/onboarding" className="animate-fadeInUp animation-delay-200 w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl font-poppins tracking-tight shadow-lg group transition-all"
              >
                Start Building
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/dashboard" className="animate-fadeInUp animation-delay-300 w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl font-poppins tracking-tight border-2 border-neutral-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all bg-transparent"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>

          
        </div>
      </div>
    </div>
  )
}
