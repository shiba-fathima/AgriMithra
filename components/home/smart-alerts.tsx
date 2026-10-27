"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Flame, Wind, Ruler, Thermometer, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Alert {
  id: string
  type: "danger" | "warning" | "info"
  icon: React.ElementType
  message: string
  timestamp: Date
}

const alertTemplates = [
  { type: "danger" as const, icon: Flame, message: "Fire detected - Buzzer Activated" },
  { type: "warning" as const, icon: Wind, message: "Gas leakage detected" },
  { type: "info" as const, icon: Ruler, message: "Object detected within range" },
  { type: "warning" as const, icon: Thermometer, message: "High temperature - Irrigation recommended" },
  { type: "info" as const, icon: AlertTriangle, message: "Moisture levels below optimal" },
  { type: "warning" as const, icon: AlertTriangle, message: "Unusual activity detected in sector A3" },
]

function generateAlerts(): Alert[] {
  const numAlerts = 3 + Math.floor(Math.random() * 2)
  const shuffled = [...alertTemplates].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numAlerts).map((template, i) => ({
    ...template,
    id: `alert-${i}-${Date.now()}`,
    timestamp: new Date(Date.now() - Math.random() * 60000),
  }))
}

function getAlertStyles(type: string) {
  switch (type) {
    case "danger":
      return "border-red-100 bg-red-50/50 hover:bg-red-50"
    case "warning":
      return "border-amber-100 bg-amber-50/50 hover:bg-amber-50"
    default:
      return "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
  }
}

function getIconStyles(type: string) {
  switch (type) {
    case "danger": return "text-red-600 bg-red-100"
    case "warning": return "text-amber-600 bg-amber-100"
    default: return "text-slate-600 bg-slate-100"
  }
}

export function SmartAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    setAlerts(generateAlerts())
    const interval = setInterval(() => {
      setAlerts(generateAlerts())
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">Smart Alerts Panel.</h2>
          <p className="text-slate-500 text-lg font-light">
            Intelligent 3D-tracked notifications based on sensor thresholds and proactive AI analysis.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm">
                  <Bell className="h-4 w-4 text-slate-700" />
                </div>
                <CardTitle className="text-xl text-slate-900 font-medium tracking-tight">Active Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {alerts.map((alert) => (
                    <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${getAlertStyles(alert.type)}`}
                    >
                      <div className={`p-2.5 rounded-xl border border-white/50 shadow-[0_2px_10px_rgb(0,0,0,0.02)] ${getIconStyles(alert.type)}`}>
                        <alert.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 text-[15px]">{alert.message}</p>
                        <p className="text-[13px] text-slate-500 mt-0.5 font-light tracking-wide">
                          {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-[13px] text-slate-400 mt-8 font-medium tracking-wide uppercase"
        >
          Alerts refresh dynamically based on 3D spatial conditions
        </motion.p>
      </div>
    </section>
  )
}
