"use client"

import { useState, FormEvent } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft, ArrowDownRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"
import { ChatInput } from "@/components/ui/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat"
import { ChatMessageList } from "@/components/ui/chat-message-list"

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
}

const EXAMPLE_QUESTIONS = [
  'How to raise venture capital?',
  'What\'s the best business model?',
  'How to become a successful entrepreneur?',
] as const

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: `# Hello! 👋\nI'm your bizarre career advisor. Ask me any business question, and I'll suggest the most absurd alternative career! 🎪`,
      sender: "ai",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: "user" as const
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      })
      
      const data = await response.json()
      
      // Format the AI response with markdown
      const formattedResponse = `### ${data.job}\n\n[View similar jobs on Indeed](https://www.indeed.com/jobs?q=${encodeURIComponent(data.job.split('-')[0].trim())})`
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        content: formattedResponse,
        sender: "ai"
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        content: "### Error 😅\nOur career advisor is currently having an existential crisis. Please try again.",
        sender: "ai"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAttachFile = () => {
    // Not implemented for this demo
  }

  const handleMicrophoneClick = () => {
    // Not implemented for this demo
  }

  return (
    <div className="relative min-h-screen">
      <div className="container max-w-2xl mx-auto pt-20 px-4">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/qr.png"
            alt="QR Code"
            width={200}
            height={200}
            className="rounded-lg shadow-lg"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-6">
          Stupid Founder Mode 🎪
        </h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Got a serious business question? Our AI advisor will suggest the most absurd
          alternative career path instead! Because who needs practical advice anyway?
        </p>
        
        <div className="relative text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-sm text-muted-foreground mb-4">
            Examples of questions you can ask:
          </p>
          <ul className="text-sm space-y-2 mb-6">
            {EXAMPLE_QUESTIONS.map((question, index) => (
              <li key={index}>&ldquo;{question}&rdquo;</li>
            ))}
          </ul>
          
          <div className="flex items-end justify-end text-muted-foreground">
            <span className="text-sm mr-2">Your bizarre advisor is waiting</span>
            <ArrowDownRight className="h-5 w-5 animate-bounce" />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Scan the QR code to share with friends!</p>
        </div>
      </div>

      <div className="h-screen relative">
        <ExpandableChat
          size="lg"
          position="bottom-right"
          icon={<Bot className="h-6 w-6" />}
        >
          <ExpandableChatHeader className="flex-col text-center justify-center">
            <h1 className="text-xl font-semibold">Bizarre Career Advisor 🎪</h1>
            <p className="text-sm text-muted-foreground">
              Ask me any business question for absurd career advice!
            </p>
          </ExpandableChatHeader>

          <ExpandableChatBody>
            <ChatMessageList>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    fallback={message.sender === "user" ? "👤" : "🎪"}
                  />
                  <ChatBubbleMessage
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    {message.content}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

              {isLoading && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    fallback="🎪"
                  />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}
            </ChatMessageList>
          </ExpandableChatBody>

          <ExpandableChatFooter>
            <form
              onSubmit={handleSubmit}
              className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
            >
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your serious business question..."
                className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0 justify-between">
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleAttachFile}
                  >
                    <Paperclip className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleMicrophoneClick}
                  >
                    <Mic className="size-4" />
                  </Button>
                </div>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Get Advice
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </ExpandableChatFooter>
        </ExpandableChat>
      </div>
    </div>
  )
}
