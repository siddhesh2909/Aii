"use client"

import { motion } from "framer-motion"
import { 
  Database, 
  Sparkles, 
  Users, 
  MessageSquare, 
  BarChart3, 
  GitBranch,
  Shield,
  Zap
} from "lucide-react"

const features = [
  {
    icon: <Database className="w-6 h-6" />,
    title: "Adaptive Data Contracts",
    description: "Connect CSV, Excel, JSON, MySQL, REST APIs, Salesforce, and Mailchimp. Auto-detect schemas and handle evolving data structures without fixed dependencies.",
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20 text-primary",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered Cleaning",
    description: "Automated date standardization, currency normalization, duplicate detection, anomaly flagging, and missing value handling with human-in-the-loop approvals.",
    color: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/20 text-accent",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaborative Workflows",
    description: "Team comments, approvals, reviews, notifications, and audit logs. Role-based access for Admins, Data Engineers, Analysts, and Business Users.",
    color: "from-chart-3/20 to-chart-3/5",
    iconBg: "bg-chart-3/20 text-chart-3",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "AI Chatbot Assistant",
    description: "Natural language queries, dataset exploration, SQL generation, visualization suggestions, and automated report summaries.",
    color: "from-chart-4/20 to-chart-4/5",
    iconBg: "bg-chart-4/20 text-chart-4",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Analytics & Insights",
    description: "AI-generated dashboards, KPI tracking, drill-down analytics, trend analysis, and export capabilities for data-driven decisions.",
    color: "from-chart-5/20 to-chart-5/5",
    iconBg: "bg-chart-5/20 text-chart-5",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Data Lineage Tracking",
    description: "Visual pipeline flows, source-to-dashboard tracking, processing dependencies, and complete data transformation history.",
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20 text-primary",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function FeaturesSection() {
  return (
    <section className="py-24 relative" id="features">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Platform Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Everything you need for{" "}
            <span className="text-primary">modern data operations</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            A complete suite of tools designed for enterprise data teams. 
            From ingestion to insights, we handle the complexity so you can focus on impact.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative glass rounded-2xl p-8 h-full hover:border-primary/30 transition-colors duration-300">
                <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full glass">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Real-time Processing</span>
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <Users className="w-5 h-5 text-chart-3" />
              <span className="text-sm font-medium">Team Collaboration</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
