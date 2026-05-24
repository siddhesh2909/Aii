"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  GitBranch,
  Database,
  ArrowRight,
  ArrowDown,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Share2,
  Eye,
  EyeOff,
  Layers,
  Table2,
  FileCode,
  Cloud,
  Server,
  Box,
  ChevronRight,
  ChevronDown,
  Info,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  Settings,
  RefreshCw,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LineageNode {
  id: string
  name: string
  type: "source" | "transformation" | "dataset" | "dashboard" | "model"
  subtype?: string
  status: "healthy" | "warning" | "error"
  description?: string
  owner?: string
  lastUpdated?: string
  upstream?: string[]
  downstream?: string[]
  columns?: { name: string; type: string; description?: string }[]
}

const lineageData: LineageNode[] = [
  {
    id: "src-postgres",
    name: "PostgreSQL - Production",
    type: "source",
    subtype: "Database",
    status: "healthy",
    description: "Main production database",
    owner: "Data Engineering",
    lastUpdated: "Real-time",
    downstream: ["raw-customers", "raw-orders"],
    columns: [
      { name: "customer_id", type: "VARCHAR", description: "Primary key" },
      { name: "email", type: "VARCHAR", description: "Customer email" },
      { name: "created_at", type: "TIMESTAMP", description: "Registration date" },
    ]
  },
  {
    id: "src-s3",
    name: "S3 - Data Lake",
    type: "source",
    subtype: "Object Storage",
    status: "healthy",
    description: "Raw data storage",
    owner: "Platform Team",
    lastUpdated: "Hourly",
    downstream: ["raw-events"]
  },
  {
    id: "src-api",
    name: "Stripe API",
    type: "source",
    subtype: "API",
    status: "warning",
    description: "Payment data source",
    owner: "Finance Team",
    lastUpdated: "15 min",
    downstream: ["raw-payments"]
  },
  {
    id: "raw-customers",
    name: "raw_customers",
    type: "dataset",
    subtype: "Raw Table",
    status: "healthy",
    owner: "Data Engineering",
    lastUpdated: "5 min ago",
    upstream: ["src-postgres"],
    downstream: ["stg-customers"],
    columns: [
      { name: "id", type: "INT", description: "Customer ID" },
      { name: "email", type: "STRING" },
      { name: "name", type: "STRING" },
      { name: "created_at", type: "TIMESTAMP" },
    ]
  },
  {
    id: "raw-orders",
    name: "raw_orders",
    type: "dataset",
    subtype: "Raw Table",
    status: "healthy",
    owner: "Data Engineering",
    lastUpdated: "5 min ago",
    upstream: ["src-postgres"],
    downstream: ["stg-orders"]
  },
  {
    id: "raw-events",
    name: "raw_events",
    type: "dataset",
    subtype: "Raw Table",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "1 hour ago",
    upstream: ["src-s3"],
    downstream: ["stg-events"]
  },
  {
    id: "raw-payments",
    name: "raw_payments",
    type: "dataset",
    subtype: "Raw Table",
    status: "warning",
    owner: "Finance Team",
    lastUpdated: "20 min ago",
    upstream: ["src-api"],
    downstream: ["stg-payments"]
  },
  {
    id: "stg-customers",
    name: "stg_customers",
    type: "transformation",
    subtype: "Staging",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "10 min ago",
    upstream: ["raw-customers"],
    downstream: ["dim-customers"]
  },
  {
    id: "stg-orders",
    name: "stg_orders",
    type: "transformation",
    subtype: "Staging",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "10 min ago",
    upstream: ["raw-orders"],
    downstream: ["fct-orders"]
  },
  {
    id: "stg-events",
    name: "stg_events",
    type: "transformation",
    subtype: "Staging",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "1.5 hours ago",
    upstream: ["raw-events"],
    downstream: ["fct-user-activity"]
  },
  {
    id: "stg-payments",
    name: "stg_payments",
    type: "transformation",
    subtype: "Staging",
    status: "warning",
    owner: "Finance Team",
    lastUpdated: "25 min ago",
    upstream: ["raw-payments"],
    downstream: ["fct-revenue"]
  },
  {
    id: "dim-customers",
    name: "dim_customers",
    type: "dataset",
    subtype: "Dimension",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "15 min ago",
    upstream: ["stg-customers"],
    downstream: ["mart-customer-360", "dashboard-exec"]
  },
  {
    id: "fct-orders",
    name: "fct_orders",
    type: "dataset",
    subtype: "Fact Table",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "15 min ago",
    upstream: ["stg-orders"],
    downstream: ["mart-sales", "ml-demand-forecast"]
  },
  {
    id: "fct-user-activity",
    name: "fct_user_activity",
    type: "dataset",
    subtype: "Fact Table",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "2 hours ago",
    upstream: ["stg-events"],
    downstream: ["mart-engagement"]
  },
  {
    id: "fct-revenue",
    name: "fct_revenue",
    type: "dataset",
    subtype: "Fact Table",
    status: "warning",
    owner: "Finance Team",
    lastUpdated: "30 min ago",
    upstream: ["stg-payments"],
    downstream: ["mart-financial", "dashboard-finance"]
  },
  {
    id: "mart-customer-360",
    name: "mart_customer_360",
    type: "dataset",
    subtype: "Data Mart",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "20 min ago",
    upstream: ["dim-customers"],
    downstream: ["dashboard-exec", "ml-churn-prediction"]
  },
  {
    id: "mart-sales",
    name: "mart_sales",
    type: "dataset",
    subtype: "Data Mart",
    status: "healthy",
    owner: "Sales Ops",
    lastUpdated: "20 min ago",
    upstream: ["fct-orders"],
    downstream: ["dashboard-sales"]
  },
  {
    id: "ml-demand-forecast",
    name: "ML: Demand Forecast",
    type: "model",
    subtype: "ML Model",
    status: "healthy",
    owner: "Data Science",
    lastUpdated: "Daily",
    upstream: ["fct-orders"],
    downstream: []
  },
  {
    id: "ml-churn-prediction",
    name: "ML: Churn Prediction",
    type: "model",
    subtype: "ML Model",
    status: "healthy",
    owner: "Data Science",
    lastUpdated: "Daily",
    upstream: ["mart-customer-360"],
    downstream: []
  },
  {
    id: "dashboard-exec",
    name: "Executive Dashboard",
    type: "dashboard",
    subtype: "BI Dashboard",
    status: "healthy",
    owner: "Analytics Team",
    lastUpdated: "Real-time",
    upstream: ["dim-customers", "mart-customer-360"],
    downstream: []
  },
  {
    id: "dashboard-sales",
    name: "Sales Dashboard",
    type: "dashboard",
    subtype: "BI Dashboard",
    status: "healthy",
    owner: "Sales Ops",
    lastUpdated: "Real-time",
    upstream: ["mart-sales"],
    downstream: []
  },
  {
    id: "dashboard-finance",
    name: "Finance Dashboard",
    type: "dashboard",
    subtype: "BI Dashboard",
    status: "warning",
    owner: "Finance Team",
    lastUpdated: "35 min ago",
    upstream: ["fct-revenue"],
    downstream: []
  },
]

