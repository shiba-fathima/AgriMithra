"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Mic,
  MicOff,
  Bot,
  User,
  Volume2,
  VolumeX,
  MessageSquare,
  ImageUp,
  Send,
  Leaf,
  Globe,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Square,
} from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface Message {
  role: "user" | "ai"
  text: string
  timestamp?: string
  langCode?: string
}

interface LanguageMeta {
  code: string
  label: string
  name: string
  speechLang: string
  welcome: string
  placeholder: string
  topics: string[]
}

const LANGUAGES: Record<string, LanguageMeta> = {
  auto: {
    code: "auto",
    label: "Auto",
    name: "Auto Detect",
    speechLang: "en-IN",
    welcome:
      "Namaste! I am AgriSathi — your 24/7 AI agricultural assistant. Select your preferred language above, or ask your question in any language: Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali, or English. How can I help your farm today?",
    placeholder: "Type or speak your farming question in any language...",
    topics: [
      "Crop Disease & Pests",
      "Fertilizer & NPK",
      "Drip Irrigation",
      "PM-KISAN Scheme",
      "Mandi Market Rates",
      "Organic Farming",
      "Soil Health",
    ],
  },
  kn: {
    code: "kn",
    label: "ಕನ್ನಡ",
    name: "Kannada",
    speechLang: "kn-IN",
    welcome:
      "ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಸಾಥಿ — ನಿಮ್ಮ 24/7 ಡಿಜಿಟಲ್ ಕೃಷಿ AI ತಜ್ಞ. ಬೆಳೆ ರೋಗ, ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ, ಕೀಟ ನಿಯಂತ್ರಣ, ನೀರಾವರಿ ಅಥವಾ ಸರ್ಕಾರದ ಯೋಜನೆಗಳ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ.",
    placeholder: "ಕನ್ನಡದಲ್ಲಿ ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಧ್ವನಿ ಮೂಲಕ ಮಾತನಾಡಿ...",
    topics: [
      "ಟೊಮೇಟೊ ಎಲೆ ಸುರುಳಿ ರೋಗ",
      "ಭತ್ತದ ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು",
      "NPK ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ",
      "ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿ",
      "ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
      "ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ",
    ],
  },
  hi: {
    code: "hi",
    label: "हिन्दी",
    name: "Hindi",
    speechLang: "hi-IN",
    welcome:
      "नमस्ते! मैं एग्रीसाथी हूँ — आपका 24/7 कृषि AI विशेषज्ञ। फसल में लगने वाले रोग, खाद व कीटनाशक की सही मात्रा, सिंचाई या सरकारी योजनाओं के बारे में अपना सवाल हिन्दी में पूछें।",
    placeholder: "हिन्दी में अपना कृषि संबंधी प्रश्न लिखें या बोलें...",
    topics: [
      "टमाटर लीफ कर्ल रोग",
      "धान में तना छेदक कीट",
      "यूरिया और डीएपी मात्रा",
      "ड्रिप सिंचाई सब्सिडी",
      "पीएम किसान सम्मान निधि",
      "मंडी भाव की जानकारी",
    ],
  },
  ta: {
    code: "ta",
    label: "தமிழ்",
    name: "Tamil",
    speechLang: "ta-IN",
    welcome:
      "வணக்கம்! நான் அக்ரிசாதி — உங்கள் 24/7 விவசாய AI ஆலோசகர். பயிர் நோய்கள், பூச்சி கட்டுப்பாடு, உர மேலாண்மை, அல்லது அரசு மானியங்கள் குறித்த உங்கள் கேள்விகளை தமிழில் கேளுங்கள்.",
    placeholder: "தமிழில் உங்கள் விவசாய கேள்வியை தட்டச்சு செய்யவும் அல்லது பேசவும்...",
    topics: [
      "தக்காளி இலைச்சுருள் நோய்",
      "நெல் தண்டு துளைப்பான்",
      "இயற்கை பூச்சி விரட்டி",
      "சொட்டு நீர் பாசனம்",
      "உழவர் பாதுகாப்பு திட்டம்",
      "சந்தை விலை நிலவரம்",
    ],
  },
  te: {
    code: "te",
    label: "తెలుగు",
    name: "Telugu",
    speechLang: "te-IN",
    welcome:
      "నమస్కారం! నేను అగ్రిసాథి — మీ 24/7 వ్యవసాయ AI సహాయకుడిని. పంట తెగుళ్లు, ఎరువుల వాడకం, నీటిపారుదల లేదా ప్రభుత్వ పథకాల గురించి మీ సందేహాలను తెలుగులో అడగండి.",
    placeholder: "తెలుగులో మీ వ్యవసాయ ప్రశ్నను టైప్ చేయండి లేదా మాట్లాడండి...",
    topics: [
      "టమాటా ఆకు ముడుత తెగులు",
      "వరి కాండం తొలిచే పురుగు",
      "సేంద్రీయ ఎరువుల వాడకం",
      "బిందు సేద్యం రాయితీ",
      "రైతు భరోసా పథకం",
      "మార్కెట్ ధరలు",
    ],
  },
  ml: {
    code: "ml",
    label: "മലയാളം",
    name: "Malayalam",
    speechLang: "ml-IN",
    welcome:
      "നമസ്കാരം! ഞാൻ അഗ്രിസാഥി — നിങ്ങളുടെ 24/7 കാർഷിക AI സഹായി. വിള രോഗങ്ങൾ, കീടനിയന്ത്രണം, വളപ്രയോഗം, അല്ലെങ്കിൽ കാർഷിക സബ്സിഡികൾ എന്നിവയെക്കുറിച്ച് മലയാളത്തിൽ ചോദിക്കൂ.",
    placeholder: "മലയാളത്തിൽ നിങ്ങളുടെ കാർഷിക സംശയം ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...",
    topics: [
      "തെങ്ങിന്റെ മണ്ഡരി ബാധ",
      "നെല്ലിലെ കീടബാധ",
      "ജൈവ വളങ്ങൾ",
      "തുള്ളി നന സബ്സിഡി",
      "കിസാൻ ക്രഡിറ്റ് കാർഡ്",
      "വിപണി വില വിവരങ്ങൾ",
    ],
  },
  mr: {
    code: "mr",
    label: "मराठी",
    name: "Marathi",
    speechLang: "mr-IN",
    welcome:
      "नमस्कार! मी ॲग्रीसाथी — आपला 24/7 कृषी AI सल्लागार. पिकांवरील रोग, खत व्यवस्थापन, कीड नियंत्रण किंवा शासकीय अनुदानाबद्दल तुमचे प्रश्न मराठीत विचारा.",
    placeholder: "मराठीत आपला शेतीविषयक प्रश्न लिहा किंवा बोला...",
    topics: [
      "टोमॅटोवरील पर्णकुंचन रोग",
      "सोयाबीन खोडकिडा नियंत्रण",
      "सेंद्रिय खत व्यवस्थापन",
      "ठिबक सिंचन योजना",
      "नमो शेतकरी महासन्मान निधी",
      "बाजार भाव माहिती",
    ],
  },
  bn: {
    code: "bn",
    label: "বাংলা",
    name: "Bengali",
    speechLang: "bn-IN",
    welcome:
      "নমস্কার! আমি এগ্রিসাথী — আপনার 24/7 কৃষি AI বিশেষজ্ঞ। ফসলের রোগ, সার প্রয়োগ, পোকামাকড় দমন বা সরকারি প্রকল্প সম্পর্কে আপনার যেকোনো প্রশ্ন বাংলায় জিজ্ঞাসা করুন।",
    placeholder: "বাংলায় আপনার কৃষিকাজের প্রশ্ন টাইপ করুন বা বলুন...",
    topics: [
      "টমেটোর পাতা কোঁকড়ানো রোগ",
      "ধানের মাজরা পোকা দমন",
      "জৈব সার তৈরি ও প্রয়োগ",
      "বিন্দু সেচ প্রকল্প",
      "কৃষক বন্ধু প্রকল্প",
      "বাজার দর আপডেট",
    ],
  },
  en: {
    code: "en",
    label: "English",
    name: "English",
    speechLang: "en-IN",
    welcome:
      "Hello! I am AgriSathi — your 24/7 agricultural AI expert. Ask me anything about crop disease diagnosis, soil nutrition, irrigation schedules, or government subsidy schemes.",
    placeholder: "Type or speak your farming question in English...",
    topics: [
      "Tomato Leaf Curl Virus",
      "Paddy Stem Borer Control",
      "NPK 19:19:19 Application",
      "Drip Irrigation Setup",
      "PM-KISAN Scheme Benefits",
      "e-NAM Mandi Prices",
    ],
  },
}

