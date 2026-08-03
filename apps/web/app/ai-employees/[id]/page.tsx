"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bot,
  ArrowLeft,
  Edit,
  MessageSquare,
  Settings,
  BarChart3,
  Brain,
  Clock,
  Shield,
  Target,
  Users,
  Calendar,
  Zap,
  Send,
  MoreHorizontal,
  Plus,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Mock AI Employee data
const aiEmployee = {
  id: "1",
  name: "Sarah Chen",
  role: "Chief AI Recruiter",
  department: "HR",
  status: "active",
  description: "Expert AI recruiter specializing in technical hiring. Capable of screening resumes, scheduling interviews, and providing hiring recommendations.",
  skills: ["Resume Parsing", "Candidate Screening", "Interview Scheduling", "Salary Negotiation", "Offer Generation"],
  tools: ["Email", "Calendar", "Slack", "LinkedIn", "HRIS System"],
  permissions: ["View Employee Data", "Schedule Meetings", "Send Emails", "Access Job Boards"],
  communicationStyle: "Professional and friendly",
  language: "English, Mandarin",
  workSchedule: "24/7",
  avatar: null,
  manager: "John Doe (CEO)",
  subordinates: ["Junior Recruiter AI", "Campus Hiring AI"],
  kpis: [
    { name: "Tasks Completed", value: 342, target: 300 },
    { name: "Accuracy Rate", value: 96, target: 95 },
    { name: "Avg Response Time", value: "2m", target: "5m" },
    { name: "Candidate Satisfaction", value: 4.8, target: 4.5 },
  ],
  memory: [
    "Specializes in tech hiring for engineering roles",
    "Prefers structured interviews with technical assessments",
    "Always includes culture fit evaluation in recommendations",
  ],
  recentConversations: [
    { id: 1, user: "HR Manager", message: "Can you screen these resumes for the senior developer position?", time: "10m ago" },
    { id: 2, user: "Sarah Chen", message: "I've reviewed 15 resumes. Here are my top 5 candidates with rankings.", time: "8m ago" },
    { id: 3, user: "HR Manager", message: "Great! Please schedule first round interviews for the top 3.", time: "5m ago" },
    { id: 4, user: "Sarah Chen", message: "Done! I've scheduled interviews for tomorrow at 10am, 11am, and 2pm.", time: "4m ago" },
  ],
}

export default function AIEmployeeDetailPage() {
  const [message, setMessage] = useState("")
  
  return (
    <DashboardLayout title={aiEmployee.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/ai-employees">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-2xl text-primary">
                  {aiEmployee.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{aiEmployee.name}</h1>
                  <Badge
                    variant={aiEmployee.status === "active" ? "default" : "outline"}
                    className={cn(
                      aiEmployee.status === "active" && "bg-green-500"
                    )}
                  >
                    {aiEmployee.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{aiEmployee.role} • {aiEmployee.department}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/ai-employees/${aiEmployee.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{aiEmployee.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Reports to:</span>
                    <span className="font-medium">{aiEmployee.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Work Schedule:</span>
                    <span className="font-medium">{aiEmployee.workSchedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Communication:</span>
                    <span className="font-medium">{aiEmployee.communicationStyle}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {aiEmployee.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {aiEmployee.tools.map((tool) => (
                    <Badge key={tool} variant="outline">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiEmployee.permissions.map((permission) => (
                    <li key={permission} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
                <TabsTrigger value="conversations">Chats</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Performance Tab */}
              <TabsContent value="performance" className="mt-6 space-y-6">
                {/* KPIs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Key Performance Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {aiEmployee.kpis.map((kpi) => {
                        const numValue = typeof kpi.value === 'number' ? kpi.value : parseFloat(String(kpi.value)) || 0
                        const numTarget = typeof kpi.target === 'number' ? kpi.target : parseFloat(String(kpi.target)) || 0
                        const isPercentage = numTarget < 100
                        const progress = isPercentage ? Math.min(numValue, 100) : 100
                        const isGood = numValue >= numTarget
                        
                        return (
                          <div key={kpi.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{kpi.name}</span>
                              <span className="font-medium">
                                {kpi.value}
                                {isPercentage ? "%" : ""}
                              </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-secondary">
                              <div
                                className={cn(
                                  "h-2 rounded-full transition-all",
                                  isGood ? "bg-green-500" : "bg-orange-500"
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Target: {kpi.target}{isPercentage ? "%" : ""}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Activity Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-[200px] items-end justify-between gap-2 rounded-lg border bg-muted/50 p-4">
                      {[65, 80, 75, 90, 85, 95, 88, 92, 78, 85, 90, 95].map((value, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                          style={{ height: `${value}%` }}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Memory Tab */}
              <TabsContent value="memory" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Memory & Knowledge
                    </CardTitle>
                    <CardDescription>
                      Stored context and learned behaviors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiEmployee.memory.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                          <Brain className="mt-0.5 h-5 w-5 text-primary" />
                          <p className="text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Memory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Conversations Tab */}
              <TabsContent value="conversations" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Recent Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiEmployee.recentConversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={cn(
                            "flex items-start gap-3 rounded-lg border p-4",
                            conv.user === aiEmployee.name && "bg-primary/5"
                          )}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {conv.user.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{conv.user}</span>
                              <span className="text-xs text-muted-foreground">{conv.time}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{conv.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border px-4 py-2"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <Button>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      AI Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custom Instructions</label>
                      <textarea
                        className="w-full rounded-lg border p-3 text-sm"
                        rows={4}
                        placeholder="Add custom instructions for this AI employee..."
                        defaultValue="You are Sarah Chen, Chief AI Recruiter. You specialize in technical hiring and always prioritize candidates who demonstrate strong problem-solving abilities."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Decision Limits</label>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Can reject candidates</span>
                          <input type="checkbox" defaultChecked />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm">Max interview slots per day</span>
                          <span className="text-sm font-medium">10</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Reset to Default</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
