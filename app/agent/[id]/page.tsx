"use client"

import type React from "react"
import { useState, use } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  Star,
  ChevronRight,
  Share2,
  Check,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Orb, type AgentState } from "@/components/ui/orb"

export const dynamic = "force-dynamic"

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

// Mock agent data
const agentData: Record<string, { name: string; type: string }> = {
  "1": { name: "ShopBot Pro", type: "E-commerce Voice Agent" },
  "2": { name: "Support Assistant", type: "Customer Support Agent" },
  "3": { name: "Product Advisor", type: "Product Recommendation Agent" },
}

const preBuiltMessages = [
  {
    id: "yoga-mats",
    text: "What kind of yoga mats do you have?",
    icon: "🧘",
  },
  {
    id: "best-sellers",
    text: "Show me your best sellers",
    icon: "⭐",
  },
  {
    id: "sizing-help",
    text: "I need help with sizing",
    icon: "📏",
  },
  {
    id: "return-policy",
    text: "What's your return policy?",
    icon: "↩️",
  },
]

function ProductCard({ product, onViewDetails }: { product: (typeof yogaMats)[0]; onViewDetails: () => void }) {
  return (
    <Card
      onClick={onViewDetails}
      className="bg-white border border-neutral-200 rounded-[28px] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
    >
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold font-poppins tracking-tight">{product.rating}</span>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h4 className="font-bold text-sm sm:text-base text-neutral-900 font-poppins tracking-tighter mb-1">
          {product.name}
        </h4>
        <p className="text-xl sm:text-2xl font-bold text-emerald-600 font-poppins tracking-tighter mb-2 sm:mb-3">
          {product.price}
        </p>
        <div className="space-y-1 mb-3 sm:mb-4">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-xs text-neutral-600 font-poppins tracking-tight">{feature}</span>
            </div>
          ))}
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails()
          }}
          className="w-full bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 rounded-xl font-poppins tracking-tight font-semibold group-hover:shadow-md transition-all text-xs sm:text-sm"
        >
          View Details
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </Button>
      </div>
    </Card>
  )
}

