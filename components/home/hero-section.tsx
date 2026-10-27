"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Shield, Cpu } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center -mt-[var(--navbar-height)] pt-[var(--navbar-height)]">
      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10 mt-8 sm:mt-0">
        <div className="mx-auto max-w-4xl text-center pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-5 py-2 backdrop-blur-xl shadow-sm"
          >
            <span className="text-sm font-medium text-primary tracking-wide">AI-Powered Smart Agriculture</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance drop-shadow-lg"
          >
            Smart Farm Management System.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mb-10 text-lg sm:text-xl leading-relaxed text-pretty max-w-2xl mx-auto text-muted-foreground font-light drop-shadow"
          >
            Real-time monitoring and intelligent decision-making using IoT sensors and cloud integration for smarter visually-optimized farming operations.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300">
              <Link href="/dashboard">
                View Live Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 border-primary/20 text-foreground hover:bg-primary/10 backdrop-blur-md transition-all duration-300 bg-background/50 shadow-sm">
              <Link href="/services">Explore Services</Link>
            </Button>
          </motion.div>
        </div>

        {/* Feature Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Live 3D Tracking</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Smart Alerts</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl px-6 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <Cpu className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">IoT Integration</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
