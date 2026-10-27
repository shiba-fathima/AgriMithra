import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SystemOverview } from "@/components/home/system-overview"
import { SensorMonitoring } from "@/components/home/sensor-monitoring"
import { SmartAlerts } from "@/components/home/smart-alerts"
import { AIInsights } from "@/components/home/ai-insights"
import { HardwareIntegration } from "@/components/home/hardware-integration"
import { TechArchitecture } from "@/components/home/tech-architecture"
import { CropMarketInsights } from "@/components/home/crop-market-insights"
import { WeatherIntegration } from "@/components/home/weather-integration"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Global Fixed Crop Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{backgroundImage: "var(--crop-bg)"}} />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      </div>

      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <SystemOverview />
        <CropMarketInsights />
        <SensorMonitoring />
        <WeatherIntegration />
        <SmartAlerts />
        <AIInsights />
        <HardwareIntegration />
        <TechArchitecture />
      </main>
      <Footer />
    </div>
  )
}
