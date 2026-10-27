import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "How does the AgriMithra system work?",
    answer: "AgriMithra uses a network of IoT sensors (temperature, humidity, gas, flame, ultrasonic) connected to ESP32 microcontrollers. These devices collect real-time field data and transmit it via WiFi to our secure cloud backend. The web dashboard then displays this data with intelligent alerts and AI-powered recommendations for optimal farming decisions.",
  },
  {
    question: "Does the system require internet connectivity?",
    answer: "Yes, internet connectivity is required for real-time data transmission and cloud synchronization. However, the ESP32 modules can store data locally during brief connectivity interruptions and sync automatically when the connection is restored. We recommend a stable WiFi connection with at least 1 Mbps upload speed for optimal performance.",
  },
  {
    question: "How are sensor alerts generated?",
    answer: "Alerts are generated based on predefined thresholds and AI analysis. For example, temperature above 35°C triggers a warning, gas levels above 300ppm indicate danger, and flame detection immediately activates emergency protocols. You can customize these thresholds from the dashboard settings based on your specific crop and environmental requirements.",
  },
  {
    question: "Is AgriMithra affordable for small farmers?",
    answer: "Absolutely! We designed AgriMithra with affordability in mind. The basic sensor kit costs around $50-100 for hardware, and our software platform offers a free tier for small farms (up to 5 sensors). Premium features like AI insights and advanced analytics are available through affordable monthly subscriptions starting at $9.99/month.",
  },
  {
    question: "Can small-scale farmers use this system effectively?",
    answer: "Yes, AgriMithra is designed to scale from small backyard farms to large commercial operations. Small farmers can start with just 2-3 essential sensors (temperature, humidity, soil moisture) and expand as needed. Our mobile-friendly dashboard makes it easy to monitor your farm from anywhere, even without technical expertise.",
  },
  {
    question: "How is my farm data secured?",
    answer: "We take data security very seriously. All sensor data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. API keys and sensitive credentials are stored securely on our backend servers - never in the frontend code. We are GDPR compliant and never share your farm data with third parties without explicit consent.",
  },
  {
    question: "What sensors are compatible with the system?",
    answer: "AgriMithra supports a wide range of sensors including DHT11/DHT22 (temperature/humidity), MQ2/MQ135 (gas detection), HC-SR04 (ultrasonic distance), flame sensors, soil moisture sensors, light sensors, and pH sensors. We also support integration with third-party weather stations and commercial agricultural sensors via our open API.",
  },
  {
    question: "Can I integrate AgriMithra with my existing farm equipment?",
    answer: "Yes, our platform supports integration with various farm management systems and equipment through our REST API. We offer pre-built integrations for popular irrigation controllers, weather stations, and farm management software. Our team can also develop custom integrations for specialized equipment upon request.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <HelpCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl text-balance">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Find answers to common questions about AgriMithra, our smart farming platform, and IoT integration.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-border/50 rounded-lg bg-card px-6 data-[state=open]:shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="text-foreground font-medium pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10">
                  <MessageCircle className="h-7 w-7 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Still have questions?</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Our support team is here to help. Reach out and we will get back to you within 24 hours.
                </p>
                <Button size="lg" variant="secondary">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
