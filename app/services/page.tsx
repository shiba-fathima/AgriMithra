"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Tractor, Landmark, ExternalLink, Leaf, Truck } from "lucide-react"

const services = [
  {
    id: "labour-connect",
    title: "Labour Connect",
    description: "Find reliable agricultural laborers and seamlessly connect with skilled workers directly around your local farm area.",
    icon: Users,
    color: "emerald",
    link: "https://agrilink-nine-murex.vercel.app/login",
    image: "/images/services/labours.png"
  },
  {
    id: "agrirent-equipments",
    title: "AgriRent Equipments",
    description: "Rent advanced farming equipment like tractors, drones, and harvesters instantly without heavy upfront investments.",
    icon: Tractor,
    color: "amber",
    link: "https://agrirent-three.vercel.app/",
    image: "/images/services/equipments.png"
  },
  {
    id: "govt-schemes",
    title: "Govt Schemes",
    description: "Explore and apply for localized government agricultural initiatives, subsidies, and financial support schemes tracking seamlessly.",
    icon: Landmark,
    color: "blue",
    link: "https://agroscheme-ju5dam4fe-niyas-js-projects.vercel.app/",
    image: "/images/services/schemes.png"
  },
  {
    id: "agri-transport",
    title: "Agri Transport",
    description: "Reliable logistics and freight transport solutions to securely deliver your farm produce rapidly to markets and buyers.",
    icon: Truck,
    color: "purple",
    link: "https://agri-transport-gules.vercel.app",
    image: "/images/services/travels.png"
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      
      <div className="relative overflow-hidden bg-slate-900 py-32 text-white shadow-inner flex-grow-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-md mb-8 border border-white/20 shadow-xl">
            <Leaf className="w-4 h-4 text-emerald-400 drop-shadow-sm" /> Web Integrations Matrix
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-7xl text-white drop-shadow-md">AgriMithra Services Hub</h1>
          <p className="mx-auto max-w-3xl text-xl font-light text-slate-300 leading-relaxed drop-shadow">
            We have partnered and built powerful external ecosystems to provide you seamless dedicated workflows for Labor management, Equipments rentals, and Government Subsidies securely online.
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pb-32 flex-grow">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto -mt-24 relative z-20">
          {services.map((service) => (
            <Card key={service.id} className="group overflow-hidden border-none shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 bg-white/95 backdrop-blur-xl flex flex-col rounded-3xl">
              <div className="h-56 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10 duration-500"></div>
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <CardHeader className="pb-6 pt-0 px-10 text-center flex-grow relative z-20">
                <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl shadow-inner transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 bg-white
                  ${service.color === "emerald" ? "text-emerald-600 shadow-emerald-200/50" : 
                    service.color === "amber" ? "text-amber-600 shadow-amber-200/50" : 
                    service.color === "purple" ? "text-purple-600 shadow-purple-200/50" :
                    "text-blue-600 shadow-blue-200/50"} -mt-12 outline outline-4 outline-white/80 backdrop-blur-sm z-30`}>
                  <service.icon className="h-10 w-10 drop-shadow-sm" />
                </div>
                <CardTitle className="text-3xl font-extrabold text-slate-800 mb-4">{service.title}</CardTitle>
                <CardContent className="p-0">
                  <p className="text-slate-500 leading-relaxed text-base font-light">
                    {service.description}
                  </p>
                </CardContent>
              </CardHeader>
              <div className="p-10 pt-4 mt-auto">
                <a href={service.link} target="_blank" rel="noopener noreferrer" className="block outline-none">
                  <Button className={`w-full rounded-2xl h-16 text-lg font-semibold shadow-lg transition-all gap-3 group-hover:gap-4 
                    ${service.color === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 hover:shadow-emerald-600/50" : 
                      service.color === "amber" ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30 hover:shadow-amber-500/50" : 
                      service.color === "purple" ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/30 hover:shadow-purple-600/50" :
                      "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 hover:shadow-blue-600/50"} text-white`}
                  >
                    Access {service.title.split(' ')[0]} <ExternalLink className="w-5 h-5 opacity-90 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