const getNodeIcon = (type: string) => {
  switch (type) {
    case "source": return Cloud
    case "transformation": return FileCode
    case "dataset": return Table2
    case "dashboard": return Layers
    case "model": return Box
    default: return Database
  }
}

const getNodeColor = (type: string) => {
  switch (type) {
    case "source": return "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30"
    case "transformation": return "from-amber-500/20 to-amber-500/5 border-amber-500/30"
    case "dataset": return "from-indigo-500/20 to-indigo-500/5 border-indigo-500/30"
    case "dashboard": return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30"
    case "model": return "from-violet-500/20 to-violet-500/5 border-violet-500/30"
    default: return "from-muted to-muted border-border"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy": return "bg-emerald-500"
    case "warning": return "bg-amber-500"
    case "error": return "bg-red-500"
    default: return "bg-muted-foreground"
  }
}

export default function LineagePage() {
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [zoom, setZoom] = useState(100)
  const [showLabels, setShowLabels] = useState(true)
  const [highlightPath, setHighlightPath] = useState(true)
  const [activeLayer, setActiveLayer] = useState<string | null>(null)

  const layers = [
    { id: "sources", label: "Sources", count: lineageData.filter(n => n.type === "source").length },
    { id: "raw", label: "Raw", count: lineageData.filter(n => n.subtype === "Raw Table").length },
    { id: "staging", label: "Staging", count: lineageData.filter(n => n.subtype === "Staging").length },
    { id: "marts", label: "Marts", count: lineageData.filter(n => n.subtype?.includes("Mart") || n.subtype?.includes("Fact") || n.subtype?.includes("Dimension")).length },
    { id: "consumers", label: "Consumers", count: lineageData.filter(n => n.type === "dashboard" || n.type === "model").length },
  ]

  const getFilteredNodes = () => {
    let nodes = lineageData
    if (searchQuery) {
      nodes = nodes.filter(n => 
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (activeLayer) {
      switch (activeLayer) {
        case "sources":
          nodes = nodes.filter(n => n.type === "source")
          break
        case "raw":
          nodes = nodes.filter(n => n.subtype === "Raw Table")
          break
        case "staging":
          nodes = nodes.filter(n => n.subtype === "Staging")
          break
        case "marts":
          nodes = nodes.filter(n => n.subtype?.includes("Mart") || n.subtype?.includes("Fact") || n.subtype?.includes("Dimension"))
          break
        case "consumers":
          nodes = nodes.filter(n => n.type === "dashboard" || n.type === "model")
          break
      }
    }
    return nodes
  }

  const groupedNodes = {
    sources: lineageData.filter(n => n.type === "source"),
    raw: lineageData.filter(n => n.subtype === "Raw Table"),
    staging: lineageData.filter(n => n.subtype === "Staging"),
    marts: lineageData.filter(n => n.subtype?.includes("Mart") || n.subtype?.includes("Fact") || n.subtype?.includes("Dimension")),
    consumers: lineageData.filter(n => n.type === "dashboard" || n.type === "model"),
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Main Lineage View */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
          {/* Header */}
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between border-b py-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                Data Lineage
              </CardTitle>
              <CardDescription>Visualize data flow and dependencies</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search nodes..." 
                  className="pl-8 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm w-12 text-center">{zoom}%</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Export as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share View
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Lineage
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          {/* Layer Filters */}
          <div className="flex-shrink-0 border-b px-4 py-2 flex items-center gap-2 overflow-x-auto">
            <span className="text-sm text-muted-foreground flex-shrink-0">Layers:</span>
            <Button
              variant={activeLayer === null ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveLayer(null)}
            >
              All
            </Button>
            {layers.map((layer) => (
              <Button
                key={layer.id}
                variant={activeLayer === layer.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              >
                {layer.label}
                <Badge variant="outline" className="ml-1.5 text-[10px] px-1.5">
                  {layer.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Lineage Visualization */}
          <div className="flex-1 overflow-auto p-6" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
            <div className="flex gap-8 min-w-max">
              {/* Sources Column */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
                  <Cloud className="h-4 w-4" />
                  Sources
                </h3>
                {groupedNodes.sources.map((node) => (
                  <LineageNodeCard
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onClick={() => setSelectedNode(node)}
                    showLabels={showLabels}
                  />
                ))}
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>

              {/* Raw Column */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
                  <Database className="h-4 w-4" />
                  Raw Layer
                </h3>
                {groupedNodes.raw.map((node) => (
                  <LineageNodeCard
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onClick={() => setSelectedNode(node)}
                    showLabels={showLabels}
                  />
                ))}
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>

              {/* Staging Column */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
                  <FileCode className="h-4 w-4" />
                  Staging
                </h3>
                {groupedNodes.staging.map((node) => (
                  <LineageNodeCard
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onClick={() => setSelectedNode(node)}
                    showLabels={showLabels}
                  />
                ))}
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>

              {/* Marts Column */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
                  <Table2 className="h-4 w-4" />
                  Data Marts
                </h3>
                {groupedNodes.marts.map((node) => (
                  <LineageNodeCard
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onClick={() => setSelectedNode(node)}
                    showLabels={showLabels}
                  />
                ))}
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
              </div>

              {/* Consumers Column */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-4">
                  <Layers className="h-4 w-4" />
                  Consumers
                </h3>
                {groupedNodes.consumers.map((node) => (
                  <LineageNodeCard
                    key={node.id}
                    node={node}
                    isSelected={selectedNode?.id === node.id}
                    onClick={() => setSelectedNode(node)}
                    showLabels={showLabels}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex-shrink-0 border-t px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch id="labels" checked={showLabels} onCheckedChange={setShowLabels} />
                <Label htmlFor="labels" className="text-sm">Show labels</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="highlight" checked={highlightPath} onCheckedChange={setHighlightPath} />
                <Label htmlFor="highlight" className="text-sm">Highlight path</Label>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Healthy
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Warning
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Error
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Details Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 overflow-hidden"
          >
            <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = getNodeIcon(selectedNode.type)
                      return <Icon className="h-5 w-5 text-primary" />
                    })()}
                    <CardTitle className="text-lg">{selectedNode.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{selectedNode.subtype || selectedNode.type}</Badge>
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedNode.status)}`} />
                    <span className="text-xs text-muted-foreground capitalize">{selectedNode.status}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                    <TabsTrigger value="columns" className="flex-1">Schema</TabsTrigger>
                    <TabsTrigger value="lineage" className="flex-1">Lineage</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4 space-y-4">
                    {selectedNode.description && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <p className="text-sm mt-1">{selectedNode.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Owner</Label>
                        <p className="text-sm mt-1 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {selectedNode.owner || "Unassigned"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Last Updated</Label>
                        <p className="text-sm mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedNode.lastUpdated || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Open
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="columns" className="mt-4">
                    {selectedNode.columns ? (
                      <ScrollArea className="h-[300px]">
                        <div className="space-y-2">
                          {selectedNode.columns.map((col, i) => (
                            <div key={i} className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-sm">{col.name}</span>
                                <Badge variant="outline" className="text-[10px]">{col.type}</Badge>
                              </div>
                              {col.description && (
                                <p className="text-xs text-muted-foreground mt-1">{col.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No schema information available</p>
                    )}
                  </TabsContent>

                  <TabsContent value="lineage" className="mt-4 space-y-4">
                    {selectedNode.upstream && selectedNode.upstream.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Upstream Dependencies</Label>
                        <div className="mt-2 space-y-1">
                          {selectedNode.upstream.map((id) => {
                            const node = lineageData.find(n => n.id === id)
                            return node ? (
                              <button
                                key={id}
                                onClick={() => setSelectedNode(node)}
                                className="w-full flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 p-2 hover:bg-muted/50 transition-colors text-left"
                              >
                                {(() => {
                                  const Icon = getNodeIcon(node.type)
                                  return <Icon className="h-4 w-4 text-muted-foreground" />
                                })()}
                                <span className="text-sm">{node.name}</span>
                              </button>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                    {selectedNode.downstream && selectedNode.downstream.length > 0 && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Downstream Dependents</Label>
                        <div className="mt-2 space-y-1">
                          {selectedNode.downstream.map((id) => {
                            const node = lineageData.find(n => n.id === id)
                            return node ? (
                              <button
                                key={id}
                                onClick={() => setSelectedNode(node)}
                                className="w-full flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 p-2 hover:bg-muted/50 transition-colors text-left"
                              >
                                {(() => {
                                  const Icon = getNodeIcon(node.type)
                                  return <Icon className="h-4 w-4 text-muted-foreground" />
                                })()}
                                <span className="text-sm">{node.name}</span>
                              </button>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LineageNodeCard({ 
  node, 
  isSelected, 
  onClick,
  showLabels
}: { 
  node: LineageNode
  isSelected: boolean
  onClick: () => void
  showLabels: boolean
}) {
  const Icon = getNodeIcon(node.type)
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl border bg-gradient-to-br p-3 transition-all
        ${getNodeColor(node.type)}
        ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-start gap-2.5">
        <div className="rounded-lg bg-background/50 p-1.5">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{node.name}</span>
            <div className={`h-2 w-2 rounded-full flex-shrink-0 ${getStatusColor(node.status)}`} />
          </div>
          {showLabels && (
            <span className="text-xs text-muted-foreground">{node.subtype || node.type}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
