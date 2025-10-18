"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Presentation, ChevronLeft, ChevronRight, X } from "lucide-react"

// Demo slides with actual generated images
const slides = [
  {
    id: 1,
    title: "System Architecture",
    content: "Hackathon Warsaw (VoxHive) - E-commerce voice agent creator",
    image: "/slide-1.png",
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
        <DialogContent className="max-w-screen h-screen w-screen p-0 m-0 bg-black border-none rounded-none overflow-hidden flex flex-col">
          {/* Accessible Title for Screen Readers */}
          <DialogTitle className="sr-only">
            {slides[currentSlide].title} - Slide {currentSlide + 1} of {slides.length}
          </DialogTitle>

          {/* Header with Close Button */}
          <div className="absolute top-0 right-0 z-10 p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-neutral-300 transition-colors"
              aria-label="Close slides"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Slide Content - Full Screen */}
          <div className="flex-1 flex items-center justify-center bg-black overflow-hidden relative">
            <img
              src={slides[currentSlide].image || "/placeholder.svg"}
              alt={slides[currentSlide].title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Navigation Controls - Overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent flex items-center justify-between">
            <Button onClick={prevSlide} className="rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20">
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
                    index === currentSlide ? "w-8 bg-emerald-500" : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Slide Info - Top left */}
          <div className="absolute top-20 left-6 text-white">
            <h3 className="text-xl font-semibold mb-1">{slides[currentSlide].title}</h3>
            <p className="text-sm text-neutral-300">{slides[currentSlide].content}</p>
            <p className="text-xs text-neutral-500 mt-2">
              {currentSlide + 1} / {slides.length}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
