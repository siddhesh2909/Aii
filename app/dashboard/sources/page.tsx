"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileSpreadsheet,
  FileJson,
  Database,
  Globe,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  X,
  ArrowRight,
  Table,
  Eye,
  Sparkles,
  Brain,
  Trash2,
  RefreshCw,
  InboxIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { api } from "@/lib/api"

/* ─── Types ─────────────────────────────────────────────── */
interface Dataset {
  id: string
  name: string
  source: string
  type: string
  rows: number
  columns: number
  quality: number
  status: string
  owner: string
  created_at?: string
}

interface SchemaField {
  name: string
  type: string
  null_percentage: number
  sample_values: string[]
}

interface AiInsights {
  summary: string
  quality_score: number
  missing_value_analysis: string
  preprocessing_suggestions: string[]
  anomaly_warnings: string[]
}

interface DatasetDetails {
  dataset: Dataset
  schema: SchemaField[]
  preview_columns: string[]
  preview_rows: any[][]
  ai_insights: AiInsights
}

interface Toast {
  id: number
  type: "success" | "error" | "info"
  message: string
}

/* ─── Connector definitions ──────────────────────────────── */
const connectors = [
  { id: "csv",   name: "CSV",      icon: FileSpreadsheet, description: "Upload CSV files",         color: "chart-1" },
  { id: "excel", name: "Excel",    icon: FileSpreadsheet, description: "Upload Excel files",       color: "chart-2" },
  { id: "json",  name: "JSON",     icon: FileJson,        description: "Upload JSON files",        color: "chart-3" },
  { id: "mysql", name: "MySQL",    icon: Database,        description: "Connect MySQL database",   color: "chart-4" },
  { id: "api",   name: "REST API", icon: Globe,           description: "Connect REST endpoints",   color: "chart-5" },
]

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

/* ─── Utility ────────────────────────────────────────────── */
const str = (val: any) => {
  if (val === null || val === undefined) return ""
  if (typeof val === "object") return JSON.stringify(val)
  return String(val)
}

let toastCounter = 0

