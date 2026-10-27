"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScanLine, Eye, Camera, Power, RefreshCw, Smartphone } from "lucide-react"
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs' // Required backend

export function WebcamObjectDetector() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [localDetected, setLocalDetected] = useState<string>("None")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')

  // Handle stream stop properly when component unmounts
  useEffect(() => {
    getDevices()
    return () => stopCamera()
  }, [])

  const getDevices = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      const enumerated = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = enumerated.filter(device => device.kind === "videoinput")
      setDevices(videoDevices)
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId)
      }
    } catch {
      console.warn("Camera permissions initially denied or not available")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
    setLocalDetected("None")
  }

  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera()
      return
    }

    try {
      setIsModelLoading(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevice ? { exact: selectedDevice } : undefined }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = async () => {
          videoRef.current!.play()
          setIsCameraActive(true)

          const model = await cocoSsd.load()
          setIsModelLoading(false)
          detectFrame(videoRef.current!, model)
        }
      }
    } catch (e) {
      console.error(e)
      setIsModelLoading(false)
    }
  }

  const detectFrame = async (video: HTMLVideoElement, model: cocoSsd.ObjectDetection) => {
    if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return

    try {
      const predictions = await model.detect(video)
      
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          let objects = new Set<string>()

          predictions.forEach(prediction => {
            if (prediction.score > 0.5) {
              const [x, y, width, height] = prediction.bbox
              
              const className = prediction.class.toLowerCase()
              let category = className
              let color = "#0ea5e9"

              if (["person"].includes(className)) {
                category = "Human"
                color = "#ef4444" 
              } else if (["cat", "dog", "cow", "horse", "sheep", "elephant", "bird", "bear", "zebra", "giraffe"].includes(className)) {
                category = "Animal"
                color = "#f59e0b"
              } else if (["car", "truck", "motorcycle", "bus", "airplane", "train", "boat", "bicycle"].includes(className)) {
                category = "Vehicle"
                color = "#3b82f6"
              } else if (className === "fire" || className === "smoke") { 
                // COCO-SSD doesn't natively map fire, but just strictly defining the logic string as requested.
                category = "Fire"
                color = "#fb923c"
              }

              objects.add(category)
              
              // Draw box
              ctx.strokeStyle = color
              ctx.lineWidth = 3
              ctx.strokeRect(x, y, width, height)
              
              // Draw background for label
              ctx.fillStyle = color
              const text = `${className} (${Math.round(prediction.score * 100)}%)`
              ctx.font = 'bold 16px Arial'
              ctx.fillRect(x, y - 25, ctx.measureText(text).width + 10, 25)
              
              // Draw label text
              ctx.fillStyle = '#FFFFFF'
              ctx.fillText(text, x + 5, y - 6)
            }
          })

          const detectionList = objects.size > 0 ? Array.from(objects).join(", ") : "None"
          
          setLocalDetected(prev => {
             if (prev !== detectionList) {
                setLastUpdate(new Date())
                return detectionList
             }
             return prev
          })
        }
      }
    } catch (e) {
       // Ignore individual frame errors
    }

    if (isCameraActive) {
      requestAnimationFrame(() => detectFrame(video, model))
    }
  }

  return (
    <Card className="mb-8 border-border/50 bg-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Live Web Cam Object Detection
          </CardTitle>
          <div className="flex items-center gap-3">
             {devices.length > 0 && (
                <div className="flex items-center gap-2 bg-muted px-2 py-1 rounded-md text-xs">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <select 
                       className="bg-transparent text-foreground outline-none border-none cursor-pointer max-w-[150px] truncate"
                       value={selectedDevice}
                       onChange={e => setSelectedDevice(e.target.value)}
                       disabled={isCameraActive}
                    >
                       {devices.map(device => (
                          <option key={device.deviceId} value={device.deviceId}>
                             {device.label || `Camera ${devices.indexOf(device) + 1}`}
                          </option>
                       ))}
                    </select>
                </div>
             )}
             <button 
                 onClick={toggleCamera} 
                 disabled={isModelLoading}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${isCameraActive ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
             >
                 {isModelLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                 {isCameraActive ? "Stop Camera" : isModelLoading ? "Loading AI..." : "Start Camera"}
             </button>
             <Badge variant={localDetected !== "None" ? "destructive" : "outline"} className={localDetected !== "None" ? "animate-pulse" : ""}>
                 {localDetected !== "None" ? `DETECTED: ${localDetected.toUpperCase()}` : "SCANNING..."}
             </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black flex items-center justify-center border-2 border-dashed border-border/50">
          
          <video 
              ref={videoRef} 
              className={`absolute top-0 left-0 w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
              playsInline 
              muted 
          />
          <canvas 
              ref={canvasRef} 
              className={`absolute top-0 left-0 w-full h-full object-cover pointer-events-none ${!isCameraActive ? 'hidden' : ''}`} 
          />
          
          {!isCameraActive && (
            <div className="text-center z-10 transition-opacity duration-500">
              <ScanLine className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground font-medium flex items-center gap-2 justify-center">
                 Waiting for camera access
              </p>
              <p className="text-sm text-muted-foreground opacity-70 mt-1 max-w-sm mx-auto">
                 Select 'iVCam' from the dropdown and click 'Start Camera' to seamlessly connect your mobile device feed and run local visual AI.
              </p>
            </div>
          )}
          
          {/* Decorative scan overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none" />
          {isCameraActive && (
             <div className="absolute left-0 right-0 h-1 bg-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse pointer-events-none" style={{ top: '50%' }} />
          )}
        </div>

        {/* Status log for detections */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
             <div><span className="font-semibold text-foreground">Status:</span> {isCameraActive ? "AI Tracking Active" : "Offline"}</div>
             <div>Last Detection: {localDetected !== "None" ? lastUpdate.toLocaleTimeString() : "N/A"}</div>
        </div>
      </CardContent>
    </Card>
  )
}
