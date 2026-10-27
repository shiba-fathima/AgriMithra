"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Flame, 
  Ruler, 
  Activity,
  CloudSun,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  ToggleLeft,
  ScanLine
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

import { WebcamObjectDetector } from "@/components/dashboard/webcam-object-detector"

interface SensorData {
  temperature: number
  humidity: number
  gasLevel: number
  flameDetected: boolean
  distance: number
  button: boolean
  objectDetection: string
  timestamp: Date
}

interface WeatherData {
  temp: number
  humidity: number
  condition: string
  location: string
}

function generateSensorData(): SensorData {
  return {
    temperature: Math.round((22 + Math.random() * 18) * 10) / 10,
    humidity: Math.round((35 + Math.random() * 45) * 10) / 10,
    gasLevel: Math.round(50 + Math.random() * 350),
    flameDetected: Math.random() > 0.95,
    distance: Math.round((15 + Math.random() * 85) * 10) / 10,
    button: Math.random() > 0.5,
    objectDetection: Math.random() > 0.8 ? "MOTION DETECTED" : "None",
    timestamp: new Date(),
  }
}

function generateHistoricalData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    time: `${i * 5}m`,
    temperature: Math.round((22 + Math.random() * 15) * 10) / 10,
    humidity: Math.round((40 + Math.random() * 35) * 10) / 10,
    gasLevel: Math.round(80 + Math.random() * 200),
  }))
}

function getStatus(type: string, value: number | boolean | string): { label: string; variant: "default" | "secondary" | "destructive" } {
  if (type === "flame") {
    return value ? { label: "DANGER", variant: "destructive" } : { label: "SAFE", variant: "default" }
  }
  if (type === "temperature") {
    if (value as number > 38) return { label: "DANGER", variant: "destructive" }
    if (value as number > 32) return { label: "WARNING", variant: "secondary" }
    return { label: "NORMAL", variant: "default" }
  }
  if (type === "humidity") {
    if ((value as number) < 25 || (value as number) > 85) return { label: "WARNING", variant: "secondary" }
    return { label: "NORMAL", variant: "default" }
  }
  if (type === "gas") {
    if (value as number > 350) return { label: "DANGER", variant: "destructive" }
    if (value as number > 200) return { label: "WARNING", variant: "secondary" }
    return { label: "NORMAL", variant: "default" }
  }
  if (type === "distance") {
    if (value as number < 15) return { label: "ALERT", variant: "secondary" }
    return { label: "CLEAR", variant: "default" }
  }
  if (type === "button") {
    return value ? { label: "PRESSED", variant: "secondary" } : { label: "RELEASED", variant: "default" }
  }
  if (type === "object") {
    return value !== "None" ? { label: "DETECTED", variant: "secondary" } : { label: "CLEAR", variant: "default" }
  }
  return { label: "NORMAL", variant: "default" }
}

function getTrend(current: number, previous: number) {
  if (current > previous * 1.02) return { icon: TrendingUp, color: "text-destructive" }
  if (current < previous * 0.98) return { icon: TrendingDown, color: "text-success" }
  return { icon: Minus, color: "text-muted-foreground" }
}

// Replaced by real-time hook in component

