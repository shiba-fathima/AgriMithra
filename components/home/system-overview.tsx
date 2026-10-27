"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Radio, Cpu, Cloud, Monitor, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    icon: Radio,
    title: "Sensors",
    description: "DHT, MQ2, Flame, Ultrasonic sensors collect field data",
  },
  {
    icon: Cpu,
    title: "ESP32",
    description: "Microcontroller processes and transmits sensor readings",
  },
  {
    icon: Cloud,
    title: "Cloud",
    description: "Firebase/Node.js backend stores and processes data",
  },
  {
    icon: Monitor,
    title: "Dashboard",
    description: "Web app displays real-time insights and alerts",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
}

export function SystemOverview() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative clean background effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-slate-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">System Architecture.</h2>
          <p className="text-slate-500 text-lg font-light">
            End-to-end IoT pipeline from precise field sensors to an intelligent, minimal dashboard.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 md:grid-cols-4"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={itemVariants} className="relative">
              <Card className="h-full border-slate-200/50 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
                <CardContent className="p-8 text-center group">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 group-hover:bg-slate-100 transition-all duration-300 shadow-sm">
                    <step.icon className="h-7 w-7 text-slate-700" />
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-slate-900">{step.title}</h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed font-light">{step.description}</p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 md:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
