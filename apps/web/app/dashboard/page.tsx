"use client"

import {
  TrendingUp,
  TrendingDown,
  Users,
  Bot,
  DollarSign,
  Activity,
  AlertCircle,
  Lightbulb,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Mock data
const metrics = [
  {
    title: "Revenue",
    value: "$1,234,567",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Employees",
    value: "156",
    change: "+8 new",
    trend: "up",
    icon: Users,
  },
  {
    title: "AI Tasks Completed",
    value: "2,847",
    change: "+23%",
    trend: "up",
    icon: Bot,
  },
  {
    title: "Customer Satisfaction",
    value: "94.2%",
    change: "-2.1%",
    trend: "down",
    icon: Activity,
  },
]

const recentTasks = [
  { id: 1, title: "Process Q3 invoices", assignee: "AI Finance", status: "completed", time: "2m ago" },
  { id: 2, title: "Review job applications", assignee: "AI Recruiter", status: "in_progress", time: "15m ago" },
  { id: 3, title: "Generate sales report", assignee: "AI Sales", status: "pending", time: "1h ago" },
  { id: 4, title: "Update knowledge base", assignee: "AI Admin", status: "in_progress", time: "2h ago" },
]

const alerts = [
  { id: 1, type: "warning", message: "3 invoices pending approval over 7 days", time: "1h ago" },
  { id: 2, type: "info", message: "New job application received for Senior Developer", time: "3h ago" },
  { id: 3, type: "success", message: "Q2 financial report generated successfully", time: "5h ago" },
]

const aiSuggestions = [
  { id: 1, title: "Hire 2 more developers for Project Alpha", reason: "Current workload exceeds capacity by 40%" },
  { id: 2, title: "Schedule team meeting to review Q3 goals", reason: "Only 45% of quarterly targets achieved" },
  { id: 3, title: "Reduce marketing spend by 15%", reason: "ROI dropped below target threshold" },
]

export default function DashboardPage() {
  return (
    <DashboardLayout title="CEO Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Executive Dashboard</h1>
            <p className="text-muted-foreground">Your AI-powered business overview</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">August 2026</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Insights Panel */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Suggestions
              </CardTitle>
              <Badge variant="secondary">Powered by AI</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{suggestion.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {suggestion.reason}
                      </p>
                    </div>
                    <Button size="sm">Apply</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className={cn(
                      "mt-0.5 h-2 w-2 rounded-full",
                      alert.type === "warning" && "bg-orange-500",
                      alert.type === "info" && "bg-blue-500",
                      alert.type === "success" && "bg-green-500"
                    )} />
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {task.assignee.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "default"
                          : task.status === "in_progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {task.status.replace("_", " ")}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{task.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Business Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-4xl font-bold text-green-600">87</span>
                  <span className="ml-1 text-lg text-muted-foreground">/100</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +5 this month
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-green-600"
                  style={{ width: "87%" }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cash Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-4xl font-bold">$456K</span>
                  <span className="ml-1 text-lg text-muted-foreground">positive</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +18%
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                vs. $387K last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-4xl font-bold">12</span>
                  <span className="ml-1 text-lg text-muted-foreground">in progress</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  3 at risk
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                8 on track, 1 delayed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
