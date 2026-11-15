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
    answer: "AgriMithra is an AI-powered agricultural intelligence platform. It synthesizes real-time satellite weather forecasts, regional climate metrics, APMC mandi commodity rates, and AI agronomic models. The web dashboard and AgriSathi AI provide actionable recommendations, disease guidance, and smart alerts without requiring expensive proprietary hardware.",
  },
  {
    question: "Do I need to purchase any hardware or sensors to use AgriMithra?",
    answer: "No! AgriMithra is entirely software and cloud-based. You do not need to purchase, install, or maintain any physical sensors or hardware devices. Everything runs seamlessly in your web browser on your phone, tablet, or computer.",
  },
  {
    question: "How are smart alerts generated?",
    answer: "Alerts are generated through automated AI analysis of localized meteorological forecasts, mandi price dynamics, and agronomic risk indicators (such as pest infestation windows, extreme temperature swings, and rainfall forecasts).",
  },
  {
    question: "Is AgriMithra affordable for small farmers?",
    answer: "Yes! AgriMithra is designed to be accessible for every farmer. Since there is zero hardware investment required, farmers can freely track mandi prices, receive weather advisories, and consult the multilingual AgriSathi AI assistant without expensive setup costs.",
  },
  {
    question: "Can small-scale farmers use this system effectively?",
    answer: "Absolutely! AgriMithra is built specifically for smallholder farmers. The platform is lightweight, supports voice queries in regional languages (Kannada, Hindi, Tamil, Telugu, and more), and provides practical, clear guidance for daily crop management.",
  },
  {
    question: "How is my farm data secured?",
    answer: "We take data security very seriously. All communication is encrypted in transit using modern TLS and stored securely on cloud infrastructure. We respect farmer privacy and never sell or share your agricultural records with third parties without consent.",
  },
  {
    question: "What data sources does AgriMithra integrate with?",
    answer: "AgriMithra integrates live meteorological data from Open-Meteo, APMC mandi commodity market pricing indices, reverse-geocoded spatial mapping, and Google Generative AI for agricultural disease detection and expert advisory.",
  },
  {
    question: "How can AgriSathi AI help with my farming decisions?",
    answer: "AgriSathi AI is available 24/7 to answer questions about crop diseases, pest remedies, organic fertilization, government schemes (like PM-KISAN and crop insurance), and sowing schedules in your native language via text or voice.",
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
                Find answers to common questions about AgriMithra, our smart farming platform, and AI-driven agricultural advisory.
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