function ProductDetailView({ product, onClose }: { product: (typeof yogaMats)[0]; onClose: () => void }) {
  return (
    <Card className="bg-white border border-neutral-200 rounded-[28px] overflow-hidden animate-scaleIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        <div className="aspect-square bg-neutral-100 rounded-[20px] overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm font-semibold font-poppins tracking-tight">{product.rating} / 5.0</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-poppins tracking-tighter mb-2">
            {product.name}
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-emerald-600 font-poppins tracking-tight mb-3 sm:mb-4">
            {product.price}
          </p>
          <p className="text-sm sm:text-base text-neutral-600 font-poppins tracking-tight mb-4 sm:mb-6">
            {product.description}
          </p>
          <div className="space-y-2 mb-4 sm:mb-6">
            <h4 className="font-semibold text-sm sm:text-base text-neutral-900 font-poppins tracking-tight">
              Key Features:
            </h4>
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-neutral-700 font-poppins tracking-tight">{feature}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto space-y-2 sm:space-y-3">
            <Button className="w-full bg-gradient-to-r from-emerald-400 to-green-400 hover:from-emerald-500 hover:to-green-500 text-neutral-900 rounded-xl font-poppins tracking-tight font-semibold text-sm sm:text-base">
              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full rounded-xl font-poppins tracking-tight bg-transparent text-sm sm:text-base"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function AgentTestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const agent = agentData[id] || { name: "Agent", type: "AI Agent" }

  const [messages, setMessages] = useState<Message[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [agentState, setAgentState] = useState<AgentState>(null)
  const [selectedProduct, setSelectedProduct] = useState<(typeof yogaMats)[0] | null>(null)
  const [conversationStarted, setConversationStarted] = useState(false)
  const [shareClicked, setShareClicked] = useState(false)

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      setShareClicked(true)
      setTimeout(() => setShareClicked(false), 2000)
    }
  }

  const handlePreBuiltMessage = (messageId: string, messageText: string) => {
    console.log("[v0] Pre-built message clicked:", messageId, messageText)
    setConversationStarted(true)

    // Add initial agent greeting
    const greetingMessage: Message = {
      id: "msg-greeting",
      speaker: "agent",
      text: "Hello! I'm ShopBot Pro. How can I help you today?",
      timestamp: new Date(),
    }
    setMessages([greetingMessage])
    setAgentState("talking")
    setTimeout(() => setAgentState(null), 2000)

    // Add user message after a delay
    setTimeout(() => {
      const userMessage: Message = {
        id: `msg-user-${Date.now()}`,
        speaker: "user",
        text: messageText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      console.log("[v0] User message added")

      // Trigger appropriate agent response based on message ID
      if (messageId === "yoga-mats") {
        console.log("[v0] Yoga mats flow triggered")
        // Yoga mats flow
        setTimeout(() => {
          const agentResponse: Message = {
            id: `msg-agent-${Date.now()}`,
            speaker: "agent",
            text: "Great question! We have an excellent selection of yoga mats. Let me show you our top picks...",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, agentResponse])
          setAgentState("talking")
          setTimeout(() => setAgentState(null), 2000)
          console.log("[v0] Agent response added")

          // Show product cards
          setTimeout(() => {
            console.log("[v0] Adding product cards genUI")
            const productsMessage: Message = {
              id: `msg-products-${Date.now()}`,
              speaker: "agent",
              genUI: (
                <div className="space-y-3">
                  <p className="text-sm font-poppins tracking-tight text-neutral-700 mb-4 sm:mb-6">
                    Here are our most popular yoga mats:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {yogaMats.map((mat) => (
                      <ProductCard key={mat.id} product={mat} onViewDetails={() => setSelectedProduct(mat)} />
                    ))}
                  </div>
                </div>
              ),
              timestamp: new Date(),
            }
            setMessages((prev) => {
              console.log("[v0] Messages before adding products:", prev.length)
              const newMessages = [...prev, productsMessage]
              console.log("[v0] Messages after adding products:", newMessages.length)
              return newMessages
            })

            // Final message
            setTimeout(() => {
              const finalMessage: Message = {
                id: `msg-final-${Date.now()}`,
                speaker: "agent",
                text: "Each mat has unique features. Would you like to know more about any specific one?",
                timestamp: new Date(),
              }
              setMessages((prev) => [...prev, finalMessage])
              setAgentState("talking")
              setTimeout(() => setAgentState(null), 2000)
              console.log("[v0] Final message added")
            }, 2000)
          }, 2000)
        }, 1500)
      } else {
        // Generic response for other messages
        setTimeout(() => {
          const agentResponse: Message = {
            id: `msg-agent-${Date.now()}`,
            speaker: "agent",
            text: "I understand you're interested in that. Let me help you with more information...",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, agentResponse])
          setAgentState("talking")
          setTimeout(() => setAgentState(null), 2000)
        }, 1500)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="rounded-xl font-poppins tracking-tight text-xs sm:text-sm p-2 sm:px-3"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="h-4 sm:h-6 w-px bg-neutral-200" />
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 relative flex-shrink-0">
                  <div className="absolute inset-0 bg-muted rounded-full p-0.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
                    <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)]">
                      <Orb colors={["#34D399", "#10B981"]} seed={1000} agentState={agentState} />
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-lg font-bold text-neutral-900 font-poppins tracking-tight truncate">
                    {agent.name}
                  </h1>
                  <p className="text-xs text-neutral-600 font-poppins tracking-tight truncate hidden sm:block">
                    {agent.type}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className={`rounded-xl font-poppins tracking-tight transition-all text-xs sm:text-sm px-2 sm:px-3 ${
                  shareClicked ? "bg-emerald-500 text-white border-emerald-500" : ""
                }`}
              >
                {shareClicked ? (
                  <>
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 border-2 transition-all ${
                  isMuted
                    ? "bg-red-500 border-red-500 hover:bg-red-600"
                    : "bg-white border-neutral-200 hover:bg-neutral-50"
                }`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 border-2 transition-all ${
                  !isSpeakerOn ? "bg-neutral-200 border-neutral-300" : "bg-white border-neutral-200 hover:bg-neutral-50"
                }`}
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              >
                {isSpeakerOn ? (
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-900" />
                ) : (
                  <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="space-y-4 sm:space-y-6 mb-20 sm:mb-24">
          {!conversationStarted && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-2xl px-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 relative">
                  <div className="absolute inset-0 bg-muted rounded-full p-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]">
                    <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)]">
                      <Orb colors={["#34D399", "#10B981"]} seed={1000} agentState={agentState} />
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 font-poppins tracking-tighter mb-2 sm:mb-3">
                  Ready to help you
                </h2>
                <p className="text-sm sm:text-base text-neutral-600 font-poppins tracking-tight mb-6 sm:mb-8">
                  Choose a question to start the conversation with {agent.name}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {preBuiltMessages.map((message) => (
                    <Card
                      key={message.id}
                      onClick={() => handlePreBuiltMessage(message.id, message.text)}
                      className="bg-white border border-neutral-200 rounded-[28px] p-4 sm:p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="text-2xl sm:text-3xl flex-shrink-0">{message.icon}</div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-neutral-900 font-poppins tracking-tight group-hover:text-emerald-600 transition-colors">
                            {message.text}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {conversationStarted &&
            messages.map((message) => (
              <div key={message.id} className="animate-fadeInUp">
                {message.text && (
                  <div className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"} mb-3 sm:mb-4`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-[20px] px-4 sm:px-6 py-3 sm:py-4 ${
                        message.speaker === "user"
                          ? "bg-gradient-to-r from-emerald-400 to-green-400 text-neutral-900"
                          : "bg-white border border-neutral-200 text-neutral-900 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        {message.speaker === "agent" && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />}
                        <span className="text-xs font-semibold font-poppins tracking-tight">
                          {message.speaker === "agent" ? agent.name : "You"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-poppins tracking-tight leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                )}
                {message.genUI && <div className="ml-0">{message.genUI}</div>}
              </div>
            ))}

          {selectedProduct && (
            <div className="animate-fadeInUp">
              <ProductDetailView product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg">
        <div className="container mx-auto px-4 py-3 sm:py-4 max-w-5xl">
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-600 font-poppins tracking-tight">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isMuted ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}
              />
              <span className="hidden sm:inline">{isMuted ? "Microphone Muted" : "Voice Active"}</span>
              <span className="sm:hidden">{isMuted ? "Muted" : "Active"}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isSpeakerOn ? "bg-emerald-500" : "bg-neutral-400"}`}
              />
              <span className="hidden sm:inline">{isSpeakerOn ? "Speaker On" : "Speaker Off"}</span>
              <span className="sm:hidden">{isSpeakerOn ? "On" : "Off"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
