"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bot,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Zap,
  Clock,
  BarChart3,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock data
const aiEmployees = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Chief AI Recruiter",
    department: "HR",
    status: "active",
    tasksCompleted: 342,
    avatar: null,
    skills: ["Resume Parsing", "Candidate Screening", "Interview Scheduling"],
    lastActive: "2 minutes ago",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "AI Financial Analyst",
    department: "Finance",
    status: "active",
    tasksCompleted: 567,
    avatar: null,
    skills: ["Invoice Processing", "Financial Reporting", "Budget Analysis"],
    lastActive: "5 minutes ago",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "AI Sales Representative",
    department: "Sales",
    status: "active",
    tasksCompleted: 891,
    avatar: null,
    skills: ["Lead Qualification", "Proposal Generation", "CRM Updates"],
    lastActive: "1 minute ago",
  },
  {
    id: "4",
    name: "David Kim",
    role: "AI Customer Support",
    department: "Support",
    status: "active",
    tasksCompleted: 1243,
    avatar: null,
    skills: ["Ticket Resolution", "FAQ Management", "Escalation Handling"],
    lastActive: "Just now",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    role: "AI Marketing Manager",
    department: "Marketing",
    status: "training",
    tasksCompleted: 156,
    avatar: null,
    skills: ["Content Creation", "Campaign Optimization", "Analytics"],
    lastActive: "1 hour ago",
  },
  {
    id: "6",
    name: "James Wilson",
    role: "AI Infrastructure Engineer",
    department: "IT",
    status: "active",
    tasksCompleted: 234,
    avatar: null,
    skills: ["System Monitoring", "Backup Management", "Incident Response"],
    lastActive: "10 minutes ago",
  },
]

const departments = ["All Departments", "HR", "Finance", "Sales", "Marketing", "Support", "IT", "Legal"]
const statuses = ["All Status", "Active", "Training", "Inactive"]

export default function AIEmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("All Departments")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredEmployees = aiEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment =
      departmentFilter === "All Departments" ||
      employee.department === departmentFilter
    const matchesStatus =
      statusFilter === "All Status" ||
      employee.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <DashboardLayout title="AI Employees">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Employees</h1>
            <p className="text-muted-foreground">
              Manage your intelligent AI workforce
            </p>
          </div>
          <Button asChild>
            <Link href="/ai-employees/new">
              <Plus className="mr-2 h-4 w-4" />
              Add AI Employee
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total AI Employees</p>
                <p className="text-2xl font-bold">{aiEmployees.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tasks Today</p>
                <p className="text-2xl font-bold">127</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Tasks/Employee</p>
                <p className="text-2xl font-bold">21</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">
                  {aiEmployees.filter((e) => e.status === "active").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Employee Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="group transition-all hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-lg text-primary">
                        {employee.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.role}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/ai-employees/${employee.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Chat History</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="secondary">{employee.department}</Badge>
                  <Badge
                    variant={employee.status === "active" ? "default" : "outline"}
                    className={cn(
                      employee.status === "active" && "bg-green-500",
                      employee.status === "training" && "bg-orange-500"
                    )}
                  >
                    {employee.status}
                  </Badge>
                </div>
                <div className="mb-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {employee.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {employee.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{employee.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4" />
                      {employee.tasksCompleted} tasks
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {employee.lastActive}
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full group-hover:bg-primary group-hover:text-primary-foreground" asChild>
                  <Link href={`/ai-employees/${employee.id}`}>
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bot className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No AI employees found</h3>
              <p className="mb-4 text-center text-muted-foreground">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button asChild>
                <Link href="/ai-employees/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First AI Employee
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
