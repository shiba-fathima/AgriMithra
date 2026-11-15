"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  CloudSun,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

interface WeatherData {
  temp: number
  humidity: number
  condition: string
  location: string
}

function generateHistoricalData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    time: `${i * 5}m`,
    temperature: Math.round((22 + Math.random() * 15) * 10) / 10,
    humidity: Math.round((40 + Math.random() * 35) * 10) / 10,
    rainfall: Math.round(Math.random() * 20 * 10) / 10,
  }))
}

function getTrend(arr: number[]) {
  const last = arr[arr.length - 1]
  const prev = arr[arr.length - 2]
  if (last > prev * 1.02) return { icon: TrendingUp, color: "text-destructive" }
  if (last < prev * 0.98) return { icon: TrendingDown, color: "text-success" }
  return { icon: Minus, color: "text-muted-foreground" }
}

export default function DashboardPage() {
  const [chartData, setChartData] = useState(generateHistoricalData(12))
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temp: 0,
    humidity: 0,
    condition: "Loading...",
    location: "Locating",
  })

  useEffect(() => {
    let lat = 20.5937
    let lon = 78.9629

    const fetchWeather = async (latitude: number, longitude: number, defaultLoc: string) => {
      try {
        let exactLocation = defaultLoc
        try {
          const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCpMNsUnsGyvnWTrCauXkt_yj8cXI6tGTc`)
          const geoData = await geoRes.json()
          if (geoData.status === "OK" && geoData.results.length > 0) {
            const cityComp = geoData.results[0].address_components.find((c: any) => c.types.includes("locality"))
            if (cityComp) {
              exactLocation = cityComp.long_name
            } else {
              exactLocation = geoData.results[0].address_components[0].long_name
            }
          }
        } catch (err) {
          console.log("Geocoding ignored", err)
        }

        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`)
        const data = await res.json()
        setWeatherData({
          temp: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          condition: `Wind: ${data.current.wind_speed_10m} km/h`,
          location: exactLocation,
        })
      } catch (e) {
        console.error("Weather fetch failed", e)
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, "Local Field")
        },
        () => fetchWeather(lat, lon, "Central Farm")
      )
    } else {
      fetchWeather(lat, lon, "Central Farm")
    }
  }, [])

  // Auto-refresh simulated chart data every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateHistoricalData(12))
      setLastUpdated(new Date())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const temps = chartData.map(d => d.temperature)
  const humids = chartData.map(d => d.humidity)
  const tempTrend = getTrend(temps)
  const humidTrend = getTrend(humids)

  const summaryCards = [
    {
      label: "Avg Temperature",
      value: `${(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)}°C`,
      icon: Thermometer,
      trend: tempTrend,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      label: "Avg Humidity",
      value: `${(humids.reduce((a, b) => a + b, 0) / humids.length).toFixed(1)}%`,
      icon: Droplets,
      trend: humidTrend,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Live Weather",
      value: `${weatherData.temp}°C`,
      icon: CloudSun,
      trend: null,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      label: "Wind Speed",
      value: weatherData.condition,
      icon: Wind,
      trend: null,
      color: "text-slate-500",
      bg: "bg-slate-50",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Farm Dashboard</h1>
            <p className="text-muted-foreground mt-1">Live weather, climate trends, and agricultural analytics</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" style={{ animationDuration: "4s" }} />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {summaryCards.map((card) => (
            <Card key={card.label} className="border-border/50 bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  {card.trend && <card.trend.icon className={`h-4 w-4 ${card.trend.color}`} />}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="border-border/50 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Temperature &amp; Humidity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.18 145)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="oklch(0.55 0.18 145)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="humidGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.12 230)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="oklch(0.55 0.12 230)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.02 145)" />
                    <XAxis dataKey="time" stroke="oklch(0.45 0.02 240)" fontSize={12} />
                    <YAxis stroke="oklch(0.45 0.02 240)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "oklch(1 0 0)", 
                        border: "1px solid oklch(0.90 0.02 145)",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }} 
                    />
                    <Area type="monotone" dataKey="temperature" stroke="oklch(0.55 0.18 145)" fill="url(#tempGradient)" name="Temp (°C)" />
                    <Area type="monotone" dataKey="humidity" stroke="oklch(0.55 0.12 230)" fill="url(#humidGradient)" name="Humidity (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-secondary" />
                Rainfall Forecast Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.02 145)" />
                    <XAxis dataKey="time" stroke="oklch(0.45 0.02 240)" fontSize={12} />
                    <YAxis stroke="oklch(0.45 0.02 240)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "oklch(1 0 0)", 
                        border: "1px solid oklch(0.90 0.02 145)",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rainfall" 
                      stroke="oklch(0.55 0.12 230)" 
                      strokeWidth={2}
                      dot={{ fill: "oklch(0.55 0.12 230)", strokeWidth: 0, r: 3 }}
                      name="Rainfall (mm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Integration */}
        <Card className="border-border/50 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-primary" />
                Live Weather Integration
              </CardTitle>
              <Badge variant="outline" className="text-xs">Powered by Open-Meteo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="text-lg font-semibold text-foreground">{weatherData.location}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Temperature</p>
                <p className="text-2xl font-bold text-foreground">{weatherData.temp}°C</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Humidity</p>
                <p className="text-2xl font-bold text-foreground">{weatherData.humidity}%</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">Condition</p>
                <p className="text-lg font-semibold text-foreground">{weatherData.condition}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
