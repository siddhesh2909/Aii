"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileCode2,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Check,
  AlertCircle,
  Clock,
  GitBranch,
  Edit3,
  Copy,
  Trash2,
  Eye,
  History,
  Settings,
  Sparkles,
  ArrowRight,
  Code2,
  Link2,
  Type,
  Hash,
  Calendar,
  ToggleLeft,
  List,
  Map,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockDataContracts, mockSchemaFields } from "@/lib/mock-data"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const fieldTypes = [
  { type: "string", icon: Type, color: "chart-1" },
  { type: "integer", icon: Hash, color: "chart-2" },
  { type: "decimal", icon: Hash, color: "chart-3" },
  { type: "datetime", icon: Calendar, color: "chart-4" },
  { type: "boolean", icon: ToggleLeft, color: "chart-5" },
  { type: "array", icon: List, color: "primary" },
  { type: "object", icon: Map, color: "accent" },
]

export default function DataContractsPage() {
  const [selectedContract, setSelectedContract] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"schema" | "rules" | "lineage" | "history">("schema")
  const [showNewFieldModal, setShowNewFieldModal] = useState(false)

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
          <h1 className="text-3xl font-bold mb-1">Data Contract Studio</h1>
          <p className="text-muted-foreground">
            Define, manage, and version your data contracts with visual schema editing
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </motion.div>

      {/* Search and filters */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search contracts..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracts list */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-3">
          {mockDataContracts.map((contract) => (
            <Card
              key={contract.id}
              className={`cursor-pointer transition-all ${
                selectedContract === contract.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedContract(contract.id)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileCode2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{contract.name}</h3>
                      <p className="text-xs text-muted-foreground">v{contract.version}</p>
                    </div>
                  </div>
                  <ContractStatusBadge status={contract.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{contract.fields} fields</span>
                  <span>•</span>
                  <span>{contract.validationRules} rules</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Contract details */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {selectedContract ? (
            <ContractDetails
              contract={mockDataContracts.find((c) => c.id === selectedContract)!}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showNewFieldModal={showNewFieldModal}
              setShowNewFieldModal={setShowNewFieldModal}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center py-16">
                <FileCode2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Contract</h3>
                <p className="text-muted-foreground">
                  Choose a contract from the list to view and edit its schema
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Schema Evolution Timeline */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Schema Evolution Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {[
                  { version: "2.1.0", date: "Jan 14, 2024", changes: "Added currency field, updated validation rules", type: "minor" },
                  { version: "2.0.0", date: "Jan 10, 2024", changes: "Major restructure - split address into components", type: "major" },
                  { version: "1.3.0", date: "Jan 5, 2024", changes: "Added optional discount field", type: "minor" },
                  { version: "1.2.0", date: "Dec 28, 2023", changes: "Updated date format validation", type: "patch" },
                ].map((version, index) => (
                  <div key={version.version} className="relative pl-10">
                    <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-background ${
                      version.type === "major" ? "bg-primary" : version.type === "minor" ? "bg-accent" : "bg-muted-foreground"
                    }`} />
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-sm font-semibold">v{version.version}</span>
                      <span className="text-xs text-muted-foreground">{version.date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        version.type === "major" ? "bg-primary/10 text-primary" : version.type === "minor" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                      }`}>
                        {version.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{version.changes}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function ContractDetails({
  contract,
  activeTab,
  setActiveTab,
  showNewFieldModal,
  setShowNewFieldModal,
}: {
  contract: typeof mockDataContracts[0]
  activeTab: "schema" | "rules" | "lineage" | "history"
  setActiveTab: (tab: "schema" | "rules" | "lineage" | "history") => void
  showNewFieldModal: boolean
  setShowNewFieldModal: (show: boolean) => void
}) {
  const tabs = [
    { id: "schema" as const, label: "Schema Editor", icon: Code2 },
    { id: "rules" as const, label: "Validation Rules", icon: Check },
    { id: "lineage" as const, label: "Data Lineage", icon: GitBranch },
    { id: "history" as const, label: "History", icon: History },
  ]

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{contract.name}</CardTitle>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>Version {contract.version}</span>
              <span>•</span>
              <span>Created by {contract.createdBy}</span>
              {contract.approvedBy && (
                <>
                  <span>•</span>
                  <span className="text-green-500">Approved by {contract.approvedBy}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Clone
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4 -mb-[17px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-background border border-border border-b-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        {activeTab === "schema" && (
          <SchemaEditor showNewFieldModal={showNewFieldModal} setShowNewFieldModal={setShowNewFieldModal} />
        )}
        {activeTab === "rules" && <ValidationRulesEditor />}
        {activeTab === "lineage" && <DataLineageView />}
        {activeTab === "history" && <ContractHistory />}
      </CardContent>
    </Card>
  )
}

function SchemaEditor({ showNewFieldModal, setShowNewFieldModal }: { showNewFieldModal: boolean; setShowNewFieldModal: (show: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNewFieldModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Auto-Map
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Schema fields table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Field Name</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Required</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Nullable</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Validation</th>
              <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockSchemaFields.map((field, index) => {
              const typeConfig = fieldTypes.find((t) => t.type === field.type) || fieldTypes[0]
              return (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono">{field.name}</code>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full bg-${typeConfig.color}/10 text-${typeConfig.color}`}>
                      <typeConfig.icon className="w-3 h-3" />
                      {field.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {field.required ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {field.nullable ? (
                      <Check className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{field.validation}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* New field modal */}
      <AnimatePresence>
        {showNewFieldModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setShowNewFieldModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold mb-4">Add New Field</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Field Name</Label>
                  <Input placeholder="e.g., customer_email" />
                </div>
                <div className="space-y-2">
                  <Label>Data Type</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {fieldTypes.map((type) => (
                      <button
                        key={type.type}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors`}
                      >
                        <type.icon className={`w-5 h-5 text-${type.color}`} />
                        <span className="text-xs">{type.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Required</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Nullable</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Validation Rule</Label>
                  <Input placeholder="e.g., Email format" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowNewFieldModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNewFieldModal(false)}>
                  Add Field
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ValidationRulesEditor() {
  const rules = [
    { id: 1, field: "customer_id", rule: "Required", type: "required", enabled: true },
    { id: 2, field: "email", rule: "Email Format (RFC 5322)", type: "regex", enabled: true },
    { id: 3, field: "purchase_date", rule: "ISO 8601 Date Format", type: "date", enabled: true },
    { id: 4, field: "amount", rule: "Positive Number (> 0)", type: "range", enabled: true },
    { id: 5, field: "currency", rule: "ISO 4217 Currency Code", type: "enum", enabled: true },
    { id: 6, field: "customer_id", rule: "No Duplicates", type: "unique", enabled: true },
    { id: 7, field: "discount", rule: "Range 0-100%", type: "range", enabled: false },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Validation Rules ({rules.length})</h3>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              rule.enabled ? "border-border bg-card" : "border-border/50 bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${rule.enabled ? "bg-green-500" : "bg-muted-foreground"}`} />
              <div>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-primary">{rule.field}</code>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-sm">{rule.rule}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{rule.type} validation</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Edit3 className="w-4 h-4" />
              </Button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={rule.enabled} />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DataLineageView() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Visual representation of data flow and dependencies</p>
      
      <div className="relative h-[400px] bg-muted/30 rounded-lg border border-border overflow-hidden">
        {/* Simplified lineage diagram */}
        <svg className="w-full h-full">
          {/* Connection lines */}
          <line x1="15%" y1="50%" x2="35%" y2="30%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <line x1="15%" y1="50%" x2="35%" y2="50%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <line x1="15%" y1="50%" x2="35%" y2="70%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <line x1="45%" y1="30%" x2="55%" y2="50%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <line x1="45%" y1="50%" x2="55%" y2="50%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <line x1="45%" y1="70%" x2="55%" y2="50%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <line x1="65%" y1="50%" x2="85%" y2="35%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <line x1="65%" y1="50%" x2="85%" y2="65%" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        </svg>
        
        {/* Nodes */}
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-20 text-center">
          <div className="w-12 h-12 mx-auto rounded-lg bg-chart-1/20 border border-chart-1/30 flex items-center justify-center mb-2">
            <Link2 className="w-5 h-5 text-chart-1" />
          </div>
          <span className="text-xs font-medium">Sources</span>
        </div>
        
        <div className="absolute left-[30%] top-[20%] w-24 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-chart-2/20 border border-chart-2/30 flex items-center justify-center mb-1">
            <Type className="w-4 h-4 text-chart-2" />
          </div>
          <span className="text-xs">Salesforce</span>
        </div>
        <div className="absolute left-[30%] top-[45%] w-24 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-chart-3/20 border border-chart-3/30 flex items-center justify-center mb-1">
            <Type className="w-4 h-4 text-chart-3" />
          </div>
          <span className="text-xs">MySQL</span>
        </div>
        <div className="absolute left-[30%] top-[70%] w-24 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-chart-4/20 border border-chart-4/30 flex items-center justify-center mb-1">
            <Type className="w-4 h-4 text-chart-4" />
          </div>
          <span className="text-xs">REST API</span>
        </div>
        
        <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="w-14 h-14 mx-auto rounded-xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center mb-2">
            <FileCode2 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium">Contract</span>
        </div>
        
        <div className="absolute right-[10%] top-[30%] w-24 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs">Analytics</span>
        </div>
        <div className="absolute right-[10%] top-[60%] w-24 text-center">
          <div className="w-10 h-10 mx-auto rounded-lg bg-chart-5/20 border border-chart-5/30 flex items-center justify-center mb-1">
            <ArrowRight className="w-4 h-4 text-chart-5" />
          </div>
          <span className="text-xs">Dashboards</span>
        </div>
      </div>
    </div>
  )
}

function ContractHistory() {
  const history = [
    { action: "Updated validation rules", user: "Sarah Chen", time: "2 hours ago", type: "edit" },
    { action: "Added currency field", user: "Mike Johnson", time: "1 day ago", type: "add" },
    { action: "Approved contract v2.1", user: "Admin", time: "1 day ago", type: "approve" },
    { action: "Requested review", user: "Sarah Chen", time: "2 days ago", type: "review" },
    { action: "Created contract draft", user: "Sarah Chen", time: "3 days ago", type: "create" },
  ]

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
            {item.user.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{item.user}</span>{" "}
              <span className="text-muted-foreground">{item.action}</span>
            </p>
            <p className="text-xs text-muted-foreground">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function ContractStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-green-500/10 text-green-500" },
    draft: { label: "Draft", className: "bg-yellow-500/10 text-yellow-500" },
    deprecated: { label: "Deprecated", className: "bg-red-500/10 text-red-500" },
  }

  const { label, className } = config[status] || config.active

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  )
}
