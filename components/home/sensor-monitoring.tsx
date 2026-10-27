"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Wind, Flame, Ruler, Eye, ToggleLeft } from "lucide-react"
import { motion } from "framer-motion"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"

interface SensorData {
  temperature: number
  humidity: number
  gasLevel: number
  flameDetected: boolean
  distance: number
  button: boolean
  objectDetection: string
}

function getRandomSensorData(): SensorData {
  return {
    temperature: Math.round((20 + Math.random() * 20) * 10) / 10,
    humidity: Math.round((40 + Math.random() * 40) * 10) / 10,
    gasLevel: Math.round(Math.random() * 500),
    flameDetected: Math.random() > 0.9,
    distance: Math.round((10 + Math.random() * 90) * 10) / 10,
    button: Math.random() > 0.5,
    objectDetection: "None"
  }
}

function getStatus(type: string, value: number | boolean | string): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (type === "flame") return value ? { label: "Danger", variant: "destructive" } : { label: "Safe", variant: "default" }
  if (type === "temperature") {
    if (value as number > 35) return { label: "Warning", variant: "secondary" }
    if (value as number > 40) return { label: "Danger", variant: "destructive" }
    return { label: "Safe", variant: "default" }
  }
  if (type === "humidity") {
    if ((value as number) < 30 || (value as number) > 80) return { label: "Warning", variant: "secondary" }
    return { label: "Safe", variant: "default" }
  }
  if (type === "gas") {
    if (value as number > 300) return { label: "Danger", variant: "destructive" }
    if (value as number > 200) return { label: "Warning", variant: "secondary" }
    return { label: "Safe", variant: "default" }
  }
  if (type === "distance") {
    if (value as number < 20) return { label: "Warning", variant: "secondary" }
    return { label: "Safe", variant: "default" }
  }
  if (type === "button") {
    return value ? { label: "Pressed", variant: "secondary" } : { label: "Released", variant: "default" }
  }
  if (type === "object") {
    return value !== "None" ? { label: "Detected", variant: "secondary" } : { label: "Clear", variant: "default" }
  }
  return { label: "Safe", variant: "default" }
}

const sensors = [
  { key: "temperature", icon: Thermometer, label: "Temperature", unit: "°C", type: "temperature" },
  { key: "humidity", icon: Droplets, label: "Humidity", unit: "%", type: "humidity" },
  { key: "gasLevel", icon: Wind, label: "Gas Level", unit: "ppm", type: "gas" },
  { key: "flameDetected", icon: Flame, label: "Flame Detection", unit: "", type: "flame" },
  { key: "distance", icon: Ruler, label: "Distance", unit: "cm", type: "distance" },
  { key: "button", icon: ToggleLeft, label: "Button State", unit: "", type: "button" },
  { key: "objectDetection", icon: Eye, label: "Object Detection", unit: "", type: "object" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
}

export function SensorMonitoring() {
  const [data, setData] = useState<SensorData>(getRandomSensorData())

  useEffect(() => {
    const sensorsRef = ref(database, 'sensors')
    
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const dbData = snapshot.val()
      if (dbData) {
        setData({
          temperature: dbData.temperature ?? 0,
          humidity: dbData.humidity ?? 0,
          gasLevel: dbData.gasLevel ?? (dbData.gasDetected ? 450 : 60),
          flameDetected: dbData.fire ?? false,
          distance: dbData.distance ?? 0,
          button: dbData.button ?? false,
          objectDetection: dbData.objectDetection ?? (dbData.object ? "MOTION DETECTED" : "None"),
        })
      }
    }, (error) => {
      console.error("Firebase subscription error:", error)
    })

    return () => unsubscribe()
  }, [])

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">Live Sensor Monitoring.</h2>
          <p className="text-slate-500 text-lg font-light">
            Real-time tracking of critical environmental metrics within an immaculate unified dashboard.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          {sensors.map((sensor) => {
            const value = data[sensor.key as keyof SensorData]
            const status = getStatus(sensor.type, value)
            const displayValue = sensor.type === "flame" 
              ? (value ? "Alert" : "Safe")
              : sensor.type === "button"
              ? (value ? "PRESSED" : "NOT PRESSED")
              : sensor.type === "object"
              ? value as string
              : `${value}${sensor.unit}`

            return (
              <motion.div key={sensor.key} variants={itemVariants}>
                <Card className="border-slate-200/50 bg-white/70 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
                  <CardHeader className="pb-3 border-b border-slate-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                        <sensor.icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <Badge 
                        variant={status.variant}
                        className={
                          status.variant === "default" 
                            ? "bg-slate-100 text-slate-600 border-transparent font-medium" 
                            : status.variant === "secondary" 
                              ? "bg-amber-100 text-amber-700 border-transparent font-medium" 
                              : "bg-red-100 text-red-700 border-transparent font-medium"
                        }
                      >
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-500 mb-1 font-medium">{sensor.label}</p>
                    <p className="text-3xl font-semibold tracking-tight text-slate-900">{displayValue}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-[13px] text-slate-400 mt-12 font-medium tracking-wide uppercase"
        >
          Syncing gracefully via Firebase IoT · Real-time Updates
        </motion.p>
      </div>
    </section>
  )
}
