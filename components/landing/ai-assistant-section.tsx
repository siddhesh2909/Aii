"use client"

import { motion } from "framer-motion"
import { Bot, Send, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const sampleConversation = [
  {
    role: "assistant",
    content: "Hello! I'm your AI data assistant. How can I help you today?",
  },
  {
    role: "user",
    content: "Show me duplicate records in the sales data",
  },
  {
    role: "assistant",
    content: "I found 234 potential duplicate records based on customer_id and email matching. Here's a summary:\n\n• 156 exact duplicates\n• 78 fuzzy matches (90%+ similarity)\n\nWould you like me to create a cleaning task to remove these duplicates?",
  },
  {
    role: "user",
    content: "Yes, and normalize all currencies to USD",
  },
  {
    role: "assistant",
    content: "I've created two cleaning tasks:\n\n1. ✓ Duplicate Removal - 234 records\n2. ✓ Currency Normalization - 3,420 records\n\nBoth tasks are ready for your review in the AI Cleaning Workspace. I'll also generate a before/after comparison for you.",
  },
]

const suggestedPrompts = [
  "Generate sales dashboard",
  "Show missing values",
  "Create revenue trends",
  "Explain data quality",
]

export function AIAssistantSection() {
  const [activeMessage, setActiveMessage] = useState(sampleConversation.length)

  return (
    <section className="py-24 relative" id="ai-assistant">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">AI Chatbot Assistant</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Talk to your data in{" "}
              <span className="text-primary">natural language</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Ask questions, generate insights, create visualizations, and automate 
              data operations using simple conversational commands. Our AI understands 
              your data context and provides intelligent suggestions.
            </p>

            <div className="space-y-4">
              {[
                "Query datasets with natural language",
                "Generate SQL and visualizations automatically",
                "Get AI-powered data quality suggestions",
                "Create reports and dashboards from prompts",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="glass rounded-2xl overflow-hidden border border-border/50">
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-border bg-card/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">DataFlow AI Assistant</h4>
                  <p className="text-xs text-muted-foreground">Always ready to help</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {sampleConversation.slice(0, activeMessage).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Suggested prompts */}
              <div className="px-6 py-3 border-t border-border bg-card/30">
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Ask anything about your data..."
                    className="flex-1 bg-muted rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button size="icon" className="rounded-full shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
