"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  ArrowRight,
  Bell,
  FileText,
  GitBranch,
  ThumbsUp,
  ThumbsDown,
  Send,
  AtSign,
  Paperclip,
  Calendar,
  Tag,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const approvalRequests = [
  {
    id: 1,
    title: "Update Customer Schema v2.3",
    description: "Adding new fields for GDPR compliance tracking",
    requestor: { name: "Sarah Chen", avatar: "/avatars/sarah.jpg", initials: "SC" },
    type: "Schema Change",
    priority: "high",
    status: "pending",
    createdAt: "2 hours ago",
    reviewers: [
      { name: "John Doe", initials: "JD", voted: "approved" },
      { name: "Alice Kim", initials: "AK", voted: null },
      { name: "Bob Smith", initials: "BS", voted: null },
    ],
    comments: 5,
    dataset: "customers_main",
  },
  {
    id: 2,
    title: "New Data Pipeline: Marketing Analytics",
    description: "ETL pipeline for marketing campaign data from HubSpot",
    requestor: { name: "Mike Johnson", avatar: "/avatars/mike.jpg", initials: "MJ" },
    type: "Pipeline Creation",
    priority: "medium",
    status: "pending",
    createdAt: "5 hours ago",
    reviewers: [
      { name: "Sarah Chen", initials: "SC", voted: "approved" },
      { name: "David Lee", initials: "DL", voted: "approved" },
    ],
    comments: 12,
    dataset: "marketing_campaigns",
  },
  {
    id: 3,
    title: "Deprecate Legacy Orders Table",
    description: "Migration to new orders_v2 schema with partitioning",
    requestor: { name: "Emily Davis", avatar: "/avatars/emily.jpg", initials: "ED" },
    type: "Deprecation",
    priority: "low",
    status: "approved",
    createdAt: "1 day ago",
    reviewers: [
      { name: "John Doe", initials: "JD", voted: "approved" },
      { name: "Alice Kim", initials: "AK", voted: "approved" },
      { name: "Mike Johnson", initials: "MJ", voted: "approved" },
    ],
    comments: 8,
    dataset: "orders_legacy",
  },
]

const teamMembers = [
  { id: 1, name: "Sarah Chen", role: "Data Engineer", avatar: "/avatars/sarah.jpg", initials: "SC", status: "online", tasksCompleted: 24 },
  { id: 2, name: "John Doe", role: "Analytics Lead", avatar: "/avatars/john.jpg", initials: "JD", status: "online", tasksCompleted: 18 },
  { id: 3, name: "Alice Kim", role: "Data Scientist", avatar: "/avatars/alice.jpg", initials: "AK", status: "away", tasksCompleted: 31 },
  { id: 4, name: "Mike Johnson", role: "Platform Engineer", avatar: "/avatars/mike.jpg", initials: "MJ", status: "offline", tasksCompleted: 15 },
  { id: 5, name: "Emily Davis", role: "Data Architect", avatar: "/avatars/emily.jpg", initials: "ED", status: "online", tasksCompleted: 22 },
]

const activityFeed = [
  { id: 1, user: "Sarah Chen", action: "approved", target: "Customer Schema v2.2", time: "10 min ago", icon: CheckCircle2 },
  { id: 2, user: "John Doe", action: "commented on", target: "Marketing Pipeline", time: "25 min ago", icon: MessageSquare },
  { id: 3, user: "Alice Kim", action: "created", target: "New Data Contract", time: "1 hour ago", icon: FileText },
  { id: 4, user: "Mike Johnson", action: "merged", target: "Orders Migration PR", time: "2 hours ago", icon: GitBranch },
  { id: 5, user: "Emily Davis", action: "requested review for", target: "Analytics Dashboard", time: "3 hours ago", icon: Eye },
]

const discussions = [
  {
    id: 1,
    title: "Best practices for PII handling in analytics",
    author: { name: "Sarah Chen", initials: "SC" },
    replies: 12,
    lastActivity: "30 min ago",
    tags: ["security", "compliance", "best-practices"],
  },
  {
    id: 2,
    title: "Proposal: Standardize date formats across datasets",
    author: { name: "John Doe", initials: "JD" },
    replies: 8,
    lastActivity: "2 hours ago",
    tags: ["standards", "data-quality"],
  },
  {
    id: 3,
    title: "Q3 Data Platform Roadmap Discussion",
    author: { name: "Emily Davis", initials: "ED" },
    replies: 24,
    lastActivity: "5 hours ago",
    tags: ["roadmap", "planning"],
  },
]

