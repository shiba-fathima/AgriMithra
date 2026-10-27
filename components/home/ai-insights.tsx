"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Brain, CloudRain, Droplets, Truck } from "lucide-react"
import { motion } from "framer-motion"

const insights = [
  {
    icon: CloudRain,
    title: "Weather Advisory",
    recommendation: "Weather conditions suggest delaying harvest by 2-3 days for optimal crop quality.",
    confidence: 87,
  },
  {
    icon: Droplets,
    title: "Irrigation Timing",
    recommendation: "Optimal time for irrigation is between 6-8 AM. Soil moisture levels are at 45%.",
    confidence: 92,
  },
  {
    icon: Truck,
    title: "Transport Demand",
    recommendation: "Transport demand is high in your area. Consider booking vehicles in advance.",
    confidence: 78,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

export function AIInsights() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-slate-200/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <Brain className="h-8 w-8 text-slate-700" />
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">AI-Powered Insights.</h2>
          <p className="text-slate-500 text-lg font-light">
            Machine learning algorithms comprehensively analyze your 3D farm data to provide actionable predictions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {insights.map((insight) => (
            <motion.div key={insight.title} variants={itemVariants}>
              <Card className="border-slate-200/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-slate-100 transition-colors shadow-sm">
                      <insight.icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-slate-900 tracking-tight">{insight.title}</h3>
                      <p className="text-[13px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">{insight.confidence}% confidence</p>
                    </div>
                  </div>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-light mb-8">{insight.recommendation}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-[13px] text-slate-400 mb-2 font-medium tracking-wide">
                      <span>ACCURACY LEVEL</span>
                      <span>{insight.confidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${insight.confidence}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-slate-800"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
