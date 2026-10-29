"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Mic,
  MicOff,
  Bot,
  User,
  Volume2,
  MessageSquare,
  ImageUp,
  Send,
  Leaf,
  Globe,
} from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface Message {
  role: "user" | "ai"
  text: string
  timestamp?: string
}

const AGRI_SYSTEM_PROMPT = `You are AgriSathi, an expert AI agricultural assistant specifically trained for farmers across India and South Asia.

Your knowledge base covers:
- Crop diseases, pest identification & organic/chemical control measures
- Soil health, NPK fertilization, micronutrients & soil testing
- Irrigation techniques: drip, sprinkler, flood & rainwater harvesting
- Seed selection, sowing seasons, crop rotation & intercropping
- Government schemes: PM-KISAN, Kisan Credit Card, crop insurance (PMFBY), MSP
- Market prices, mandi rates, e-NAM platform guidance
- Organic farming, natural pest control & sustainable agriculture
- Weather & climate-smart farming practices
- Post-harvest storage, value addition & agri-entrepreneurship
- Livestock integration, dairy, poultry & fisheries
- Horticulture: fruits, vegetables, spices & floriculture

Communication rules:
- ALWAYS respond in the SAME language the user writes in (Kannada→Kannada, Hindi→Hindi, Tamil→Tamil, Telugu→Telugu, Marathi→Marathi, Bengali→Bengali, English→English, etc.)
- Never use markdown formatting like ** or * — respond in plain text only (optimized for voice TTS)
- Be warm, respectful and encouraging like a trusted village elder who is also a scientist
- Keep answers concise (3–5 sentences), practical and immediately actionable
- Always mention specific product names, dosages, or scheme names when relevant
- If unsure about local conditions, ask one clarifying question`

