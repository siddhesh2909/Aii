"use client"

import { motion } from "framer-motion"
import { 
  Upload, 
  Cpu, 
  CheckCircle2, 
  Database, 
  Sparkles, 
  LayoutDashboard,
  ArrowRight
} from "lucide-react"

const workflowSteps = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: "Data Ingestion",
    description: "Connect any data source with drag-and-drop simplicity",
    color: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI Processing",
    description: "Automated cleaning, normalization, and validation",
    color: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Human Approval",
    description: "Review AI suggestions with full audit trails",
    color: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Storage Layer",
    description: "Secure, versioned data warehouse storage",
    color: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Insights",
    description: "Intelligent analysis and pattern detection",
    color: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Dashboards",
    description: "Interactive visualizations and reports",
    color: "bg-primary/20 text-primary border-primary/30",
  },
]

export function WorkflowSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="workflow">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            From raw data to{" "}
            <span className="text-primary">actionable insights</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Our intelligent pipeline handles every step of your data workflow, 
            with AI automation and human oversight working together seamlessly.
          </p>
        </motion.div>

        {/* Workflow visualization */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-chart-1/50 via-primary/50 to-primary/50 -translate-y-1/2" />
          
          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${step.color} border flex items-center justify-center mx-auto mb-4`}>
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                
                {/* Arrow (hidden on last item and mobile) */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "10M+", label: "Records Processed Daily" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "85%", label: "Faster Data Prep" },
            { value: "50+", label: "Data Connectors" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
