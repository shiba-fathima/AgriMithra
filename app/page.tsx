import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { SystemOverview } from "@/components/home/system-overview"
import { AIInsights } from "@/components/home/ai-insights"
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
        <WeatherIntegration />
        <AIInsights />
        <TechArchitecture />
      </main>
      <Footer />
    </div>
  )
}
