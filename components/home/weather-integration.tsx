"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CloudSun, Droplets, Wind, Thermometer, MapPin } from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  windspeed: number
  location: string
  isReady: boolean
}

export function WeatherIntegration() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    humidity: 0,
    windspeed: 0,
    location: "Loading...",
    isReady: false,
  })

  useEffect(() => {
    // Default fallback to central India if location is disabled
    let lat = 20.5937
    let lon = 78.9629

    const fetchWeather = async (latitude: number, longitude: number, defaultLoc: string) => {
      try {
        let exactLocation = defaultLoc;
        // Resolve exact city/location using provided API Key (Google Maps Reverse Geocoding)
        try {
           const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCpMNsUnsGyvnWTrCauXkt_yj8cXI6tGTc`);
           const geoData = await geoRes.json();
           if (geoData.status === "OK" && geoData.results.length > 0) {
              const cityComp = geoData.results[0].address_components.find((c: any) => c.types.includes("locality"));
              if (cityComp) {
                 exactLocation = cityComp.long_name;
              } else {
                 exactLocation = geoData.results[0].address_components[0].long_name;
              }
           }
        } catch (err) {
           console.log("Geocoding ignored", err);
        }

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`)
        const data = await res.json()
        setWeather({
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windspeed: data.current.wind_speed_10m,
          location: exactLocation,
          isReady: true
        })
      } catch (e) {
        console.error("Weather fetch failed", e)
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, "Your Field Location")
        },
        () => fetchWeather(lat, lon, "Central Farm")
      )
    } else {
      fetchWeather(lat, lon, "Central Farm")
    }
  }, [])

  if (!weather.isReady) return null

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-4 flex items-center justify-center gap-3">
            <CloudSun className="w-10 h-10 text-amber-500" />
            Live Weather API
          </h2>
          <p className="text-slate-500 text-lg font-light flex items-center justify-center gap-2">
            Local field conditions via satellite: <span className="font-medium text-slate-800 flex flex-row items-center gap-1"><MapPin className="w-4 h-4"/> {weather.location}</span>
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          <Card className="border-slate-200/50 shadow-md bg-white/70 backdrop-blur">
             <CardContent className="p-6 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                 <Thermometer className="w-6 h-6 text-rose-500" />
               </div>
               <p className="text-sm text-slate-500 font-medium mb-1">Temperature</p>
               <p className="text-4xl font-bold text-slate-900">{weather.temperature}°C</p>
             </CardContent>
          </Card>
          <Card className="border-slate-200/50 shadow-md bg-white/70 backdrop-blur">
             <CardContent className="p-6 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                 <Droplets className="w-6 h-6 text-blue-500" />
               </div>
               <p className="text-sm text-slate-500 font-medium mb-1">Humidity</p>
               <p className="text-4xl font-bold text-slate-900">{weather.humidity}%</p>
             </CardContent>
          </Card>
          <Card className="border-slate-200/50 shadow-md bg-white/70 backdrop-blur">
             <CardContent className="p-6 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                 <Wind className="w-6 h-6 text-slate-600" />
               </div>
               <p className="text-sm text-slate-500 font-medium mb-1">Wind Speed</p>
               <p className="text-4xl font-bold text-slate-900">{weather.windspeed} km/h</p>
             </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
