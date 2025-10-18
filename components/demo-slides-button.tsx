"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Presentation, ChevronLeft, ChevronRight } from "lucide-react"

// Demo slides with actual generated images
const slides = [
  {
    id: 1,
    title: "Welcome to Voxie",
    content: "AI-powered voice agents for e-commerce",
    image: "/presentation-slide-welcome-voxie.jpg",
  },
  {
    id: 2,
    title: "Onboarding Flow",
    content: "Simple store URL input to get started",
    image: "/onboarding-flow-diagram.jpg",
  },
  {
    id: 3,
    title: "Agent Creation",
    content: "Voxie builds your custom agent automatically",
    image: "/agent-creation-process.jpg",
  },
  {
    id: 4,
    title: "Dashboard",
    content: "Manage and monitor all your agents",
    image: "/general-dashboard-interface.png",
  },
  {
    id: 5,
    title: "Voice Interaction",
    content: "Test agents with voice-first interface",
    image: "/voice-interaction-interface.jpg",
  },
  {
    id: 6,
    title: "Deployment Options",
    content: "Widget, phone bot, or API integration",
    image: "/deployment-options.jpg",
  },
]

export function DemoSlidesButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 p-0"
        aria-label="View demo slides"
      >
        <Presentation className="h-6 w-6 text-white" />
      </Button>

      {/* Slides Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl h-[95vh] p-0 bg-white border-neutral-200 rounded-[28px] overflow-hidden">
          <DialogHeader className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold text-neutral-900">Demo Slides</DialogTitle>
              <span className="text-sm text-neutral-600">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </DialogHeader>

          {/* Slide Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50 overflow-auto">
            <div className="w-full bg-white rounded-[28px] shadow-lg overflow-hidden">
              <img
                src={slides[currentSlide].image || "/placeholder.svg"}
                alt={slides[currentSlide].title}
                className="w-full h-auto object-contain"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-neutral-900 mb-2">{slides[currentSlide].title}</h3>
                <p className="text-neutral-600">{slides[currentSlide].content}</p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="p-6 border-t border-neutral-200 flex items-center justify-between bg-white">
            <Button onClick={prevSlide} className="rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900">
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? "w-8 bg-emerald-500" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