// Unicode script detector to ensure speech synthesis uses the exact voice
function detectScriptLanguage(text: string): string {
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN" // Kannada
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN" // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN" // Telugu
  if (/[\u0D00-\u0D7F]/.test(text)) return "ml-IN" // Malayalam
  if (/[\u0980-\u09FF]/.test(text)) return "bn-IN" // Bengali
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN" // Hindi / Marathi
  return "en-IN"
}

// Clean text for speech synthesis so it doesn't read markdown symbols or emojis
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#+\s/g, "")
    .replace(/[`_~]/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
}

export default function NammaKrishiPage() {
  const [language, setLanguage] = useState<string>("auto")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: LANGUAGES.auto.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null)
  const [transcript, setTranscript] = useState("")
  const [inputText, setInputText] = useState("")
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  const recognitionRef = useRef<any>(null)
  const transcriptBuffer = useRef("")
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeLangConfig = LANGUAGES[language] || LANGUAGES.auto

  // Load voices for speech synthesis
  const loadVoices = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices && availableVoices.length > 0) {
        setVoices(availableVoices)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [loadVoices])

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isProcessing])

  // Initialize Speech Recognition according to selected language
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.maxAlternatives = 1
      recognition.lang = activeLangConfig.speechLang

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

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e.error)
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      try {
        recognitionRef.current?.abort()
      } catch (e) {}
    }
  }, [language, activeLangConfig.speechLang])

  // Stop current voice speech
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    setIsSpeaking(false)
    setSpeakingIndex(null)
  }

  // Handle switching language: CLEAR CHAT, RESET WELCOME IN THAT LANGUAGE, CANCEL AUDIO
  const handleSelectLanguage = (langCode: string) => {
    stopSpeaking()
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }

    setLanguage(langCode)
    setInputText("")
    setTranscript("")
    transcriptBuffer.current = ""

    const targetConfig = LANGUAGES[langCode] || LANGUAGES.auto

    // CLEAR the conversation and display fresh welcome message in selected language
    setMessages([
      {
        role: "ai",
        text: targetConfig.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        langCode: targetConfig.code,
      },
    ])

    // Focus input for seamless typing
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  // Toggle Voice Input
  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      stopSpeaking()
      setTranscript("")
      transcriptBuffer.current = ""
      try {
        if (!recognitionRef.current) {
          alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.")
          return
        }
        recognitionRef.current.lang = activeLangConfig.speechLang
        recognitionRef.current.start()
        setIsListening(true)
      } catch (e) {
        console.warn("Speech API error:", e)
        setIsListening(false)
      }
    }
  }

  // Speak out text with accurate language tag and matched regional voice
  const speakOutLoud = (text: string, msgIndex?: number) => {
    if (!synthRef.current) return

    synthRef.current.cancel()

    const clean = cleanTextForSpeech(text)
    if (!clean) return

    // Determine target spoken language
    const targetLang =
      language === "auto" ? detectScriptLanguage(clean) : activeLangConfig.speechLang

    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = targetLang
    utterance.rate = 0.95 // Clear, natural cadence for farmers
    utterance.pitch = 1.0

    // Find best matching voice
    const currentVoices = voices.length > 0 ? voices : synthRef.current.getVoices()
    const targetPrefix = targetLang.split("-")[0].toLowerCase()

    const bestVoice =
      currentVoices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
      currentVoices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix)) ||
      currentVoices.find((v) => v.lang.toLowerCase().includes(targetPrefix)) ||
      null

    if (bestVoice) {
      utterance.voice = bestVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      if (typeof msgIndex === "number") setSpeakingIndex(msgIndex)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setSpeakingIndex(null)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      setSpeakingIndex(null)
    }

    synthRef.current.speak(utterance)
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

    stopSpeaking()

    const userMsg: Message = {
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsProcessing(true)

    // Build language-specific instruction
    let langInstruction = ""
    if (language === "kn") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: You MUST write your ENTIRE response in pure, standard KANNADA (ಕನ್ನಡ ಲಿಪಿ). Do NOT use English alphabets for Kannada words. Use polite, accurate Kannada farming terminology."
    } else if (language === "hi") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: You MUST write your ENTIRE response in pure, standard HINDI (देवनागरी लिपि). Do NOT use Hinglish/Latin letters. Use clear, practical Hindi farming terms."
    } else if (language === "ta") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: You MUST write your ENTIRE response in pure TAMIL (தமிழ் எழுத்துக்கள்). Do NOT use English letters for Tamil words."
    } else if (language === "te") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: You MUST write your ENTIRE response in pure TELUGU (తెలుగు లిపి). Do NOT use English letters for Telugu words."
    } else if (language === "ml") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: You MUST write your ENTIRE response in pure MALAYALAM (മലയാളം ലിപി)."
    } else if (language === "mr") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: You MUST write your ENTIRE response in pure MARATHI (मराठी देवनागरी)."
    } else if (language === "bn") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: You MUST write your ENTIRE response in pure BENGALI (বাংলা লিপি)."
    } else if (language === "en") {
      langInstruction =
        "CRITICAL LANGUAGE RULE: Respond in clear, professional English specifically tailored for agricultural farmers."
    } else {
      langInstruction =
        "CRITICAL LANGUAGE RULE: Detect the language and script of the user's message and reply in that EXACT same native language and script (e.g. Kannada in Kannada script, Hindi in Devanagari script, Tamil in Tamil script, etc.)."
    }

    const systemPrompt = `You are AgriSathi, an expert AI agricultural scientist and trusted companion for farmers across India.

Your knowledge base covers:
- Crop diseases, pest identification, biological & chemical control dosages
- Soil health, NPK fertilizer calculation, micronutrients, compost
- Drip & sprinkler irrigation scheduling, water conservation
- Certified seeds, sowing dates, crop rotation & companion planting
- Government schemes: PM-KISAN, Kisan Credit Card (KCC), PM Fasal Bima Yojana (PMFBY), Subsidies
- Mandi prices, APMC market guidance, e-NAM portal
- Organic farming, Jeevamrutha, neem oil solutions

Tone & Format Rules:
- ${langInstruction}
- Plain text only! DO NOT use markdown symbols like **, *, #, bullet points, or emojis, because text will be read aloud by Text-To-Speech (TTS).
- Keep answers concise (3 to 5 sentences), highly practical, and immediately actionable.
- Mention specific brand names, chemical compositions, and dosages per acre or per liter of water when applicable.`

    try {
      const apiKey =
        process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyCpMNsUnsGyvnWTrCauXkt_yj8cXI6tGTc"
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const fullPrompt = `${systemPrompt}\n\nFarmer's Question: "${text}"`

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
        langCode: language,
      }

      setMessages((prev) => {
        const next = [...prev, aiMsg]
        // Auto-speak new response
        speakOutLoud(aiResponse, next.length - 1)
        return next
      })
    } catch (error) {
      console.warn("Gemini API call failed, using intelligent multilingual fallback:", error)
      const fallback = getLocalizedFallback(text, language)
      const aiMsg: Message = {
        role: "ai",
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        langCode: language,
      }
      setMessages((prev) => {
        const next = [...prev, aiMsg]
        speakOutLoud(fallback, next.length - 1)
        return next
      })
    }

    setIsProcessing(false)
  }

  // Comprehensive localized fallbacks
  const getLocalizedFallback = (query: string, lang: string): string => {
    const q = query.toLowerCase()

    if (lang === "kn" || /[\u0C80-\u0CFF]/.test(query)) {
      if (q.includes("ಟೊಮೇಟೊ") || q.includes("tomato") || q.includes("ಎಲೆ")) {
        return "ಟೊಮೇಟೊ ಗಿಡಗಳಿಗೆ ಎಲೆ ಸುರುಳಿ ರೋಗ ಬಂದರೆ ಬಿಳಿ ನೊಣಗಳನ್ನು ನಿಯಂತ್ರಿಸಬೇಕು. ಬೇವಿನ ಎಣ್ಣೆ 5 ಎಂಎಲ್ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ. ತೀವ್ರವಾಗಿದ್ದರೆ ಇಮಿಡಾಕ್ಲೋಪ್ರಿಡ್ 0.5 ಎಂಎಲ್ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಹಾಕಿ ಸಿಂಪಡಿಸಿ."
      }
      if (q.includes("ಭತ್ತ") || q.includes("ಅಕ್ಕಿ") || q.includes("rice")) {
        return "ಭತ್ತದ ಕಾಂಡ ಕೊರೆಯುವ ಹುಳುವಿಗೆ ಕ್ಲೋರಾಂಟ್ರಾನಿಲಿಪ್ರೋಲ್ 18.5 ಎಸ್.ಸಿ. ಯನ್ನು ಪ್ರತಿ ಎಕರೆಗೆ 60 ಎಂಎಲ್ ಸಿಂಪಡಿಸಿ. ಹಳದಿ ಬಣ್ಣ ಕಂಡುಬಂದರೆ ಎಕರೆಗೆ 25 ಕೆಜಿ ಯೂರಿಯಾ ಜೊತೆಗೆ ಜಿಂಕ್ ಸಲ್ಫೇಟ್ 10 ಕೆಜಿ ನೀಡಿ."
      }
      if (q.includes("ಗೊಬ್ಬರ") || q.includes("ರಸಗೊಬ್ಬರ") || q.includes("npk")) {
        return "ಸಮತೋಲಿತ ಪೋಷಕಾಂಶಕ್ಕಾಗಿ ಎನ್‌ಪಿಕೆ 19:19:19 ನೀರಿನಲ್ಲಿ ಕರಗುವ ಗೊಬ್ಬರವನ್ನು 5 ಗ್ರಾಂ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸಿ. ಪ್ರತಿ 3 ವರ್ಷಕ್ಕೊಮ್ಮೆ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿಸಿಕೊಳ್ಳುವುದು ಉತ್ತಮ."
      }
      if (q.includes("ಯೋಜನೆ") || q.includes("ಸಹಾಯಧನ") || q.includes("subsidy")) {
        return "ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಯಡಿ ವಾರ್ಷಿಕ 6000 ರೂಪಾಯಿ ನೇರ ನಗದು ಜಮೆಯಾಗುತ್ತದೆ. ಹನಿ ನೀರಾವರಿಗೆ ಕೃಷಿ ಇಲಾಖೆಯಿಂದ ಶೇಕಡಾ 90 ರವರೆಗೆ ಸಹಾಯಧನ ಲಭ್ಯವಿದೆ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗೆ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ."
      }
      return "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗೆ ಧನ್ಯವಾದಗಳು. ನಿಖರವಾದ ಸ್ಥಳೀಯ ಮಾಹಿತಿಗಾಗಿ ನಿಮ್ಮ ಸಮೀಪದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (ಕೆವಿಕೆ) ಅಥವಾ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ ಉಚಿತ ಸಹಾಯವಾಣಿ 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ."
    }

    if (lang === "hi" || /[\u0900-\u097F]/.test(query)) {
      if (q.includes("टमाटर") || q.includes("tomato")) {
        return "टमाटर में लीफ कर्ल वायरस सफेद मक्खी के कारण होता है। रोकथाम के लिए नीम का तेल 5 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें। गंभीर प्रकोप में इमिडाक्लोप्रिड 0.5 मिली प्रति लीटर का छिड़काव करें।"
      }
      if (q.includes("धान") || q.includes("rice") || q.includes("paddy")) {
        return "धान में तना छेदक कीट की रोकथाम हेतु क्लोरेंट्रानिलिप्रोल 18.5 एससी 60 मिली प्रति एकड़ की दर से छिड़काव करें। पीलापन दिखने पर प्रति एकड़ 25 किलोग्राम यूरिया डालें।"
      }
      if (q.includes("खाद") || q.includes("यूरिया") || q.includes("उर्वरक")) {
        return "संतुलित पोषण के लिए एनपीके 19:19:19 का 5 ग्राम प्रति लीटर पानी में मिलाकर पर्णीय छिड़काव करें। प्रति एकड़ 2 से 3 टन गोबर की सड़ी खाद का उपयोग अवश्य करें।"
      }
      if (q.includes("योजना") || q.includes("सब्सिडी") || q.includes("subsidy")) {
        return "पीएम किसान योजना के तहत पात्र किसानों को सालाना 6000 रुपये सीधे बैंक खाते में मिलते हैं। ड्रिप एवं फव्वारा सिंचाई पर 80 प्रतिशत तक सब्सिडी कृषि विभाग द्वारा दी जाती है।"
      }
      return "आपके प्रश्न के लिए धन्यवाद। सटीक जानकारी के लिए अपने नजदीकी कृषि विज्ञान केंद्र से संपर्क करें या किसान कॉल सेंटर 1800-180-1551 पर निशुल्क बात करें।"
    }

    if (lang === "ta" || /[\u0B80-\u0BFF]/.test(query)) {
      return "தக்காளி இலைச்சுருள் நோயைக் கட்டுப்படுத்த வேப்ப எண்ணெய் 5 மில்லி ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும். நெல் பயிரில் குருத்துப்பூச்சி தாக்கினால் குளோரான்ட்ரானிலிப்ரோல் தெளிக்கவும். கூடுதல் ஆலோசனைக்கு உழவர் உதவி மையம் 1800-180-1551 அழைக்கவும்."
    }

    if (lang === "te" || /[\u0C00-\u0C7F]/.test(query)) {
      return "టమాటా ఆకు ముడుత తెగులు నివారణకు వేప నూనె 5 మిల్లీలీటర్లు లీటరు నీటిలో కలిపి పిచికారీ చేయండి. వరిలో కాండం తొలిచే పురుగుకు క్లోరాంట్రానిలిప్రోల్ మందును వాడండి. రైతు సహాయ కేంద్రం 1800-180-1551 కు ఉచితంగా సంప్రదించవచ్చు."
    }

    if (lang === "ml" || /[\u0D00-\u0D7F]/.test(query)) {
      return "വിള സംരക്ഷണത്തിന് വേപ്പെണ്ണ എമൽഷൻ 5 മില്ലി ഒരു ലിറ്റർ വെള്ളത്തിൽ കലക്കി തളിക്കുക. തെങ്ങിന്റെ മണ്ഡരി ബാധ തടയാൻ വേപ്പെണ്ണ വെളുത്തുള്ളി മിശ്രിതം ഉപയോഗിക്കുക. കൃഷി സഹായത്തിന് 1800-180-1551 വിളിക്കൂ."
    }

    // Default English
    if (q.includes("fertilizer") || q.includes("npk") || q.includes("manure")) {
      return "For balanced crop nutrition, apply NPK 19:19:19 at 5 grams per liter as a foliar spray during vegetative growth. Supplement with well-decomposed organic compost at 2 to 3 tonnes per acre."
    }
    if (q.includes("pest") || q.includes("insect") || q.includes("disease")) {
      return "For pest infestations, start with cold-pressed Neem oil at 5ml per liter of water as an eco-friendly preventive measure. Spray in the early morning or evening for optimal absorption."
    }
    if (q.includes("scheme") || q.includes("pm-kisan") || q.includes("subsidy")) {
      return "Under PM-KISAN, eligible farmers receive 6000 rupees annually in three equal installments. Micro-irrigation subsidies of up to 70 to 80 percent are also available through state agriculture departments."
    }

    return "Thank you for asking AgriSathi. For verified local agronomy advice, consult your district Krishi Vigyan Kendra (KVK) or dial Kisan Call Centre toll-free at 1800-180-1551."
  }

  const sendSMS = () => {
    const lastAi = messages.filter((m) => m.role === "ai").pop()?.text || "AgriSathi Report"
    const body = encodeURIComponent(`AgriSathi Farm Advisory:\n\n${lastAi}`)
    window.open(`sms:+918217469646?body=${body}`, "_self")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef7ec] via-[#f7faf6] to-[#e8f3e5] font-sans flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-6 flex-grow max-w-4xl flex flex-col gap-4">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#174624] via-[#1e5631] to-[#287340] rounded-3xl p-5 text-white shadow-2xl border border-emerald-700/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-3.5 rounded-2xl shadow-inner border border-white/25">
                <Leaf className="w-8 h-8 text-emerald-300 drop-shadow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight drop-shadow-sm">AgriSathi AI</h1>
                  <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    Multilingual Voice
                  </span>
                </div>
                <p className="text-emerald-200/90 text-sm mt-0.5 font-light">
                  🌾 Real-time Agricultural Intelligence in 8 Indian Languages
                </p>
              </div>
            </div>

            {/* Clear Chat Button */}
            <Button
              onClick={() => handleSelectLanguage(language)}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs flex items-center gap-1.5 shadow-sm ml-auto md:ml-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear & Reset Chat
            </Button>
          </div>

          {/* Language Selector Buttons */}
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / भाषा चुनें:
              </span>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {Object.values(LANGUAGES).map((l) => {
                const isSelected = language === l.code
                return (
                  <button
                    key={l.code}
                    onClick={() => handleSelectLanguage(l.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-white text-[#174624] shadow-lg scale-105 ring-2 ring-emerald-300 font-bold"
                        : "text-emerald-100 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-[#174624]" />}
                    <span>{l.label}</span>
                    {l.code !== "auto" && l.code !== "en" && (
                      <span className="text-[10px] opacity-75 font-normal">({l.name})</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Prominently Displayed Active Language Badge */}
          <div className="mt-4 bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <span className="text-emerald-100">
                Active Language:{" "}
                <strong className="text-white text-sm">
                  {activeLangConfig.label} ({activeLangConfig.name})
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-emerald-200/80 text-[11px]">
              <span>Speech Recognition: <strong>{activeLangConfig.speechLang}</strong></span>
              <span>•</span>
              <span>Voice TTS: <strong>{activeLangConfig.speechLang}</strong></span>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-medium shadow animate-pulse"
                >
                  <Square className="w-2.5 h-2.5 fill-current" /> Stop Audio
                </button>
              )}
            </div>
          </div>

          {/* Quick Query Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeLangConfig.topics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setInputText(topic + " — ")
                  textareaRef.current?.focus()
                }}
                className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full text-emerald-100 transition-all flex items-center gap-1 active:scale-95"
              >
                <Sparkles className="w-3 h-3 text-emerald-300" />
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <Card className="flex-grow bg-white border-none shadow-xl rounded-3xl overflow-hidden flex flex-col">
          {/* Messages Container */}
          <div
            className="flex-grow p-5 overflow-y-auto flex flex-col gap-5"
            style={{ minHeight: "420px", maxHeight: "55vh" }}
          >
            {messages.map((m, i) => {
              const isAi = m.role === "ai"
              const isCurrentlySpeaking = isSpeaking && speakingIndex === i

              return (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse ml-auto max-w-[85%]" : "max-w-[88%]"}`}
                >
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                      m.role === "user"
                        ? "bg-[#1e5631] text-white"
                        : "bg-[#edf5ee] text-[#1e5631] border border-[#c3ddc8]"
                    }`}
                  >
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                  </div>

                  <div className="flex flex-col gap-1.5 flex-grow">
                    <div
                      className={`p-4 rounded-2xl text-[14.5px] leading-relaxed shadow-sm relative group ${
                        m.role === "user"
                          ? "bg-[#1e5631] text-white rounded-tr-sm"
                          : "bg-slate-50 text-slate-800 border border-slate-200/70 rounded-tl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>

                      {/* Read Aloud Button for AI message */}
                      {isAi && (
                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                          <button
                            onClick={() => {
                              if (isCurrentlySpeaking) {
                                stopSpeaking()
                              } else {
                                speakOutLoud(m.text, i)
                              }
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium ${
                              isCurrentlySpeaking
                                ? "bg-red-100 text-red-700 hover:bg-red-200 animate-pulse"
                                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60"
                            }`}
                          >
                            {isCurrentlySpeaking ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" /> Stop Speaking
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                              </>
                            )}
                          </button>

                          <span className="text-[11px] text-slate-400">
                            {m.timestamp}
                          </span>
                        </div>
                      )}
                    </div>

                    {m.role === "user" && m.timestamp && (
                      <span className="text-[11px] text-slate-400 text-right pr-1">
                        {m.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Processing & Live Listening Indicator */}
            {(isProcessing || isListening) && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-[#edf5ee] text-[#1e5631] border border-[#c3ddc8]">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-3 text-sm">
                  {isListening ? (
                    <>
                      <span className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${d * 150}ms` }}
                          />
                        ))}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-red-600 flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5" /> Listening in {activeLangConfig.label} ({activeLangConfig.speechLang})...
                        </span>
                        <span className="italic text-slate-700 text-xs mt-0.5">
                          {transcript ? `"${transcript}"` : "Speak now into your microphone..."}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 border-2 border-[#1e5631] border-t-transparent rounded-full animate-spin" />
                      <span className="italic">Analyzing query in {activeLangConfig.name}...</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Controls */}
          <div className="border-t border-slate-200/80 bg-slate-50 p-4">
            <div className="flex flex-col gap-3">
              {/* Text Input Row */}
              <div className="flex gap-2 items-end bg-white rounded-2xl border border-slate-300 shadow-sm p-2 focus-within:border-[#1e5631] focus-within:ring-2 focus-within:ring-[#1e5631]/20 transition-all">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder={activeLangConfig.placeholder}
                  disabled={isProcessing || isListening}
                  className="flex-grow resize-none bg-transparent text-slate-800 placeholder-slate-400 text-sm leading-relaxed focus:outline-none px-2 py-1 disabled:opacity-60"
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!inputText.trim() || isProcessing || isListening}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1e5631] hover:bg-[#287340] text-white flex items-center justify-center shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Actions Row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex gap-2">
                  {/* Voice Button */}
                  <button
                    onClick={toggleListen}
                    disabled={isProcessing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 ${
                      isListening
                        ? "bg-red-500 text-white hover:bg-red-600 animate-pulse ring-2 ring-red-300"
                        : "bg-[#edf5ee] text-[#1e5631] hover:bg-[#d5ecd9] border border-[#c3ddc8]"
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? "Stop Listening" : `Speak (${activeLangConfig.label})`}
                  </button>

                  {/* SMS Advisory */}
                  <button
                    onClick={sendSMS}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-white text-[#1e5631] border border-[#c3ddc8] hover:bg-[#edf5ee] shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </button>

                  <button
                    onClick={() => alert("Crop Leaf Photo Diagnosis — available in Pro mode.")}
                    className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-white text-[#1e5631] border border-[#c3ddc8] hover:bg-[#edf5ee] shadow-sm transition-all"
                  >
                    <ImageUp className="w-4 h-4" />
                    Crop Photo
                  </button>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="flex items-center gap-1 font-medium text-emerald-800">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    {activeLangConfig.label} ({activeLangConfig.name})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    Auto TTS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pb-2">
          AgriSathi Multilingual AI • Supporting Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali & English • Kisan Helpline: <strong>1800-180-1551</strong>
        </div>
      </main>
    </div>
  )
}
