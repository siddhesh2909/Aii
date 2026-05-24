"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Database,
  Table2,
  BarChart3,
  Code2,
  FileText,
  Lightbulb,
  ArrowRight,
  Maximize2,
  Minimize2,
  Settings,
  History,
  Bookmark,
  Plus,
  X,
  ChevronDown,
  Play,
  Download,
  Share2,
  Trash2,
  Clock,
  Zap,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/lib/api"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string | Date
  type?: "text" | "sql" | "chart" | "table" | "insight"
  data?: any
  suggestions?: string[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI Data Assistant. I can help you explore your data, write SQL queries, generate insights, and answer questions about your datasets. What would you like to know?",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    type: "text",
    suggestions: [
      "Show me top customers by revenue",
      "Analyze order trends this quarter",
      "Find data quality issues",
      "Explain the customer schema"
    ]
  }
]

const sampleSQLResult = {
  columns: ["customer_id", "name", "total_revenue", "order_count"],
  rows: [
    ["C001", "Acme Corp", "$1,245,000", 156],
    ["C002", "TechStart Inc", "$987,500", 134],
    ["C003", "Global Ventures", "$876,200", 98],
    ["C004", "Innovation Labs", "$654,300", 87],
    ["C005", "Digital Solutions", "$543,100", 76],
  ]
}

const conversationHistory = [
  { id: 1, title: "Revenue Analysis Q3", messages: 12, time: "2 hours ago" },
  { id: 2, title: "Customer Segmentation", messages: 8, time: "Yesterday" },
  { id: 3, title: "Pipeline Debugging", messages: 15, time: "2 days ago" },
  { id: 4, title: "Schema Documentation", messages: 6, time: "3 days ago" },
]

const savedPrompts = [
  { id: 1, title: "Top revenue customers", query: "Show me top 10 customers by total revenue" },
  { id: 2, title: "Monthly trends", query: "Analyze monthly order trends for the past year" },
  { id: 3, title: "Data quality check", query: "Find all records with missing or null values" },
]

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch chatbot logs from backend history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chat/history")
        if (res.data.success && res.data.data.length > 0) {
          setMessages(res.data.data)
        }
      } catch (err) {
        console.error("Failed to load chat history", err)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      type: "text"
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      const response = await api.post("/chat/query", { query: currentInput })
      if (response.data.success) {
        const aiMessage = response.data.data
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (err) {
      console.error("Failed to query chatbot assistant", err)
      // Fallback message
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I ran into a connection issue communicating with the AI platform. Please check that the backend service is active.",
        timestamp: new Date().toISOString(),
        type: "text"
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sidebar - History */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 overflow-hidden"
          >
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                    <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="mt-2">
                    <ScrollArea className="h-[calc(100vh-18rem)]">
                      <div className="space-y-1">
                        {conversationHistory.map((conv) => (
                          <motion.div
                            key={conv.id}
                            whileHover={{ scale: 1.01 }}
                            className="cursor-pointer rounded-lg p-2.5 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{conv.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <MessageSquare className="h-3 w-3" />
                                  {conv.messages} messages
                                  <span>-</span>
                                  {conv.time}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                    <ChevronDown className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Bookmark className="mr-2 h-4 w-4" />
                                    Save
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="saved" className="mt-2">
                    <ScrollArea className="h-[calc(100vh-18rem)]">
                      <div className="space-y-1">
                        {savedPrompts.map((prompt) => (
                          <motion.div
                            key={prompt.id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setInput(prompt.query)}
                            className="cursor-pointer rounded-lg border border-border/50 p-2.5 hover:bg-muted/50 transition-colors"
                          >
                            <p className="text-sm font-medium">{prompt.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{prompt.query}</p>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* Chat Header */}
        <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between border-b py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI Data Assistant</h2>
                <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[80%] space-y-3 ${message.role === "user" ? "items-end" : ""}`}>
                    <div className={`rounded-2xl p-4 ${message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 border border-border/50"
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {/* SQL Result Table */}
                    {message.type === "sql" && !!message.data && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-border/50 bg-muted/30 overflow-hidden"
                      >
                        <div className="flex items-center justify-between border-b border-border/50 bg-muted/50 px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Query Results</span>
                            <Badge variant="secondary" className="text-xs">
                              {(message.data as typeof sampleSQLResult).rows.length} rows
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted/30">
                              <tr>
                                {(message.data as typeof sampleSQLResult).columns.map((col) => (
                                  <th key={col} className="px-4 py-2 text-left font-medium text-muted-foreground">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(message.data as typeof sampleSQLResult).rows.map((row, i) => (
                                <tr key={i} className="border-t border-border/30 hover:bg-muted/20">
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-2">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.role === "assistant" && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-3 py-1.5 text-xs hover:bg-muted/50 hover:border-primary/50 transition-colors"
                          >
                            <Lightbulb className="h-3 w-3 text-primary" />
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Message Actions */}
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-2xl bg-muted/50 border border-border/50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="h-2 w-2 rounded-full bg-primary"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">Analyzing your data...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask anything about your data..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Database className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Select dataset</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Pro tip: Use @ to mention specific tables or datasets</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
