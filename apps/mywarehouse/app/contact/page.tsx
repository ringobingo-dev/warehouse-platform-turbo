"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)

  const recognitionRef = useRef<any>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("")

          setMessage(transcript)

          // Auto-scroll textarea to bottom
          if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
        }
      } else {
        setSpeechSupported(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (error) {
        console.error("Failed to start speech recognition:", error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Simulate sending the message
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Reset form
    setName("")
    setEmail("")
    setMessage("")
    setIsSending(false)

    // Show success message or redirect
    alert("Message sent successfully!")
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          We'd love to hear from you. Fill out the form below or use the speech-to-text feature to send us a message.
        </p>

        <Card className="w-full shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Get in Touch</CardTitle>
            <CardDescription>Send us a message and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  {speechSupported && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={toggleListening}
                      className={cn(
                        "transition-colors",
                        isListening && "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
                      )}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Record Message
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="relative">
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    rows={8}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    ref={textareaRef}
                    className={cn(
                      "resize-none transition-colors",
                      isListening && "border-red-200 focus-visible:ring-red-200",
                    )}
                  />
                  {isListening && (
                    <div className="absolute bottom-3 right-3 flex items-center justify-center h-6 w-6 rounded-full bg-red-100">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                    </div>
                  )}
                </div>
                {isListening && (
                  <p className="text-xs text-muted-foreground">
                    Speak clearly into your microphone. Click "Stop Recording" when finished.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base" disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

