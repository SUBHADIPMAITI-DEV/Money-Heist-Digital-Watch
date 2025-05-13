"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, BellOff, Volume2, VolumeX } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function DigitalWatch() {
  const [time, setTime] = useState(new Date())
  const [alarmTime, setAlarmTime] = useState("")
  const [isAlarmSet, setIsAlarmSet] = useState(false)
  const [isAlarmRinging, setIsAlarmRinging] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [is24HourFormat, setIs24HourFormat] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date()
      setTime(newTime)

      // Check if alarm should ring
      if (isAlarmSet && !isAlarmRinging) {
        const currentTimeString = `${newTime.getHours().toString().padStart(2, "0")}:${newTime.getMinutes().toString().padStart(2, "0")}`
        if (currentTimeString === alarmTime) {
          setIsAlarmRinging(true)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isAlarmSet, alarmTime, isAlarmRinging])

  // Separate effect to handle audio playback when alarm state changes
  useEffect(() => {
    if (isAlarmRinging && audioRef.current && !isMuted) {
      // Create a promise to handle the play attempt
      const playPromise = audioRef.current.play()

      // If playPromise is defined (not undefined), handle potential errors
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            console.log("Alarm sound playing")
          })
          .catch((error) => {
            // Auto-play was prevented or other error
            console.error("Error playing audio:", error)
            // We'll still keep isAlarmRinging true so the visual effects work
            // even if sound doesn't play due to browser restrictions
          })
      }
    } else if (!isAlarmRinging && audioRef.current) {
      // Only pause if the audio is actually playing
      if (!audioRef.current.paused) {
        audioRef.current.pause()
      }
      audioRef.current.currentTime = 0
    }
  }, [isAlarmRinging, isMuted])

  // Initialize audio when component mounts
  useEffect(() => {
    // Test audio playback on component mount to check if audio is working
    if (audioRef.current) {
      audioRef.current.volume = 0.7 // Set default volume

      // Load the audio file
      audioRef.current.load()
    }
  }, [])

  // Format time based on 12/24 hour setting
  const formatTime = () => {
    let hours = time.getHours()
    const minutes = time.getMinutes().toString().padStart(2, "0")
    const seconds = time.getSeconds().toString().padStart(2, "0")
    let period = ""

    if (!is24HourFormat) {
      period = hours >= 12 ? "PM" : "AM"
      hours = hours % 12 || 12 // Convert to 12-hour format (0 becomes 12)
    }

    const formattedHours = (is24HourFormat ? hours : hours).toString().padStart(2, "0")

    return {
      timeString: `${formattedHours}:${minutes}:${seconds}`,
      period,
    }
  }

  const { timeString, period } = formatTime()

  const handleSetAlarm = () => {
    setIsAlarmSet(true)
  }

  const handleStopAlarm = () => {
    setIsAlarmRinging(false)
    setIsAlarmSet(false)
    // Audio pausing is now handled in the useEffect
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      if (!isMuted) {
        // If we're muting and the alarm is ringing, pause the audio
        if (isAlarmRinging && !audioRef.current.paused) {
          audioRef.current.pause()
        }
      } else {
        // If we're unmuting and the alarm is ringing, play the audio
        if (isAlarmRinging) {
          audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
        }
      }
    }
  }

  // Function to test audio playback
  const testAlarmSound = () => {
    if (audioRef.current && !isMuted) {
      // Save current time
      const currentTime = audioRef.current.currentTime

      // Play a short snippet
      audioRef.current.currentTime = 0
      audioRef.current
        .play()
        .then(() => {
          // Stop after 2 seconds
          setTimeout(() => {
            if (audioRef.current && !isAlarmRinging) {
              audioRef.current.pause()
              audioRef.current.currentTime = currentTime
            }
          }, 2000)
        })
        .catch((e) => console.error("Error testing audio:", e))
    }
  }

  const toggleTimeFormat = () => {
    setIs24HourFormat(!is24HourFormat)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Audio element for alarm sound */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/bella-ciao.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Money Heist themed watch */}
      <div
        className={`relative rounded-xl border-2 ${isAlarmRinging ? "animate-pulse border-red-400" : "border-red-600"} bg-black p-8 shadow-2xl`}
      >
        {/* Top details with Money Heist logo reference and time format toggle */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-600"></div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <span className={!is24HourFormat ? "font-bold" : ""}>12h</span>
              <Switch
                checked={is24HourFormat}
                onCheckedChange={toggleTimeFormat}
                className="data-[state=checked]:bg-red-600"
              />
              <span className={is24HourFormat ? "font-bold" : ""}>24h</span>
            </div>
          </div>
          <div className="text-xs font-bold text-red-600">BELLA CIAO</div>
          <div className="h-2 w-2 rounded-full bg-red-600"></div>
        </div>

        {/* Digital time display with Money Heist colors */}
        <div
          className={`mb-6 rounded-md border ${isAlarmRinging ? "border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.7)]" : "border-red-700"} bg-black p-6 text-center shadow-inner`}
        >
          <div className="flex items-center justify-center">
            <div
              className={`font-mono text-5xl font-bold tracking-wider ${isAlarmRinging ? "text-red-400" : "text-red-500"}`}
            >
              {timeString}
            </div>
            {!is24HourFormat && <div className="ml-2 font-mono text-xl font-bold text-red-500">{period}</div>}
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {time.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Alarm controls */}
        <div className="mb-4 flex items-center gap-2">
          <Input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="border-red-700 bg-black text-red-500 focus:border-red-500 focus:ring-red-500"
            disabled={isAlarmSet}
          />
          {isAlarmRinging ? (
            <Button variant="destructive" size="sm" onClick={handleStopAlarm} className="bg-red-600 hover:bg-red-700">
              <BellOff className="mr-1 h-4 w-4" />
              Stop
            </Button>
          ) : isAlarmSet ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAlarmSet(false)}
              className="border-red-600 text-red-600 hover:bg-red-900/20 hover:text-red-500"
            >
              <BellOff className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetAlarm}
              className="border-red-600 text-red-600 hover:bg-red-900/20 hover:text-red-500"
              disabled={!alarmTime}
            >
              <Bell className="mr-1 h-4 w-4" />
              Set
            </Button>
          )}

          {/* Mute button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-red-600 hover:bg-red-900/20 hover:text-red-500"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          {/* Test sound button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={testAlarmSound}
            className="text-red-600 hover:bg-red-900/20 hover:text-red-500"
            disabled={isMuted}
          >
            Test
          </Button>
        </div>

        {/* Bottom detail with Money Heist red */}
        <div className="flex justify-center">
          <div className="h-1 w-16 rounded-full bg-red-700"></div>
        </div>
      </div>

      {/* Pendulum container with Dalí mask */}
      <div className="relative mt-0 flex h-60 w-full justify-center">
        <motion.div
          className="absolute top-0 origin-top"
          animate={{
            rotate: isAlarmRinging
              ? [15, -15, 15, -15, 15, -15, 15] // Faster swinging when alarm is ringing
              : [15, -15, 15],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: isAlarmRinging ? 1 : 2,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top center" }}
        >
          {/* Pendulum rod - red for Money Heist */}
          <div className="mx-auto h-48 w-0.5 bg-gradient-to-b from-red-400 to-red-600"></div>

          {/* Salvador Dalí mask pendulum weight */}
          <div className="relative -mt-1 flex h-16 w-14 items-center justify-center">
            {/* Mask base */}
            <div
              className={`h-16 w-14 rounded-b-full rounded-t-xl ${isAlarmRinging ? "bg-red-100" : "bg-white"} shadow-lg`}
            ></div>

            {/* Mask features */}
            <div className="absolute inset-0">
              {/* Mustache */}
              <div className="absolute left-1/2 top-9 h-3 w-10 -translate-x-1/2 border-t-2 border-black"></div>
              <div className="absolute left-1/2 top-10 h-2 w-8 -translate-x-1/2 border-t border-black"></div>

              {/* Eyes */}
              <div className="absolute left-3 top-5 h-2 w-2 rounded-full bg-black"></div>
              <div className="absolute right-3 top-5 h-2 w-2 rounded-full bg-black"></div>

              {/* Eyebrows */}
              <div className="absolute left-2 top-3 h-1 w-3 rotate-12 rounded-full bg-black"></div>
              <div className="absolute right-2 top-3 h-1 w-3 -rotate-12 rounded-full bg-black"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