export default function NammaKrishiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Namaste! I am AgriSathi — your 24/7 AI farming expert. You can type or speak your farming question in any language: Kannada, Hindi, English, Tamil, Telugu, Marathi, Bengali and more. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [inputText, setInputText] = useState("")
  const [language, setLanguage] = useState("auto")

  const recognitionRef = useRef<any>(null)
  const transcriptBuffer = useRef("")
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isProcessing])

  useEffect(() => {
    synthRef.current = window.speechSynthesis

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = language === "kn" ? "kn-IN" : language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : language === "te" ? "te-IN" : "en-IN"

      recognition.onresult = (event: any) => {
        let currentTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript
        }
        setTranscript(currentTranscript)
        transcriptBuffer.current = currentTranscript
      }

      recognition.onend = () => {
        setIsListening(false)
        if (transcriptBuffer.current.trim().length > 0) {
          handleUserSubmit(transcriptBuffer.current)
        }
        setTranscript("")
        transcriptBuffer.current = ""
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [language])

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      synthRef.current?.cancel()
      setTranscript("")
      transcriptBuffer.current = ""
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (e) {
        console.warn("Speech API error", e)
      }
    }
  }

  const handleTextSubmit = () => {
    const text = inputText.trim()
    if (!text || isProcessing) return
    setInputText("")
    handleUserSubmit(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleTextSubmit()
    }
  }

  const handleUserSubmit = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsProcessing(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyCpMNsUnsGyvnWTrCauXkt_yj8cXI6tGTc"
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const fullPrompt = `${AGRI_SYSTEM_PROMPT}

User message: "${text}"`

      const result = await model.generateContent(fullPrompt)
      const response = await result.response
      const aiResponse =
        response
          .text()
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .replace(/#+\s/g, "")
          .trim() || "Sorry, I could not process your request. Please try again."

      const aiMsg: Message = {
        role: "ai",
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiMsg])
      speakOutLoud(aiResponse)
    } catch (error) {
      console.warn("Gemini API failed. Using fallback.", error)
      const fallback = getFallbackResponse(text)
      const aiMsg: Message = {
        role: "ai",
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiMsg])
      speakOutLoud(fallback)
    }

    setIsProcessing(false)
  }

  const getFallbackResponse = (text: string): string => {
    const t = text.toLowerCase()
    // Kannada keywords
    if (t.includes("ಟೊಮೇಟೊ") || (t.includes("tomato") && t.includes("ಎಲೆ")))
      return "ನಿಮ್ಮ ಟೊಮೇಟೊ ಗಿಡಗಳಿಗೆ ಎಲೆ ಸುರುಳಿ ರೋಗ ಇರಬಹುದು. ಬೇವಿನ ಎಣ್ಣೆ 5ml ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಮಿಶ್ರಮಾಡಿ ಸಿಂಪಡಿಸಿ. ರೋಗಗ್ರಸ್ತ ಗಿಡಗಳನ್ನು ಕಿತ್ತು ಸುಡಿ."
    if (t.includes("ಭತ್ತ") || t.includes("ಅಕ್ಕಿ"))
      return "ಭತ್ತದಲ್ಲಿ ಹಳದಿ ಬಣ್ಣ ಕಂಡರೆ ಸಾರಜನಕದ ಕೊರತೆ ಇರಬಹುದು. ಒಂದು ಎಕರೆಗೆ 25 ಕೆಜಿ ಯೂರಿಯಾ ನೀಡಿ. ನೀರಿನ ಮಟ್ಟ ಸರಿಯಾಗಿ ನಿರ್ವಹಿಸಿ."
    // Hindi keywords
    if (t.includes("टमाटर") || t.includes("tomato"))
      return "आपके टमाटर में लीफ कर्ल वायरस हो सकता है जो सफेद मक्खियों से फैलता है। नीम तेल 5ml प्रति लीटर पानी में मिलाकर स्प्रे करें। बीमार पौधों को तुरंत हटा दें।"
    if (t.includes("धान") || t.includes("rice") || t.includes("paddy"))
      return "धान में पीलापन नाइट्रोजन की कमी का संकेत हो सकता है। प्रति एकड़ 25 किलो यूरिया डालें। स्टेम बोरर के लिए क्लोरेंट्रानिलिप्रोल स्प्रे करें।"
    // General English fallback
    if (t.includes("fertilizer") || t.includes("manure"))
      return "For balanced nutrition, apply NPK 19:19:19 at 5g per litre as a foliar spray. Supplement with organic compost at 2–3 tonnes per acre. Soil testing every 3 years is highly recommended for best results."
    if (t.includes("pest") || t.includes("insect") || t.includes("bug"))
      return "For general pest control, start with Neem oil (5ml/L) as a safe organic option. For heavy infestations, use Chlorpyrifos 20EC at 2ml per litre. Always spray in the early morning or evening to protect beneficial insects."
    if (t.includes("water") || t.includes("irrigation") || t.includes("drought"))
      return "Drip irrigation saves up to 50% water compared to flood irrigation. Mulching with dry leaves or straw around plants reduces soil water evaporation by 30%. Under PM-KISAN scheme you may get subsidy for drip systems — contact your local agriculture office."
    if (t.includes("weather") || t.includes("rain") || t.includes("climate"))
      return "Monitor IMD weather forecasts daily on the Meghdoot app (free on Android). Avoid spraying pesticides 24 hours before expected rain. Consider raised-bed farming to protect against waterlogging in heavy-rain seasons."
    return "Thank you for your question. For the most accurate and localised advice, please contact your nearest Krishi Vigyan Kendra (KVK) or call the Kisan Call Centre at 1800-180-1551 (free, available in all Indian languages)."
  }

  const speakOutLoud = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang =
        language === "kn" ? "kn-IN" :
        language === "hi" ? "hi-IN" :
        language === "ta" ? "ta-IN" :
        language === "te" ? "te-IN" : "en-IN"
      const voices = synthRef.current.getVoices()
      const preferred = voices.find((v) => v.lang.startsWith(utterance.lang.split("-")[0]))
      if (preferred) utterance.voice = preferred
      synthRef.current.speak(utterance)
    }
  }

  const sendSMS = () => {
    const lastAi = messages.filter((m) => m.role === "ai").pop()?.text || "AgriSathi Report"
    const body = encodeURIComponent(`AgriSathi Report:\n\n${lastAi}`)
    window.open(`sms:+918217469646?body=${body}`, "_self")
  }

  const langOptions = [
    { code: "auto", label: "Auto" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "hi", label: "हिन्दी" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
    { code: "en", label: "English" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef7ec] to-[#f3f7f0] font-sans flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow max-w-4xl flex flex-col gap-4">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e5631] to-[#2e6f40] rounded-3xl p-5 text-white shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur p-3 rounded-2xl shadow-inner">
                <Leaf className="w-8 h-8 text-emerald-200" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AgriSathi AI</h1>
                <p className="text-emerald-200 text-sm mt-0.5">
                  🌾 Ask in any language — Instant farming expert advice
                </p>
              </div>
            </div>

            {/* Language selector */}
            <div className="flex gap-1.5 flex-wrap">
              {langOptions.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    language === l.code
                      ? "bg-white text-[#1e5631] shadow-md scale-105"
                      : "text-emerald-100 hover:bg-white/15 border border-white/20"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Crop Disease", "Fertilizers", "Pest Control", "Irrigation", "Govt Schemes", "Market Price", "Organic Farming", "Soil Health"].map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setInputText(topic + " — ")
                  textareaRef.current?.focus()
                }}
                className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-emerald-100 transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <Card className="flex-grow bg-white border-none shadow-xl rounded-3xl overflow-hidden flex flex-col">
          {/* Messages */}
          <div
            className="flex-grow p-5 overflow-y-auto flex flex-col gap-5"
            style={{ minHeight: "400px", maxHeight: "55vh" }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse ml-auto max-w-[80%]" : "max-w-[85%]"}`}
              >
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                    m.role === "user"
                      ? "bg-[#1e5631] text-white"
                      : "bg-[#edf5ee] text-[#2e6f40] border border-[#c3ddc8]"
                  }`}
                >
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className="flex flex-col gap-1">
                  <div
                    className={`p-4 rounded-2xl text-[14.5px] leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-[#1e5631] text-white rounded-tr-sm"
                        : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.timestamp && (
                    <span className={`text-[11px] text-slate-400 ${m.role === "user" ? "text-right" : ""}`}>
                      {m.timestamp}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Processing / Listening indicator */}
            {(isProcessing || isListening) && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[#edf5ee] text-[#2e6f40] border border-[#c3ddc8]">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 text-slate-500 flex items-center gap-3 text-sm">
                  {isListening ? (
                    <>
                      <span className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${d * 100}ms` }}
                          />
                        ))}
                      </span>
                      <span className="italic">Listening: {transcript || "..."}</span>
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 border-2 border-[#2e6f40] border-t-transparent rounded-full animate-spin" />
                      <span className="italic">Consulting agricultural data...</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-col gap-3">
              {/* Text input row */}
              <div className="flex gap-2 items-end bg-white rounded-2xl border border-slate-200 shadow-sm p-2 focus-within:border-[#2e6f40] transition-colors">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="Type your farming question in any language... (Kannada, Hindi, Tamil, English, etc.)"
                  disabled={isProcessing || isListening}
                  className="flex-grow resize-none bg-transparent text-slate-800 placeholder-slate-400 text-sm leading-relaxed focus:outline-none px-2 py-1 disabled:opacity-60"
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!inputText.trim() || isProcessing || isListening}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1e5631] hover:bg-[#2e6f40] text-white flex items-center justify-center shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2">
                  {/* Voice button */}
                  <button
                    onClick={toggleListen}
                    disabled={isProcessing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-50 ${
                      isListening
                        ? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                        : "bg-[#edf5ee] text-[#1e5631] hover:bg-[#d0ecda] border border-[#c3ddc8]"
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? "Stop" : "Voice Input"}
                  </button>

                  {/* SMS button */}
                  <button
                    onClick={sendSMS}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-[#1e5631] border border-[#c3ddc8] hover:bg-[#edf5ee] shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </button>

                  <button
                    onClick={() => alert("Crop Photo upload — available in Pro mode.")}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-[#1e5631] border border-[#c3ddc8] hover:bg-[#edf5ee] shadow-sm transition-all"
                  >
                    <ImageUp className="w-4 h-4" />
                    Crop Photo
                  </button>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Multilingual • Voice • Text
                  <Volume2 className="w-3.5 h-3.5 ml-1" />
                  Auto TTS
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Info footer strip */}
        <div className="text-center text-xs text-slate-500 pb-2">
          AgriSathi uses Google Gemini AI trained on agriculture data • Kisan Helpline: <strong>1800-180-1551</strong>
        </div>
      </main>
    </div>
  )
}
