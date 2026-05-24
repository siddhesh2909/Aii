"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Share2,
  Filter,
  Calendar,
  RefreshCw,
  Maximize2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Clock,
  Users,
  Activity,
  Zap,
  Eye,
  Settings,
  Sparkles,
  Table2,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RechartsPie,
  Pie,
  Legend,
  LineChart as RechartsLine,
  Line,
  ComposedChart,
} from "recharts"

const kpiData = [
  { label: "Total Data Volume", value: "2.4 PB", change: "+12.5%", trend: "up", icon: Database },
  { label: "Active Pipelines", value: "156", change: "+8", trend: "up", icon: Activity },
  { label: "Data Quality Score", value: "94.2%", change: "+2.1%", trend: "up", icon: Sparkles },
  { label: "Avg Query Time", value: "1.2s", change: "-0.3s", trend: "down", icon: Clock },
]

const dataVolumeData = [
  { month: "Jan", ingested: 180, processed: 165, archived: 45 },
  { month: "Feb", ingested: 220, processed: 195, archived: 52 },
  { month: "Mar", ingested: 280, processed: 260, archived: 68 },
  { month: "Apr", ingested: 310, processed: 285, archived: 75 },
  { month: "May", ingested: 350, processed: 320, archived: 82 },
  { month: "Jun", ingested: 420, processed: 385, archived: 95 },
]

const pipelinePerformance = [
  { name: "Customer ETL", success: 98.5, failures: 1.5, avgTime: 45 },
  { name: "Sales Sync", success: 99.2, failures: 0.8, avgTime: 32 },
  { name: "Marketing Import", success: 96.8, failures: 3.2, avgTime: 67 },
  { name: "Inventory Update", success: 99.5, failures: 0.5, avgTime: 28 },
  { name: "Analytics Refresh", success: 97.2, failures: 2.8, avgTime: 120 },
]

const dataSourceDistribution = [
  { name: "PostgreSQL", value: 35, color: "#6366f1" },
  { name: "Snowflake", value: 25, color: "#8b5cf6" },
  { name: "S3 Buckets", value: 20, color: "#06b6d4" },
  { name: "APIs", value: 12, color: "#10b981" },
  { name: "Files", value: 8, color: "#f59e0b" },
]

const queryMetrics = [
  { hour: "00:00", queries: 120, latency: 0.8 },
  { hour: "04:00", queries: 85, latency: 0.6 },
  { hour: "08:00", queries: 450, latency: 1.2 },
  { hour: "12:00", queries: 680, latency: 1.8 },
  { hour: "16:00", queries: 590, latency: 1.5 },
  { hour: "20:00", queries: 320, latency: 1.0 },
]

const topDatasets = [
  { name: "customers_main", queries: 12450, size: "45 GB", growth: "+5.2%" },
  { name: "orders_2024", queries: 9876, size: "128 GB", growth: "+12.8%" },
  { name: "products_catalog", queries: 8234, size: "12 GB", growth: "+1.2%" },
  { name: "analytics_events", queries: 7654, size: "256 GB", growth: "+18.5%" },
  { name: "user_sessions", queries: 6543, size: "89 GB", growth: "+8.9%" },
]

const recentInsights = [
  { id: 1, title: "Query performance improved by 23%", type: "performance", time: "2h ago" },
  { id: 2, title: "Anomaly detected in sales_data pipeline", type: "alert", time: "4h ago" },
  { id: 3, title: "Storage optimization saved 15 GB", type: "optimization", time: "6h ago" },
  { id: 4, title: "New peak: 50K queries/hour achieved", type: "milestone", time: "1d ago" },
]

const dashboardWidgets = [
  { id: 1, type: "chart", title: "Data Volume Trends", size: "large" },
  { id: 2, type: "chart", title: "Pipeline Performance", size: "medium" },
  { id: 3, type: "chart", title: "Source Distribution", size: "small" },
  { id: 4, type: "table", title: "Top Datasets", size: "medium" },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor data platform performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={kpi.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-cyan-500/10 text-cyan-500"}
                  >
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Data Volume Chart - Large */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Data Volume Trends</CardTitle>
                <CardDescription>Monthly data ingestion, processing, and archival</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Chart
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataVolumeData}>
                    <defs>
                      <linearGradient id="colorIngested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v} TB`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area type="monotone" dataKey="ingested" stroke="#6366f1" fill="url(#colorIngested)" strokeWidth={2} />
                    <Area type="monotone" dataKey="processed" stroke="#8b5cf6" fill="url(#colorProcessed)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#6366f1]" />
                  <span className="text-sm text-muted-foreground">Ingested</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#8b5cf6]" />
                  <span className="text-sm text-muted-foreground">Processed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <span className="text-sm text-muted-foreground">Archived</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Source Distribution - Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Data Source Distribution</CardTitle>
              <CardDescription>By source type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={dataSourceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {dataSourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Share']}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {dataSourceDistribution.map((source) => (
                  <div key={source.name} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-xs text-muted-foreground truncate">{source.name}</span>
                    <span className="text-xs font-medium ml-auto">{source.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pipeline Performance</CardTitle>
              <CardDescription>Success rate and average execution time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={pipelinePerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="success" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Query Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Query Metrics</CardTitle>
              <CardDescription>Queries per hour and average latency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={queryMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}s`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar yAxisId="left" dataKey="queries" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#6366f1]" />
                  <span className="text-sm text-muted-foreground">Queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-sm text-muted-foreground">Latency</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Third Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Datasets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Top Datasets by Usage</CardTitle>
                <CardDescription>Most queried datasets this month</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topDatasets.map((dataset, index) => (
                  <motion.div
                    key={dataset.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{dataset.name}</p>
                        <p className="text-xs text-muted-foreground">{dataset.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{dataset.queries.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">queries</p>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                        {dataset.growth}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI Insights</CardTitle>
              </div>
              <CardDescription>Automated recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`rounded-lg border p-3 ${
                      insight.type === 'alert' 
                        ? 'border-amber-500/30 bg-amber-500/5' 
                        : insight.type === 'milestone'
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-border/50 bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {insight.type === 'performance' && <TrendingUp className="h-4 w-4 text-emerald-500 mt-0.5" />}
                        {insight.type === 'alert' && <Zap className="h-4 w-4 text-amber-500 mt-0.5" />}
                        {insight.type === 'optimization' && <Sparkles className="h-4 w-4 text-primary mt-0.5" />}
                        {insight.type === 'milestone' && <Activity className="h-4 w-4 text-cyan-500 mt-0.5" />}
                        <p className="text-sm">{insight.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">{insight.time}</p>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate More Insights
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