export default function CollaborationPage() {
  const [selectedRequest, setSelectedRequest] = useState<typeof approvalRequests[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20"
      case "medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "low": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-500/10 text-amber-500"
      case "approved": return "bg-emerald-500/10 text-emerald-500"
      case "rejected": return "bg-red-500/10 text-red-500"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500"
      case "away": return "bg-amber-500"
      case "offline": return "bg-muted-foreground/50"
      default: return "bg-muted-foreground/50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collaboration Hub</h1>
          <p className="text-muted-foreground">Manage approvals, discussions, and team workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
            <Badge className="ml-2 bg-primary text-primary-foreground">3</Badge>
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Approval Request</DialogTitle>
                <DialogDescription>
                  Submit a new change request for team review and approval.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="e.g., Update Customer Schema v2.4" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Request Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="schema">Schema Change</SelectItem>
                      <SelectItem value="pipeline">Pipeline Creation</SelectItem>
                      <SelectItem value="deprecation">Deprecation</SelectItem>
                      <SelectItem value="access">Access Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the changes and their impact..." />
                </div>
                <div className="grid gap-2">
                  <Label>Reviewers</Label>
                  <div className="flex flex-wrap gap-2">
                    {teamMembers.slice(0, 3).map((member) => (
                      <Badge key={member.id} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        <Avatar className="mr-1 h-4 w-4">
                          <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="cursor-pointer">
                      <UserPlus className="mr-1 h-3 w-3" />
                      Add
                    </Badge>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Pending Approvals", value: "8", icon: Clock, color: "text-amber-500" },
          { label: "Approved Today", value: "12", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Active Discussions", value: "5", icon: MessageSquare, color: "text-primary" },
          { label: "Team Members", value: "24", icon: Users, color: "text-violet-500" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`rounded-lg bg-muted p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Approval Requests */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="pending" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search requests..." 
                    className="pl-8 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="pending" className="mt-4 space-y-3">
              <AnimatePresence>
                {approvalRequests.filter(r => r.status === "pending").map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg ${selectedRequest?.id === request.id ? 'border-primary ring-1 ring-primary/20' : ''}`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={request.requestor.avatar} />
                              <AvatarFallback>{request.requestor.initials}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{request.title}</h3>
                                <Badge variant="outline" className={getPriorityColor(request.priority)}>
                                  {request.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-1">{request.description}</p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {request.type}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {request.createdAt}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {request.comments} comments
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            <div className="flex -space-x-2">
                              {request.reviewers.map((reviewer, i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[10px]">{reviewer.initials}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        </div>
                        {selectedRequest?.id === request.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 border-t pt-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Reviewers:</span>
                                {request.reviewers.map((reviewer, i) => (
                                  <div key={i} className="flex items-center gap-1">
                                    <Avatar className="h-5 w-5">
                                      <AvatarFallback className="text-[10px]">{reviewer.initials}</AvatarFallback>
                                    </Avatar>
                                    {reviewer.voted === "approved" && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600">
                                  <ThumbsDown className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                  <ThumbsUp className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="approved" className="mt-4 space-y-3">
              {approvalRequests.filter(r => r.status === "approved").map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{request.requestor.initials}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{request.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{request.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {request.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="all" className="mt-4 space-y-3">
              {approvalRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{request.requestor.initials}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h3 className="font-semibold">{request.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{request.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>

          {/* Discussions */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Team Discussions</CardTitle>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {discussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start justify-between rounded-lg border border-border/50 bg-muted/30 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{discussion.author.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{discussion.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {discussion.replies}
                    </div>
                    <div>{discussion.lastActivity}</div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Team Members */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Team Members</CardTitle>
              <Button variant="ghost" size="icon">
                <UserPlus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${getStatusIcon(member.status)}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Role
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityFeed.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="rounded-full bg-muted p-1.5">
                      <activity.icon className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p>
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium text-primary">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Comment */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea 
                  placeholder="Share an update or ask a question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <AtSign className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" disabled={!newComment.trim()}>
                    <Send className="mr-1 h-3 w-3" />
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