export default function DashboardPage() {
  const [isLiveMode, setIsLiveMode] = useState(true)
  const [currentData, setCurrentData] = useState<SensorData>(generateSensorData())
  const [previousData, setPreviousData] = useState<SensorData>(generateSensorData())
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

  useEffect(() => {
    if (!isLiveMode) {
      const interval = setInterval(() => {
        setCurrentData(prev => {
          setPreviousData(prev)
          return generateSensorData()
        })
        setLastUpdated(new Date())
        setChartData(prev => {
          const newData = [...prev.slice(1), {
            time: "now",
            temperature: Math.round((22 + Math.random() * 15) * 10) / 10,
            humidity: Math.round((40 + Math.random() * 35) * 10) / 10,
            gasLevel: Math.round(80 + Math.random() * 200),
          }]
          return newData.map((d, i) => ({ ...d, time: `${i * 5}m` }))
        })
      }, 2000)

      return () => clearInterval(interval)
    }

    // Live mode: Connect to Firebase Realtime Database
    const sensorsRef = ref(database, 'sensors')
    
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setCurrentData(prev => {
          setPreviousData(prev)
          return {
            temperature: data.temperature ?? 0,
            humidity: data.humidity ?? 0,
            gasLevel: data.gasLevel ?? (data.gasDetected ? 450 : 60),
            flameDetected: data.fire ?? false,
            distance: data.distance ?? 0,
            button: data.button ?? false,
            objectDetection: data.objectDetection ?? (data.object ? "MOTION DETECTED" : "None"),
            timestamp: new Date()
          }
        })
        setLastUpdated(new Date())
        setChartData(prev => {
          const newData = [...prev.slice(1), {
            time: "now",
            temperature: data.temperature ?? 0,
            humidity: data.humidity ?? 0,
            gasLevel: data.gasLevel ?? (data.gasDetected ? 450 : 60),
          }]
          return newData.map((d, i) => ({ ...d, time: `${i * 5}m` }))
        })
      }
    }, (error) => {
      console.error("Firebase subscription error:", error)
    })

    return () => unsubscribe()
  }, [isLiveMode])

  const sensors = [
    { key: "temperature", icon: Thermometer, label: "Temperature", unit: "°C", type: "temperature", value: currentData.temperature, prev: previousData.temperature },
    { key: "humidity", icon: Droplets, label: "Humidity", unit: "%", type: "humidity", value: currentData.humidity, prev: previousData.humidity },
    { key: "gasLevel", icon: Wind, label: "Gas Level", unit: "ppm", type: "gas", value: currentData.gasLevel, prev: previousData.gasLevel },
    { key: "flameDetected", icon: Flame, label: "Flame Detection", unit: "", type: "flame", value: currentData.flameDetected, prev: previousData.flameDetected },
    { key: "distance", icon: Ruler, label: "Distance", unit: "cm", type: "distance", value: currentData.distance, prev: previousData.distance },
    { key: "button", icon: ToggleLeft, label: "Button State", unit: "", type: "button", value: currentData.button, prev: previousData.button },
    { key: "objectDetection", icon: Eye, label: "Object Detection", unit: "", type: "object", value: currentData.objectDetection, prev: previousData.objectDetection },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time sensor monitoring and analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
              <span className="text-sm text-muted-foreground">Demo Mode</span>
              <Switch checked={isLiveMode} onCheckedChange={setIsLiveMode} />
              <span className="text-sm text-muted-foreground">Live Mode</span>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${isLiveMode ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-sm font-medium text-foreground">
                {isLiveMode ? "Live" : "Demo"} Mode Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className={`h-4 w-4 ${isLiveMode ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sensor Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {sensors.map((sensor) => {
            const status = getStatus(sensor.type, sensor.value)
            const displayValue = sensor.type === "flame" 
              ? (sensor.value ? "DETECTED" : "CLEAR")
              : sensor.type === "button"
              ? (sensor.value ? "PRESSED" : "NOT PRESSED")
              : sensor.type === "object"
              ? sensor.value
              : `${sensor.value}${sensor.unit}`
            const trend = (sensor.type !== "flame" && sensor.type !== "button" && sensor.type !== "object") 
              ? getTrend(sensor.value as number, sensor.prev as number) 
              : null

            return (
              <Card key={sensor.key} className="border-border/50 bg-card shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.variant === "destructive" ? "bg-destructive/10" : status.variant === "secondary" ? "bg-warning/10" : "bg-primary/10"}`}>
                      <sensor.icon className={`h-5 w-5 ${status.variant === "destructive" ? "text-destructive" : status.variant === "secondary" ? "text-warning" : "text-primary"}`} />
                    </div>
                    <Badge 
                      variant={status.variant}
                      className={status.variant === "default" ? "bg-success text-success-foreground" : status.variant === "secondary" ? "bg-warning text-warning-foreground" : ""}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-1">{sensor.label}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-foreground">{displayValue}</p>
                    {trend && <trend.icon className={`h-4 w-4 ${trend.color}`} />}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="border-border/50 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Temperature & Humidity Trends
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
                <Wind className="h-5 w-5 text-secondary" />
                Gas Level Monitor
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
                      dataKey="gasLevel" 
                      stroke="oklch(0.55 0.12 230)" 
                      strokeWidth={2}
                      dot={{ fill: "oklch(0.55 0.12 230)", strokeWidth: 0, r: 3 }}
                      name="Gas (ppm)"
                    />
                    {/* Danger threshold line */}
                    <Line 
                      type="monotone" 
                      dataKey={() => 300} 
                      stroke="oklch(0.55 0.22 25)" 
                      strokeDasharray="5 5"
                      strokeWidth={1}
                      dot={false}
                      name="Danger Threshold"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Web Cam AI Detection Feed */}
        <WebcamObjectDetector />

        {/* Weather Integration */}
        <Card className="border-border/50 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-primary" />
                Weather Integration
              </CardTitle>
              <Badge variant="outline" className="text-xs">Powered by Weather API</Badge>
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
