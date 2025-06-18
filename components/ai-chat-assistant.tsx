"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Mic, MicOff, Bot, User, Lightbulb, Target, BookOpen } from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
  actionItems?: Array<{
    type: "course" | "job" | "skill"
    title: string
    action: () => void
  }>
}

interface AIChatAssistantProps {
  userProfile?: {
    name: string
    role: string
    skills: string[]
    experience: string
  }
  isOpen: boolean
  onClose: () => void
}

export function AIChatAssistant({ userProfile, isOpen, onClose }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: `Hi ${userProfile?.name || "there"}! I'm your AI career assistant. I can help you with career advice, skill development, job search strategies, and interview preparation. What would you like to discuss today?`,
      timestamp: new Date(),
      suggestions: [
        "How can I improve my resume?",
        "What skills should I learn next?",
        "Help me prepare for interviews",
        "Show me salary trends for my role",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addToast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const responses = {
      resume: {
        content: `Based on your ${userProfile?.experience || "mid-level"} experience in ${userProfile?.role || "software development"}, here are key resume improvements:

1. **Quantify achievements**: Add metrics to your accomplishments
2. **Highlight relevant skills**: Emphasize ${userProfile?.skills?.[0] || "JavaScript"} and ${userProfile?.skills?.[1] || "React"}
3. **Use action verbs**: Start bullet points with strong action words
4. **Tailor for ATS**: Include keywords from job descriptions

Would you like me to analyze your current resume or help you rewrite specific sections?`,
        suggestions: ["Analyze my current resume", "Help rewrite my summary", "Suggest better keywords"],
        actionItems: [
          {
            type: "course",
            title: "Resume Writing Masterclass",
            action: () =>
              addToast({
                type: "info",
                title: "Course Recommended",
                description: "Resume Writing course added to your learning path",
              }),
          },
        ],
      },
      skills: {
        content: `For a ${userProfile?.role || "Software Developer"}, I recommend focusing on these trending skills:

**High Priority:**
• TypeScript (95% job demand increase)
• Cloud platforms (AWS/Azure)
• DevOps practices

**Emerging Technologies:**
• AI/ML fundamentals
• Microservices architecture
• Cybersecurity basics

Based on your current skills (${userProfile?.skills?.slice(0, 3).join(", ") || "JavaScript, React, Node.js"}), I suggest starting with TypeScript as it builds on your existing knowledge.`,
        suggestions: [
          "Show me TypeScript courses",
          "What about cloud certifications?",
          "Help me create a learning plan",
        ],
        actionItems: [
          {
            type: "skill",
            title: "Start TypeScript Learning Path",
            action: () =>
              addToast({
                type: "success",
                title: "Learning Path Created",
                description: "TypeScript fundamentals added to your goals",
              }),
          },
          {
            type: "course",
            title: "AWS Cloud Practitioner",
            action: () =>
              addToast({
                type: "info",
                title: "Course Suggested",
                description: "Cloud certification path recommended",
              }),
          },
        ],
      },
      interview: {
        content: `Great! Let me help you prepare for ${userProfile?.role || "software developer"} interviews:

**Technical Preparation:**
• Practice coding problems (LeetCode, HackerRank)
• Review system design concepts
• Prepare to explain your projects in detail

**Behavioral Questions:**
• Use the STAR method (Situation, Task, Action, Result)
• Prepare stories about challenges and achievements
• Practice explaining complex technical concepts simply

**Mock Interview Tips:**
• Record yourself answering questions
• Practice with peers or mentors
• Time your responses (2-3 minutes max)

Would you like to start a mock interview session?`,
        suggestions: ["Start mock interview", "Practice coding questions", "Help with behavioral questions"],
        actionItems: [
          {
            type: "course",
            title: "Mock Interview Session",
            action: () =>
              addToast({ type: "success", title: "Interview Prep", description: "Mock interview scheduled" }),
          },
        ],
      },
      salary: {
        content: `Here's the current salary landscape for ${userProfile?.role || "Software Developers"}:

**Market Trends:**
• Average salary: $85,000 - $130,000
• ${userProfile?.experience || "Mid-level"} range: $95,000 - $115,000
• Top skills premium: +15-25% for cloud/AI skills

**Negotiation Strategy:**
• Research company-specific ranges
• Highlight unique value propositions
• Consider total compensation package
• Practice negotiation scenarios

**Next Steps:**
• Update your skills to command higher salary
• Build a portfolio showcasing impact
• Network within target companies`,
        suggestions: ["Show negotiation scripts", "Find salary data for my city", "Help improve my value proposition"],
        actionItems: [
          {
            type: "course",
            title: "Salary Negotiation Workshop",
            action: () =>
              addToast({ type: "info", title: "Workshop Added", description: "Negotiation skills course recommended" }),
          },
        ],
      },
    }

    const messageKey =
      userMessage.toLowerCase().includes("resume") || userMessage.toLowerCase().includes("cv")
        ? "resume"
        : userMessage.toLowerCase().includes("skill") || userMessage.toLowerCase().includes("learn")
          ? "skills"
          : userMessage.toLowerCase().includes("interview") || userMessage.toLowerCase().includes("prepare")
            ? "interview"
            : userMessage.toLowerCase().includes("salary") || userMessage.toLowerCase().includes("pay")
              ? "salary"
              : "skills"

    const response = responses[messageKey]

    return {
      id: Date.now().toString(),
      type: "assistant",
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
      actionItems: response.actionItems,
    }
  }

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim()
    if (!messageToSend) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: messageToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const aiResponse = await generateAIResponse(messageToSend)
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      addToast({
        type: "error",
        title: "AI Assistant Error",
        description: "Sorry, I'm having trouble responding right now. Please try again.",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      addToast({
        type: "error",
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input.",
      })
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputMessage(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
      addToast({
        type: "error",
        title: "Voice Input Error",
        description: "Could not recognize speech. Please try again.",
      })
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Career Assistant</CardTitle>
              <p className="text-sm text-gray-600">Your personal career advisor</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === "assistant" && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                      {message.type === "user" && <User className="w-4 h-4 mt-1" />}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Action Items */}
                  {message.actionItems && (
                    <div className="mt-2 space-y-2">
                      {message.actionItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            {item.type === "course" && <BookOpen className="w-4 h-4 text-blue-600" />}
                            {item.type === "skill" && <Target className="w-4 h-4 text-green-600" />}
                            {item.type === "job" && <Lightbulb className="w-4 h-4 text-orange-600" />}
                            <span className="text-sm font-medium">{item.title}</span>
                          </div>
                          <Button size="sm" onClick={item.action}>
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about your career..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceInput}
                disabled={isListening}
                className={isListening ? "bg-red-100" : ""}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button onClick={() => handleSendMessage()} disabled={!inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
