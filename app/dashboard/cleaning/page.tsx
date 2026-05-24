"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  AlertTriangle,
  Check,
  X,
  RotateCcw,
  Eye,
  Filter,
  Clock,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Loader2,
  Trash2,
  Copy,
  Calendar,
  DollarSign,
  Hash,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockCleaningTasks, mockDatasets } from "@/lib/mock-data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const cleaningTypes = [
  { id: "all", label: "All Tasks", count: 12 },
  { id: "duplicate_removal", label: "Duplicates", count: 3, icon: Copy },
  { id: "date_normalization", label: "Date Format", count: 4, icon: Calendar },
  { id: "currency_normalization", label: "Currency", count: 2, icon: DollarSign },
  { id: "missing_value_detection", label: "Missing Values", count: 2, icon: Hash },
  { id: "anomaly_detection", label: "Anomalies", count: 1, icon: AlertTriangle },
]

export default function AICleaningPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [expandedTask, setExpandedTask] = useState<string | null>("ct-001")
  const [processingTask, setProcessingTask] = useState<string | null>(null)

  const handleApprove = (taskId: string) => {
    setProcessingTask(taskId)
    setTimeout(() => setProcessingTask(null), 1500)
  }

  const filteredTasks = selectedType === "all" 
    ? mockCleaningTasks 
    : mockCleaningTasks.filter((t) => t.type === selectedType)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">AI Data Cleaning Workspace</h1>
          <p className="text-muted-foreground">
            Review and approve AI-powered data transformations with full audit trails
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-analyze
          </Button>
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Run AI Cleaning
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Pending Reviews"
          value="7"
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <StatCard
          label="Approved Today"
          value="12"
          icon={<Check className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          label="Rejected"
          value="2"
          icon={<X className="w-5 h-5" />}
          color="red"
        />
        <StatCard
          label="Avg. Confidence"
          value="94%"
          icon={<Sparkles className="w-5 h-5" />}
          color="primary"
        />
      </motion.div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Task Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {cleaningTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedType === type.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {type.icon && <type.icon className="w-4 h-4" />}
                    {type.label}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    selectedType === type.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {type.count}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Dataset selector */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
                <option>All Datasets</option>
                {mockDatasets.map((ds) => (
                  <option key={ds.id}>{ds.name}</option>
                ))}
              </select>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tasks list */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-4">
          {filteredTasks.map((task) => (
            <CleaningTaskCard
              key={task.id}
              task={task}
              isExpanded={expandedTask === task.id}
              isProcessing={processingTask === task.id}
              onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              onApprove={() => handleApprove(task.id)}
            />
          ))}
        </motion.div>
      </div>

      {/* Workflow visualization */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Cleaning Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkflowVisualization />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: "yellow" | "green" | "red" | "primary"
}) {
  const colorClasses = {
    yellow: "bg-yellow-500/10 text-yellow-500",
    green: "bg-green-500/10 text-green-500",
    red: "bg-red-500/10 text-red-500",
    primary: "bg-primary/10 text-primary",
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CleaningTaskCard({
  task,
  isExpanded,
  isProcessing,
  onToggle,
  onApprove,
}: {
  task: typeof mockCleaningTasks[0]
  isExpanded: boolean
  isProcessing: boolean
  onToggle: () => void
  onApprove: () => void
}) {
  const typeLabels: Record<string, { label: string; icon: typeof Copy; color: string }> = {
    duplicate_removal: { label: "Duplicate Removal", icon: Copy, color: "chart-1" },
    date_normalization: { label: "Date Normalization", icon: Calendar, color: "chart-2" },
    currency_normalization: { label: "Currency Normalization", icon: DollarSign, color: "chart-3" },
    missing_value_detection: { label: "Missing Value Detection", icon: Hash, color: "chart-4" },
    anomaly_detection: { label: "Anomaly Detection", icon: AlertTriangle, color: "chart-5" },
  }

  const typeConfig = typeLabels[task.type] || typeLabels.duplicate_removal
  const Icon = typeConfig.icon

  return (
    <Card className={`transition-all ${task.status === "approved" ? "opacity-60" : ""}`}>
      <CardContent className="py-4">
        {/* Header */}
        <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg bg-${typeConfig.color}/10 flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${typeConfig.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{typeConfig.label}</h3>
                <TaskStatusBadge status={task.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {task.affectedRows.toLocaleString()} records affected • {task.confidence}% confidence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {task.status === "pending_review" && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); onApprove(); }} disabled={isProcessing}>
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-1" />
                  )}
                  Approve
                </Button>
              </div>
            )}
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">{task.suggestedAction}</p>

                {/* Before/After comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Before
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs space-y-1">
                      {task.type === "duplicate_removal" && (
                        <>
                          <div className="text-red-400">{"{"} id: "C001", email: "john@example.com" {"}"}</div>
                          <div className="text-red-400">{"{"} id: "C001", email: "john@example.com" {"}"}</div>
                          <div className="text-muted-foreground">{"{"} id: "C002", email: "jane@example.com" {"}"}</div>
                        </>
                      )}
                      {task.type === "date_normalization" && (
                        <>
                          <div className="text-yellow-400">{"{"} date: "01/15/2024" {"}"}</div>
                          <div className="text-yellow-400">{"{"} date: "2024-01-16" {"}"}</div>
                          <div className="text-yellow-400">{"{"} date: "Jan 17, 2024" {"}"}</div>
                        </>
                      )}
                      {task.type === "currency_normalization" && (
                        <>
                          <div className="text-yellow-400">{"{"} amount: 100, currency: "EUR" {"}"}</div>
                          <div className="text-yellow-400">{"{"} amount: 150, currency: "GBP" {"}"}</div>
                          <div className="text-yellow-400">{"{"} amount: 200, currency: "USD" {"}"}</div>
                        </>
                      )}
                      {task.type === "missing_value_detection" && (
                        <>
                          <div className="text-red-400">{"{"} email: null, phone: "555-0123" {"}"}</div>
                          <div className="text-red-400">{"{"} email: "test@example.com", phone: null {"}"}</div>
                        </>
                      )}
                      {task.type === "anomaly_detection" && (
                        <>
                          <div className="text-red-400">{"{"} amount: -500, date: "2024-01-15" {"}"}</div>
                          <div className="text-red-400">{"{"} amount: 999999, date: "2024-01-16" {"}"}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      After
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs space-y-1">
                      {task.type === "duplicate_removal" && (
                        <>
                          <div className="text-green-400">{"{"} id: "C001", email: "john@example.com" {"}"}</div>
                          <div className="text-muted-foreground">{"{"} id: "C002", email: "jane@example.com" {"}"}</div>
                        </>
                      )}
                      {task.type === "date_normalization" && (
                        <>
                          <div className="text-green-400">{"{"} date: "2024-01-15T00:00:00Z" {"}"}</div>
                          <div className="text-green-400">{"{"} date: "2024-01-16T00:00:00Z" {"}"}</div>
                          <div className="text-green-400">{"{"} date: "2024-01-17T00:00:00Z" {"}"}</div>
                        </>
                      )}
                      {task.type === "currency_normalization" && (
                        <>
                          <div className="text-green-400">{"{"} amount: 108.50, currency: "USD" {"}"}</div>
                          <div className="text-green-400">{"{"} amount: 190.25, currency: "USD" {"}"}</div>
                          <div className="text-green-400">{"{"} amount: 200.00, currency: "USD" {"}"}</div>
                        </>
                      )}
                      {task.type === "missing_value_detection" && (
                        <>
                          <div className="text-green-400">{"{"} email: "unknown@placeholder.com", phone: "555-0123" {"}"}</div>
                          <div className="text-green-400">{"{"} email: "test@example.com", phone: "000-0000" {"}"}</div>
                        </>
                      )}
                      {task.type === "anomaly_detection" && (
                        <>
                          <div className="text-yellow-400">{"{"} amount: -500, flagged: true {"}"}</div>
                          <div className="text-yellow-400">{"{"} amount: 999999, flagged: true {"}"}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Changes
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Rollback
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                    Created {new Date(task.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function TaskStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    pending_review: { label: "Pending Review", className: "bg-yellow-500/10 text-yellow-500" },
    approved: { label: "Approved", className: "bg-green-500/10 text-green-500" },
    rejected: { label: "Rejected", className: "bg-red-500/10 text-red-500" },
    processing: { label: "Processing", className: "bg-blue-500/10 text-blue-500" },
  }

  const { label, className } = config[status] || config.pending_review

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${className}`}>
      {label}
    </span>
  )
}

function WorkflowVisualization() {
  const steps = [
    { label: "Raw Data", status: "complete", icon: "📥" },
    { label: "AI Processing", status: "complete", icon: "🤖" },
    { label: "Human Review", status: "active", icon: "👤" },
    { label: "Approval", status: "pending", icon: "✅" },
    { label: "Storage", status: "pending", icon: "💾" },
    { label: "Dashboard", status: "pending", icon: "📊" },
  ]

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                step.status === "complete"
                  ? "bg-green-500/20"
                  : step.status === "active"
                  ? "bg-primary/20 ring-2 ring-primary"
                  : "bg-muted"
              }`}
            >
              {step.icon}
            </div>
            <span className={`text-xs mt-2 ${step.status === "active" ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className={`w-6 h-6 mx-4 ${step.status === "complete" ? "text-green-500" : "text-muted-foreground/30"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
