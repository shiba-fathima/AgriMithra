"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Cpu, Thermometer, Wind, Flame, Ruler } from "lucide-react"
import { motion } from "framer-motion"

const hardware = [
  {
    icon: Cpu,
    name: "ESP32",
    description: "Dual-core microcontroller with WiFi and Bluetooth capabilities for IoT applications",
    specs: "240MHz, 520KB SRAM",
  },
  {
    icon: Thermometer,
    name: "DHT Sensor",
    description: "Digital temperature and humidity sensor for environmental monitoring",
    specs: "DHT11/DHT22",
  },
  {
    icon: Wind,
    name: "MQ2 Gas Sensor",
    description: "Detects combustible gases, smoke, and air quality levels",
    specs: "300-10000ppm range",
  },
  {
    icon: Flame,
    name: "Flame Sensor",
    description: "Infrared-based fire detection module for safety monitoring",
    specs: "760-1100nm wavelength",
  },
  {
    icon: Ruler,
    name: "Ultrasonic Sensor",
    description: "HC-SR04 distance measurement for object detection and water levels",
    specs: "2cm-400cm range",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
}

export function HardwareIntegration() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">Hardware Integration.</h2>
          <p className="text-slate-500 text-lg font-light">
            Industrial-grade 3D-tracked sensors and microcontrollers seamlessly powering your smart farm.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {hardware.map((item) => (
            <motion.div key={item.name} variants={itemVariants}>
              <Card className="h-full border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <item.icon className="h-8 w-8 text-slate-700 group-hover:text-slate-900" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">{item.name}</h3>
                  <p className="text-[13px] text-slate-500 mb-5 leading-relaxed font-light">{item.description}</p>
                  <span className="inline-block rounded-full bg-slate-100 border border-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600">
                    {item.specs}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
