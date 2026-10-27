"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Wifi, Server, Database, Globe, Lock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const architectureLayers = [
  {
    icon: Wifi,
    title: "Data Collection",
    description: "ESP32 sends sensor data via WiFi to secure endpoints",
  },
  {
    icon: Server,
    title: "Backend Processing",
    description: "Firebase / Node.js backend processes and validates data",
  },
  {
    icon: Database,
    title: "Cloud Storage",
    description: "Real-time database stores historical and live values",
  },
  {
    icon: Globe,
    title: "Web Application",
    description: "Frontend fetches and displays data with live updates",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80 } }
}

export function TechArchitecture() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4">Technical Architecture.</h2>
          <p className="text-slate-500 text-lg font-light">
            Secure, scalable 3D-integrated infrastructure designed for real-time agricultural monitoring.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 lg:grid-cols-4 relative"
        >
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[40%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent content-[''] pointer-events-none z-0" />

          {architectureLayers.map((layer, index) => (
            <motion.div key={layer.title} variants={itemVariants} className="relative z-10">
              <Card className="h-full border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <layer.icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <div className="mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Step {index + 1}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">{layer.title}</h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed font-light">{layer.description}</p>
                </CardContent>
              </Card>
              {index < architectureLayers.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="mt-16 border-slate-200/60 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 overflow-hidden">
            <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm shrink-0">
                <Lock className="h-7 w-7 text-slate-700" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-xl text-slate-900 mb-2">Secure Backend Architecture</h4>
                <p className="text-[15px] text-slate-500 font-light leading-relaxed">
                  All API keys (OpenWeather, Google Maps) are handled securely on the backend. No sensitive data is exposed to the frontend interface.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
