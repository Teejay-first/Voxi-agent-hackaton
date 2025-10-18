"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, ShoppingBag, Star, ChevronRight } from "lucide-react"

interface CallInterfaceProps {
  agentName: string
  agentType: string
  onEndCall: () => void
}

interface Message {
  id: string
  speaker: "agent" | "user"
  text?: string
  genUI?: React.ReactNode
  timestamp: Date
}

// Mock product data for genUI
const yogaMats = [
  {
    id: 1,
    name: "Premium Cork Yoga Mat",
    price: "$89.99",
    rating: 4.8,
    image: "/cork-yoga-mat.jpg",
    features: ["Eco-friendly cork surface", "Non-slip grip", "6mm thickness"],
    description: "Natural cork provides excellent grip and antimicrobial properties. Perfect for hot yoga.",
  },
  {
    id: 2,
    name: "Ultra-Grip TPE Mat",
    price: "$64.99",
    rating: 4.6,
    image: "/tpe-yoga-mat.jpg",
    features: ["TPE material", "Extra cushioning", "Lightweight"],
    description: "Eco-friendly TPE material with superior cushioning for joint support during practice.",
  },
  {
    id: 3,
    name: "Travel Foldable Mat",
    price: "$49.99",
    rating: 4.5,
    image: "/foldable-yoga-mat.jpg",
    features: ["Foldable design", "Portable", "Machine washable"],
    description: "Perfect for yogis on the go. Folds into a compact size and fits in any bag.",
  },
]

function ProductCard({ product, onViewDetails }: { product: (typeof yogaMats)[0]; onViewDetails: () => void }) {
  return (
    <Card className="bg-white border border-neutral-200 rounded-[28px] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold font-poppins tracking-tight">{product.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-neutral-900 font-poppins tracking-tighter mb-1">{product.name}</h4>
        <p className="text-2xl font-bold text-emerald-600 font-poppins tracking-tighter mb-3">{product.price}</p>
        <div className="space-y-1 mb-4">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500" />
              <span className="text-xs text-neutral-600 font-poppins tracking-tight">{feature}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={onViewDetails}
          className="w-full bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 rounded-xl font-poppins tracking-tight font-semibold group-hover:shadow-md transition-all"
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  )
}

function ProductDetailModal({
  product,
  onClose,
}: {
  product: (typeof yogaMats)[0]
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <Card
        className="bg-white border border-neutral-200 rounded-[28px] max-w-2xl w-full overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div className="aspect-square bg-neutral-100 rounded-[20px] overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold font-poppins tracking-tight">{product.rating} / 5.0</span>
            </div>
            <h3 className="text-3xl font-bold text-neutral-900 font-poppins tracking-tighter mb-2">{product.name}</h3>
            <p className="text-4xl font-bold text-emerald-600 font-poppins tracking-tighter mb-4">{product.price}</p>
            <p className="text-neutral-600 font-poppins tracking-tight mb-6">{product.description}</p>
            <div className="space-y-2 mb-6">
              <h4 className="font-semibold text-neutral-900 font-poppins tracking-tight">Key Features:</h4>
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-neutral-700 font-poppins tracking-tight">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto space-y-3">
              <Button className="w-full bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 rounded-xl font-poppins tracking-tight font-semibold">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full rounded-xl font-poppins tracking-tight bg-transparent"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function CallInterface({ agentName, agentType, onEndCall }: CallInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<(typeof yogaMats)[0] | null>(null)

  useEffect(() => {
    const conversationFlow = [
      {
        speaker: "agent" as const,
        text: "Hello! I'm ShopBot Pro. How can I help you today?",
        delay: 1000,
      },
      {
        speaker: "user" as const,
        text: "Hi, what kind of yoga mats do you have?",
        delay: 2500,
      },
      {
        speaker: "agent" as const,
        text: "Great question! We have an excellent selection of yoga mats. Let me show you our top picks...",
        delay: 2000,
      },
      {
        speaker: "agent" as const,
        genUI: (
          <div className="space-y-3">
            <p className="text-sm font-poppins tracking-tight text-neutral-700 mb-4">
              Here are our most popular yoga mats:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {yogaMats.map((mat) => (
                <ProductCard key={mat.id} product={mat} onViewDetails={() => setSelectedProduct(mat)} />
              ))}
            </div>
          </div>
        ),
        delay: 2000,
      },
      {
        speaker: "agent" as const,
        text: "Each mat has unique features. Would you like to know more about any specific one?",
        delay: 1500,
      },
    ]

    let currentDelay = 0
    conversationFlow.forEach((item, index) => {
      currentDelay += item.delay
      setTimeout(() => {
        const newMessage: Message = {
          id: `msg-${index}`,
          speaker: item.speaker,
          text: item.text,
          genUI: item.genUI,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, newMessage])

        if (item.speaker === "agent") {
          setIsAgentSpeaking(true)
          setTimeout(() => setIsAgentSpeaking(false), 2000)
        }
      }, currentDelay)
    })
  }, [])

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <Card className="w-full max-w-4xl bg-white border-neutral-200/70 rounded-[28px] shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-400 to-green-400 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all ${isAgentSpeaking ? "scale-110 shadow-lg shadow-white/50 animate-pulse" : "scale-100"}`}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-poppins tracking-tighter">{agentName}</h2>
                  <p className="text-white/90 font-poppins tracking-tight text-sm">{agentType}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-white font-poppins tracking-tight text-sm font-semibold">
                  {formatDuration(callDuration)}
                </span>
              </div>
            </div>
          </div>

          {/* Conversation Transcript */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-neutral-50">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
                  </div>
                  <p className="text-neutral-500 font-poppins tracking-tight">Connecting to {agentName}...</p>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div key={message.id} className="animate-fadeInUp">
                {message.text && (
                  <div className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"} mb-2`}>
                    <div
                      className={`max-w-[70%] rounded-[20px] px-5 py-3 ${
                        message.speaker === "user"
                          ? "bg-gradient-to-r from-emerald-400 to-green-400 text-neutral-900"
                          : "bg-white border border-neutral-200 text-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.speaker === "agent" && <Sparkles className="w-3 h-3 text-emerald-600" />}
                        <span className="text-xs font-semibold font-poppins tracking-tight">
                          {message.speaker === "agent" ? agentName : "You"}
                        </span>
                      </div>
                      <p className="text-sm font-poppins tracking-tight leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                )}
                {message.genUI && <div className="ml-0">{message.genUI}</div>}
              </div>
            ))}
          </div>

          {/* Call Controls */}
          <div className="p-6 bg-white border-t border-neutral-200">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 p-0 border-2 transition-all ${
                  isMuted
                    ? "bg-red-500 border-red-500 hover:bg-red-600"
                    : "bg-white border-neutral-200 hover:bg-neutral-50"
                }`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-neutral-900" />}
              </Button>

              <Button
                size="lg"
                className="rounded-full w-16 h-16 p-0 bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-105"
                onClick={onEndCall}
              >
                <PhoneOff className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`rounded-full w-14 h-14 p-0 border-2 transition-all ${
                  !isSpeakerOn ? "bg-neutral-200 border-neutral-300" : "bg-white border-neutral-200 hover:bg-neutral-50"
                }`}
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              >
                {isSpeakerOn ? (
                  <Volume2 className="w-5 h-5 text-neutral-900" />
                ) : (
                  <VolumeX className="w-5 h-5 text-neutral-600" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-neutral-600 font-poppins tracking-tight">
              <span>{isMuted ? "Muted" : "Microphone On"}</span>
              <span>•</span>
              <span>{isSpeakerOn ? "Speaker On" : "Speaker Off"}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  )
}
