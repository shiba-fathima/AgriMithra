"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Sprout, 
  BadgeIndianRupee, 
  RefreshCw, 
  Clock, 
  Layers
} from "lucide-react"

interface CropData {
  id: string
  name: string
  localName: string
  variety: string
  currentPrice: string
  rawPrice: number
  unit: string
  trend: string
  status: "up" | "down" | "stable"
  location: string
  growth: string
  arrivals: string
}

const initialCrops: CropData[] = [
  {
    id: "coconut",
    name: "Coconut",
    localName: "ತೆಂಗಿನಕಾಯಿ",
    variety: "Dehusked Medium/Large",
    currentPrice: "₹32.50",
    rawPrice: 32.5,
    unit: "/ nut (₹3,250/100 nuts)",
    trend: "+2.1%",
    status: "up",
    location: "Tiptur & Mangaluru APMC",
    growth: "Nut Maturation Phase",
    arrivals: "32,400 nuts"
  },
  {
    id: "rubber",
    name: "Rubber",
    localName: "ರಬ್ಬರ್ (RSS-4)",
    variety: "Ribbed Smoked Sheet-4",
    currentPrice: "₹188.00",
    rawPrice: 188.0,
    unit: "/ kg (₹18,800/quintal)",
    trend: "+1.6%",
    status: "up",
    location: "Kottayam & Sullia Market",
    growth: "Peak Tapping Season",
    arrivals: "480 quintals"
  },
  {
    id: "banana",
    name: "Banana",
    localName: "ಬಾಳೆಹಣ್ಣು (Yelakki)",
    variety: "Yelakki / Robusta Grade-A",
    currentPrice: "₹2,860",
    rawPrice: 2860,
    unit: "/ quintal (₹28.6/kg)",
    trend: "-0.8%",
    status: "down",
    location: "Mysuru & Bengaluru Mandi",
    growth: "Bunch Filling Stage",
    arrivals: "1,450 bunches"
  },
  {
    id: "arecanut",
    name: "Arecanut",
    localName: "ಅಡಿಕೆ (Chali/Supari)",
    variety: "White Supari / Rashi Chali",
    currentPrice: "₹46,450",
    rawPrice: 46450,
    unit: "/ quintal (₹464.5/kg)",
    trend: "+3.2%",
    status: "up",
    location: "Shivamogga & Mangaluru APMC",
    growth: "Harvest & Curing Cycle",
    arrivals: "2,890 bags"
  }
]

export function CropMarketInsights() {
  const [crops, setCrops] = useState<CropData[]>(initialCrops)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isAutoUpdating, setIsAutoUpdating] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  // Automatic live price fluctuation simulator reflecting real-time APMC Mandi trends
  const updatePrices = () => {
    setIsRefreshing(true)
    setCrops((prevCrops) =>
      prevCrops.map((crop) => {
        // Minor realistic fluctuation: +/- 0.5% to 1.5%
        const deltaPercent = (Math.random() * 2.4 - 1.1) / 100
        const newRaw = Math.max(1, crop.rawPrice * (1 + deltaPercent))
        const isUp = deltaPercent >= 0

        let formattedPrice = ""
        if (crop.id === "coconut" || crop.id === "rubber") {
          formattedPrice = `₹${newRaw.toFixed(2)}`
        } else {
          formattedPrice = `₹${Math.round(newRaw).toLocaleString("en-IN")}`
        }

        const formattedTrend = `${isUp ? "+" : ""}${(deltaPercent * 100).toFixed(1)}%`

        return {
          ...crop,
          rawPrice: newRaw,
          currentPrice: formattedPrice,
          trend: formattedTrend,
          status: isUp ? "up" : "down"
        }
      })
    )
    setLastUpdated(new Date())
    setTimeout(() => setIsRefreshing(false), 600)
  }

  // Automatically update prices every 7 seconds when auto-update is active
  useEffect(() => {
    if (!isAutoUpdating) return

    const interval = setInterval(() => {
      updatePrices()
    }, 7000)

    return () => clearInterval(interval)
  }, [isAutoUpdating])

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-emerald-50/60 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Ribbon with Live Indicator and Controls */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 mb-3 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live APMC Automated Feed
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Crop Market & Growth.
            </h2>
            <p className="text-slate-500 text-lg font-light mt-2">
              Automated real-time Mandi prices, regional arrival volumes, and crop growth stages updated live.
            </p>
          </motion.div>

          {/* Real-time Status Badge & Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 shadow-sm"
          >
            <div className="flex items-center gap-2 px-3 py-1 text-xs text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Live: {lastUpdated.toLocaleTimeString()}</span>
            </div>

            <button
              onClick={() => setIsAutoUpdating(!isAutoUpdating)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                isAutoUpdating 
                  ? "bg-emerald-600 text-white shadow-xs" 
                  : "bg-slate-200 text-slate-600 hover:bg-slate-300"
              }`}
            >
              {isAutoUpdating ? "Auto-Updating ON" : "Auto-Updating Paused"}
            </button>

            <button
              onClick={updatePrices}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
              title="Refresh prices now"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRefreshing ? "animate-spin" : ""}`} />
              Sync
            </button>
          </motion.div>
        </div>

        {/* 4 Commodity Cards: Coconut, Rubber, Banana, Arecanut */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence>
            {crops.map((crop, index) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group"
              >
                <Card className="h-full border border-slate-200/80 bg-white hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden flex flex-col justify-between">
                  <CardHeader className="pb-3 pt-6 px-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {crop.localName}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        crop.status === "up" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {crop.status === "up" ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {crop.trend}
                      </span>
                    </div>

                    <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-baseline justify-between">
                      <span>{crop.name}</span>
                      <BadgeIndianRupee className="w-5 h-5 text-emerald-600" />
                    </CardTitle>

                    <p className="text-xs text-slate-500 font-medium">{crop.variety}</p>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 pt-0">
                    {/* Live Price Display */}
                    <div className="my-3 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between group-hover:bg-emerald-50/40 group-hover:border-emerald-100 transition-colors">
                      <motion.span 
                        key={crop.currentPrice}
                        initial={{ scale: 0.96, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl font-black text-slate-900 tracking-tight"
                      >
                        {crop.currentPrice}
                      </motion.span>
                      <span className="text-xs font-medium text-slate-500">{crop.unit}</span>
                    </div>

                    {/* Metadata: Location, Growth, Arrivals */}
                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">{crop.location}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Sprout className="w-3.5 h-3.5 mr-2 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">{crop.growth}</span>
                      </div>
                      <div className="flex items-center text-slate-500">
                        <Layers className="w-3.5 h-3.5 mr-2 text-amber-500 shrink-0" />
                        <span>Daily Arrivals: <strong className="text-slate-700">{crop.arrivals}</strong></span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