/* ══════════════════════════════════════════════════════════ */
export default function DataSourcesPage() {
  const [activeConnector, setActiveConnector] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress]   = useState(0)
  const [isUploading, setIsUploading]         = useState(false)
  const [dragActive, setDragActive]           = useState(false)
  const [datasets, setDatasets]               = useState<Dataset[]>([])
  const [loadingList, setLoadingList]         = useState(true)
  const [selectedDetails, setSelectedDetails] = useState<DatasetDetails | null>(null)
  const [loadingDetails, setLoadingDetails]   = useState(false)
  const [deletingId, setDeletingId]           = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [toasts, setToasts]                   = useState<Toast[]>([])

  /* ── Toast helpers ──────────────────────────────────────── */
  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = ++toastCounter
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])

  /* ── Fetch dataset list ─────────────────────────────────── */
  const fetchDatasets = useCallback(async () => {
    setLoadingList(true)
    try {
      const res = await api.get("/datasets")
      if (res.data.success) {
        setDatasets(res.data.data ?? [])
      } else {
        addToast("error", "Failed to load datasets.")
      }
    } catch {
      addToast("error", "Could not connect to backend. Is the server running on port 8000?")
    } finally {
      setLoadingList(false)
    }
  }, [addToast])

  useEffect(() => { fetchDatasets() }, [fetchDatasets])

  /* ── Load dataset details ───────────────────────────────── */
  const handleLoadDetails = async (datasetId: string) => {
    if (selectedDetails?.dataset?.id === datasetId) {
      setSelectedDetails(null)
      return
    }
    setLoadingDetails(true)
    setSelectedDetails(null)
    try {
      const res = await api.get(`/datasets/${datasetId}`)
      if (res.data.success) {
        setSelectedDetails(res.data.data)
      } else {
        addToast("error", "Failed to load dataset details.")
      }
    } catch {
      addToast("error", "Failed to fetch dataset details from backend.")
    } finally {
      setLoadingDetails(false)
    }
  }

  /* ── Delete dataset ─────────────────────────────────────── */
  const handleDelete = async (datasetId: string) => {
    setDeletingId(datasetId)
    setConfirmDeleteId(null)
    try {
      const res = await api.delete(`/datasets/${datasetId}`)
      if (res.data.success) {
        addToast("success", "Dataset deleted successfully.")
        setDatasets(prev => prev.filter(d => d.id !== datasetId))
        if (selectedDetails?.dataset?.id === datasetId) setSelectedDetails(null)
      } else {
        addToast("error", res.data.message ?? "Could not delete dataset.")
      }
    } catch (err: any) {
      addToast("error", err.response?.data?.message ?? "Failed to delete dataset.")
    } finally {
      setDeletingId(null)
    }
  }

  /* ── Drag & Drop handlers ───────────────────────────────── */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0])
  }

  /* ── File upload ────────────────────────────────────────── */
  const handleFileUpload = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase()
    if (!["csv", "xlsx", "xls", "json"].includes(ext ?? "")) {
      addToast("error", `Unsupported file type: .${ext}. Use CSV, Excel, or JSON.`)
      return
    }

    setIsUploading(true)
    setUploadProgress(10)
    setSelectedDetails(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploadProgress(40)
      const res = await api.post("/datasets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 60) + 20)
        },
      })
      setUploadProgress(100)
      if (res.data.success) {
        addToast("success", `"${file.name}" uploaded and analyzed successfully!`)
        fetchDatasets()
        setSelectedDetails(res.data.data)
      } else {
        addToast("error", res.data.message ?? "Upload failed.")
        setUploadProgress(0)
      }
    } catch (err: any) {
      addToast("error", err.response?.data?.message ?? "Upload failed. Check the file format and try again.")
      setUploadProgress(0)
    } finally {
      setTimeout(() => { setIsUploading(false); setUploadProgress(0) }, 1200)
    }
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

      {/* ── Toast container ── */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm max-w-[340px] backdrop-blur-sm ${
                t.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : t.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }`}
            >
              {t.type === "success" ? <Check className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Data Source Hub</h1>
          <p className="text-muted-foreground">Connect and manage your data sources from various platforms</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDatasets} disabled={loadingList}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loadingList ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </motion.div>

      {/* ── Upload drop zone ── */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="pt-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              {isUploading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                  <div>
                    <p className="font-medium mb-2">Uploading &amp; Analyzing...</p>
                    <div className="w-64 h-2 bg-muted rounded-full mx-auto overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{uploadProgress}% complete</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag and drop files here</h3>
                  <p className="text-muted-foreground mb-4">Supports CSV, Excel (.xlsx/.xls), JSON files up to 100 MB</p>
                  <label>
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Browse Files</span>
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls,.json"
                      onChange={e => { if (e.target.files?.[0]) { handleFileUpload(e.target.files[0]); e.target.value = "" } }}
                    />
                  </label>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Connectors grid ── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Data Connectors</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {connectors.map(connector => (
            <Card
              key={connector.id}
              className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                activeConnector === connector.id ? "border-primary ring-2 ring-primary/20" : ""
              }`}
              onClick={() => setActiveConnector(prev => prev === connector.id ? null : connector.id)}
            >
              <CardContent className="pt-6">
                <div className={`w-12 h-12 rounded-xl bg-${connector.color}/10 flex items-center justify-center mb-4`}>
                  <connector.icon className={`w-6 h-6 text-${connector.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{connector.name}</h3>
                <p className="text-sm text-muted-foreground">{connector.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ── Connector configuration panel ── */}
      <AnimatePresence>
        {activeConnector && (
          <motion.div
            key={activeConnector}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Configure {connectors.find(c => c.id === activeConnector)?.name} Connection
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setActiveConnector(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {activeConnector === "mysql" && (
                  <MySQLConnectorForm
                    addToast={addToast}
                    onImportSuccess={details => {
                      setActiveConnector(null)
                      fetchDatasets()
                      setSelectedDetails(details)
                    }}
                  />
                )}
                {activeConnector === "api" && (
                  <APIConnectorForm
                    addToast={addToast}
                    onImportSuccess={details => {
                      setActiveConnector(null)
                      fetchDatasets()
                      setSelectedDetails(details)
                    }}
                  />
                )}
                {["csv", "excel", "json"].includes(activeConnector) && (
                  <FileUploadForm
                    type={activeConnector}
                    handleFileUpload={file => {
                      setActiveConnector(null)
                      handleFileUpload(file)
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirmation banner ── */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-center justify-between"
          >
            <p className="text-sm font-medium text-red-400">
              Are you sure you want to permanently delete this dataset? This cannot be undone.
            </p>
            <div className="flex items-center gap-2 ml-4">
              <Button size="sm" variant="outline" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
              <Button
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Connected Data Sources list ── */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold mb-4">Connected Data Sources</h2>

        {loadingList ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading datasets…</p>
          </div>
        ) : datasets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <InboxIcon className="w-12 h-12 opacity-30" />
              <p className="font-medium">No datasets yet</p>
              <p className="text-sm">Upload a file or connect a data source above to get started.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {datasets.map(dataset => (
              <Card
                key={dataset.id}
                className={`transition-all ${selectedDetails?.dataset?.id === dataset.id ? "border-primary/60 ring-1 ring-primary/20" : ""}`}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Database className="w-6 h-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{dataset.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                          <span>{dataset.source}</span>
                          <span>•</span>
                          <span>{(dataset.rows ?? 0).toLocaleString()} rows</span>
                          <span>•</span>
                          <span>{dataset.columns} columns</span>
                          <span>•</span>
                          <span className="uppercase text-xs font-mono">{dataset.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={dataset.status} />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadDetails(dataset.id)}
                        disabled={loadingDetails}
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Preview
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadDetails(dataset.id)}
                        disabled={loadingDetails}
                      >
                        <Table className="w-4 h-4 mr-1.5" />
                        Schema &amp; AI
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setConfirmDeleteId(dataset.id)}
                        disabled={deletingId === dataset.id}
                      >
                        {deletingId === dataset.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Details loading indicator ── */}
      {loadingDetails && (
        <Card className="p-8 text-center border-border/50 bg-card/30 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Running schema parsing and generating AI insights…</p>
        </Card>
      )}

      {/* ── Dataset details panel ── */}
      <AnimatePresence>
        {selectedDetails && !loadingDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-4"
          >
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    {selectedDetails.dataset.name} — Details
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedDetails.dataset.rows?.toLocaleString()} rows •{" "}
                    {selectedDetails.dataset.columns} columns •{" "}
                    Ingested {new Date(selectedDetails.dataset.created_at ?? Date.now()).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDetails(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-[420px] mb-6">
                    <TabsTrigger value="preview">Dataset Preview</TabsTrigger>
                    <TabsTrigger value="schema">Schema</TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      AI Insights
                    </TabsTrigger>
                  </TabsList>

                  {/* ─ Preview tab ─ */}
                  <TabsContent value="preview">
                    {(!selectedDetails.preview_columns || selectedDetails.preview_columns.length === 0) ? (
                      <div className="text-center py-10 text-muted-foreground text-sm">No preview data available for this dataset.</div>
                    ) : (
                      <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
                        <div className="overflow-x-auto max-h-[360px]">
                          <table className="w-full text-sm font-sans border-collapse">
                            <thead className="bg-muted/50 sticky top-0 border-b border-border/50">
                              <tr>
                                {selectedDetails.preview_columns.map(col => (
                                  <th key={col} className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDetails.preview_rows.map((row, i) => (
                                <tr key={i} className="border-t border-border/30 hover:bg-muted/15 transition-colors">
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-2.5 text-foreground/80 whitespace-nowrap font-mono text-xs">
                                      {cell === null || cell === undefined
                                        ? <span className="text-muted-foreground/40 italic">null</span>
                                        : str(cell)
                                      }
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* ─ Schema tab ─ */}
                  <TabsContent value="schema">
                    {(!selectedDetails.schema || selectedDetails.schema.length === 0) ? (
                      <div className="text-center py-10 text-muted-foreground text-sm">No schema information available.</div>
                    ) : (
                      <div className="rounded-xl border border-border/50 bg-muted/20 overflow-hidden">
                        <table className="w-full text-sm font-sans">
                          <thead className="bg-muted/50 border-b border-border/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Field Name</th>
                              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Inferred Type</th>
                              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Null %</th>
                              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Sample Values</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedDetails.schema.map((field, i) => (
                              <tr key={i} className="border-t border-border/30 hover:bg-muted/15 transition-colors">
                                <td className="px-4 py-3 font-mono font-medium text-foreground">{field.name}</td>
                                <td className="px-4 py-3">
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-semibold">
                                    {field.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs">{field.null_percentage}%</td>
                                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                                  {field.sample_values?.length
                                    ? field.sample_values.join(", ")
                                    : <span className="text-muted-foreground/40 italic">none</span>
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </TabsContent>

                  {/* ─ AI Insights tab ─ */}
                  <TabsContent value="insights" className="space-y-6">
                    {!selectedDetails.ai_insights || Object.keys(selectedDetails.ai_insights).length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground text-sm">AI insights not available for this dataset.</div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-4">
                            <Card className="border-border/30 bg-muted/10 p-5 rounded-xl">
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <Brain className="w-4 h-4 text-primary" />
                                Dataset Domain Summary
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {selectedDetails.ai_insights.summary}
                              </p>
                            </Card>

                            <Card className="border-border/30 bg-muted/10 p-5 rounded-xl">
                              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                Missing Value &amp; Column Analysis
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {selectedDetails.ai_insights.missing_value_analysis}
                              </p>
                            </Card>
                          </div>

                          <div>
                            <Card className="border-border/30 bg-muted/10 p-5 rounded-xl text-center flex flex-col items-center justify-center">
                              <span className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Data Quality Score</span>
                              <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-primary/20">
                                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-primary animate-pulse" />
                                <span className="text-3xl font-extrabold text-foreground">
                                  {selectedDetails.ai_insights.quality_score}%
                                </span>
                              </div>
                              <span className="text-xs text-primary font-medium mt-3">GROQ AI Ingestion Profile</span>
                            </Card>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-500" />
                              AI Preprocessing Suggestions
                            </h4>
                            <ul className="space-y-2">
                              {(selectedDetails.ai_insights.preprocessing_suggestions ?? []).map((rec, i) => (
                                <li key={i} className="text-sm text-muted-foreground bg-muted/20 border border-border/30 px-3 py-2 rounded-lg flex items-start gap-2">
                                  <span className="text-xs font-bold text-primary shrink-0 mt-0.5">{i + 1}.</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-destructive" />
                              Anomaly Warnings &amp; Flags
                            </h4>
                            <ul className="space-y-2">
                              {(selectedDetails.ai_insights.anomaly_warnings ?? []).map((warn, i) => (
                                <li key={i} className="text-sm text-muted-foreground bg-destructive/5 border border-destructive/10 px-3 py-2 rounded-lg flex items-start gap-2">
                                  <span className="text-xs font-bold text-destructive shrink-0 mt-0.5">•</span>
                                  <span>{warn}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════
   StatusBadge
══════════════════════════════════════════════════════════ */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    active:         { label: "Active",         className: "bg-green-500/10 text-green-500",  icon: <Check className="w-3 h-3" /> },
    processing:     { label: "Processing",     className: "bg-blue-500/10 text-blue-500",    icon: <Loader2 className="w-3 h-3 animate-spin" /> },
    pending_review: { label: "Pending Review", className: "bg-yellow-500/10 text-yellow-500", icon: <AlertCircle className="w-3 h-3" /> },
    error:          { label: "Error",          className: "bg-red-500/10 text-red-500",      icon: <AlertCircle className="w-3 h-3" /> },
  }
  const { label, className, icon } = config[status] ?? config.active
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
      {icon} {label}
    </span>
  )
}

/* ══════════════════════════════════════════════════════════
   MySQLConnectorForm
══════════════════════════════════════════════════════════ */
function MySQLConnectorForm({
  onImportSuccess,
  addToast,
}: {
  onImportSuccess: (details: DatasetDetails) => void
  addToast: (type: Toast["type"], message: string) => void
}) {
  const [testing,   setTesting]   = useState(false)
  const [connected, setConnected] = useState(false)
  const [importing, setImporting] = useState(false)
  const [host,      setHost]      = useState("db.example.com")
  const [port,      setPort]      = useState("3306")
  const [username,  setUsername]  = useState("admin")
  const [password,  setPassword]  = useState("")
  const [database,  setDatabase]  = useState("production_db")
  const [tableName, setTableName] = useState("")
  const [feedback,  setFeedback]  = useState<{ type: "ok" | "err"; msg: string } | null>(null)
  const [tables,    setTables]    = useState<string[]>([])

  const handleTest = async () => {
    if (!host || !database || !username) {
      setFeedback({ type: "err", msg: "Host, database, and username are required." })
      return
    }
    setTesting(true)
    setFeedback(null)
    setConnected(false)
    setTables([])
    try {
      const res = await api.post("/connections/mysql", {
        host,
        port: parseInt(port) || 3306,
        username,
        password,
        database,
      })
      if (res.data.success) {
        setConnected(true)
        const discoveredTables: string[] = res.data.data?.tables ?? []
        setTables(discoveredTables)
        if (discoveredTables.length > 0 && !tableName) setTableName(discoveredTables[0])
        setFeedback({ type: "ok", msg: res.data.message ?? "MySQL connection active! Tables loaded." })
      } else {
        setFeedback({ type: "err", msg: res.data.message ?? "Connection failed." })
      }
    } catch (err: any) {
      setFeedback({ type: "err", msg: err.response?.data?.message ?? "Failed to connect to MySQL." })
    } finally {
      setTesting(false)
    }
  }

  const handleImport = async () => {
    const table = tableName || tables[0] || "users_analytics"
    setImporting(true)
    try {
      const res = await api.post("/datasets/import-mysql", {
        host,
        port: parseInt(port) || 3306,
        username,
        password,
        database,
        table_name: table,
      })
      if (res.data.success) {
        addToast("success", `MySQL table "${table}" imported and analyzed!`)
        onImportSuccess(res.data.data)
      } else {
        addToast("error", res.data.message ?? "Import failed.")
      }
    } catch (err: any) {
      addToast("error", err.response?.data?.message ?? "Failed to import MySQL dataset.")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div className={`p-3 rounded-lg text-sm border ${
          feedback.type === "ok"
            ? "bg-green-500/10 border-green-500/20 text-green-500"
            : "bg-red-500/10 border-red-500/20 text-red-500"
        }`}>
          {feedback.msg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Host</Label>
          <Input placeholder="localhost" value={host} onChange={e => setHost(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Port</Label>
          <Input placeholder="3306" value={port} onChange={e => setPort(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Database Name</Label>
        <Input placeholder="my_database" value={database} onChange={e => setDatabase(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      </div>

      {connected && tables.length > 0 && (
        <div className="space-y-2">
          <Label>Select Table to Import</Label>
          <select
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            value={tableName}
            onChange={e => setTableName(e.target.value)}
          >
            {tables.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex flex-wrap gap-2 mt-1 max-h-[100px] overflow-y-auto">
            {tables.map(t => (
              <span key={t} className="text-xs bg-muted border px-2.5 py-1 rounded-md font-mono">{t}</span>
            ))}
          </div>
        </div>
      )}

      {connected && tables.length === 0 && (
        <div className="space-y-2">
          <Label>Table Name</Label>
          <Input placeholder="users_analytics" value={tableName} onChange={e => setTableName(e.target.value)} />
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleTest} disabled={testing} variant="outline">
          {testing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Testing…</> :
           connected ? <><Check className="w-4 h-4 mr-2" />Connected</> : "Test Connection"}
        </Button>
        <Button onClick={handleImport} disabled={!connected || importing}>
          {importing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importing…</> :
           <><ArrowRight className="w-4 h-4 mr-2" />Import Data</>}
        </Button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   APIConnectorForm
══════════════════════════════════════════════════════════ */
function APIConnectorForm({
  onImportSuccess,
  addToast,
}: {
  onImportSuccess: (details: DatasetDetails) => void
  addToast: (type: Toast["type"], message: string) => void
}) {
  const [testing,   setTesting]   = useState(false)
  const [connected, setConnected] = useState(false)
  const [importing, setImporting] = useState(false)
  const [url,       setUrl]       = useState("")
  const [method,    setMethod]    = useState("GET")
  const [headers,   setHeaders]   = useState("")
  const [feedback,  setFeedback]  = useState<{ type: "ok" | "err"; msg: string } | null>(null)
  const [fields,    setFields]    = useState<any[]>([])
  const [headersError, setHeadersError] = useState("")

  const parseHeaders = () => {
    if (!headers.trim()) return {}
    try {
      const parsed = JSON.parse(headers)
      setHeadersError("")
      return parsed
    } catch {
      setHeadersError("Headers must be valid JSON, e.g. {\"Authorization\": \"Bearer token\"}")
      return null
    }
  }

  const handleTest = async () => {
    if (!url.trim()) {
      setFeedback({ type: "err", msg: "API endpoint URL is required." })
      return
    }
    const parsedHeaders = parseHeaders()
    if (parsedHeaders === null) return

    setTesting(true)
    setFeedback(null)
    setConnected(false)
    setFields([])
    try {
      const res = await api.post("/connections/api", { url, method, headers: parsedHeaders })
      if (res.data.success) {
        setConnected(true)
        setFields(res.data.data?.inferred_fields ?? [])
        setFeedback({ type: "ok", msg: res.data.message ?? "REST endpoint parsed successfully!" })
      } else {
        setFeedback({ type: "err", msg: res.data.message ?? "Failed to parse endpoint." })
      }
    } catch (err: any) {
      setFeedback({ type: "err", msg: err.response?.data?.message ?? "Could not reach REST endpoint." })
    } finally {
      setTesting(false)
    }
  }

  const handleImport = async () => {
    const parsedHeaders = parseHeaders()
    if (parsedHeaders === null) return

    let datasetName = "REST API Dataset"
    try { datasetName = "REST API: " + new URL(url).hostname } catch {}

    setImporting(true)
    try {
      const res = await api.post("/datasets/import-api", {
        url,
        method,
        headers: parsedHeaders,
        dataset_name: datasetName,
      })
      if (res.data.success) {
        addToast("success", `REST API schema from "${url}" imported!`)
        onImportSuccess(res.data.data)
      } else {
        addToast("error", res.data.message ?? "Import failed.")
      }
    } catch (err: any) {
      addToast("error", err.response?.data?.message ?? "Failed to import REST API dataset.")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      {feedback && (
        <div className={`p-3 rounded-lg text-sm border ${
          feedback.type === "ok"
            ? "bg-green-500/10 border-green-500/20 text-green-500"
            : "bg-red-500/10 border-red-500/20 text-red-500"
        }`}>
          {feedback.msg}
        </div>
      )}

      <div className="space-y-2">
        <Label>API Endpoint URL</Label>
        <Input
          placeholder="https://api.example.com/data"
          value={url}
          onChange={e => { setUrl(e.target.value); setConnected(false) }}
        />
      </div>

      <div className="space-y-2">
        <Label>HTTP Method</Label>
        <select
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          value={method}
          onChange={e => setMethod(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Custom Headers (JSON)</Label>
        <Input
          placeholder='{"Authorization": "Bearer token", "Accept": "application/json"}'
          value={headers}
          onChange={e => { setHeaders(e.target.value); setHeadersError("") }}
        />
        {headersError && <p className="text-xs text-red-500">{headersError}</p>}
      </div>

      {connected && fields.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase font-bold">Inferred Fields</Label>
          <div className="rounded-xl border bg-muted/20 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="px-3 py-2">Field</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Sample</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, i) => (
                  <tr key={i} className="border-t border-border/30 hover:bg-muted/15">
                    <td className="px-3 py-2 font-mono font-medium">{f.name}</td>
                    <td className="px-3 py-2">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold uppercase">{f.type}</span>
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground truncate max-w-[120px]">{f.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleTest} disabled={testing} variant="outline">
          {testing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Testing…</> :
           connected ? <><Check className="w-4 h-4 mr-2" />Connected</> : "Test Connection"}
        </Button>
        <Button onClick={handleImport} disabled={!connected || importing}>
          {importing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importing…</> :
           <><ArrowRight className="w-4 h-4 mr-2" />Import Data</>}
        </Button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   FileUploadForm (CSV / Excel / JSON via connector tile)
══════════════════════════════════════════════════════════ */
function FileUploadForm({
  type,
  handleFileUpload,
}: {
  type: string
  handleFileUpload: (file: File) => void
}) {
  const [file, setFile] = useState<File | null>(null)

  const accept =
    type === "excel" ? ".xlsx,.xls" :
    type === "csv"   ? ".csv" :
    type === "json"  ? ".json" : ".csv,.xlsx,.xls,.json"

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select {type.toUpperCase()} File</Label>
        <Input
          type="file"
          accept={accept}
          onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]) }}
        />
        {file && (
          <p className="text-xs text-muted-foreground">Selected: <span className="font-mono font-medium">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="autoSchema" className="rounded" defaultChecked disabled />
        <label htmlFor="autoSchema" className="text-sm text-muted-foreground">
          Auto-detect schema and column types
        </label>
      </div>

      <Button
        onClick={() => {
          if (file) {
            handleFileUpload(file)
          }
        }}
        disabled={!file}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload &amp; Analyze
      </Button>
    </div>
  )
}
