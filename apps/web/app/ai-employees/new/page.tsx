"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  User,
  Briefcase,
  Brain,
  Shield,
  Zap,
  MessageSquare,
  Target,
  FileText,
  Save,
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Basic Info", icon: User },
  { id: 2, name: "Role & Skills", icon: Briefcase },
  { id: 3, name: "Knowledge", icon: Brain },
  { id: 4, name: "Permissions", icon: Shield },
  { id: 5, name: "Review", icon: Check },
]

const departments = [
  "Human Resources",
  "Finance",
  "Sales",
  "Marketing",
  "Customer Support",
  "IT",
  "Procurement",
  "Inventory",
  "Projects",
  "Legal",
  "Administration",
]

const roles = {
  "Human Resources": ["AI Recruiter", "HR Manager", "Training Coordinator", "Payroll Specialist"],
  "Finance": ["AI Financial Analyst", "AI Accountant", "AI Auditor", "AI CFO Assistant"],
  "Sales": ["AI Sales Representative", "AI Business Development", "AI Account Manager"],
  "Marketing": ["AI Marketing Manager", "AI Content Writer", "AI SEO Specialist"],
  "Customer Support": ["AI Support Agent", "AI Technical Support", "AI Customer Success"],
  "IT": ["AI Infrastructure Engineer", "AI Security Analyst", "AI DevOps"],
  "Procurement": ["AI Procurement Specialist", "AI Supplier Manager"],
  "Inventory": ["AI Inventory Manager", "AI Warehouse Coordinator"],
  "Projects": ["AI Project Manager", "AI Scrum Master", "AI Resource Planner"],
  "Legal": ["AI Legal Assistant", "AI Compliance Officer", "AI Contract Analyst"],
  "Administration": ["AI Office Manager", "AI Executive Assistant"],
}

const availableTools = [
  "Email Client",
  "Calendar",
  "Slack",
  "Microsoft Teams",
  "CRM System",
  "HRIS System",
  "Accounting Software",
  "Document Editor",
  "Video Conferencing",
  "Knowledge Base",
]

const availableSkills = [
  "Data Analysis",
  "Report Generation",
  "Email Management",
  "Calendar Management",
  "Document Processing",
  "Customer Communication",
  "Lead Qualification",
  "Scheduling",
  "Research",
  "Content Writing",
  "Translation",
  "Problem Solving",
  "Decision Making",
]

export default function NewAIEmployeePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    role: "",
    description: "",
    skills: [] as string[],
    tools: [] as string[],
    knowledgeSources: [] as string[],
    permissions: [] as string[],
    approvalLimit: "",
    managerId: "",
    communicationStyle: "professional",
    customPrompt: "",
  })

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayItem = (key: keyof typeof formData, item: string) => {
    const arr = formData[key] as string[]
    if (arr.includes(item)) {
      updateForm(key, arr.filter((i) => i !== item))
    } else {
      updateForm(key, [...arr, item])
    }
  }

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 5))
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1))

  return (
    <DashboardLayout title="Create AI Employee">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/ai-employees">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New AI Employee</h1>
            <p className="text-muted-foreground">Build a custom AI employee for your team</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          <div className="absolute left-6 top-6 h-[calc(100%-24px)] w-0.5 bg-border" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors",
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm font-medium",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                  <Bot className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Basic Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Set the fundamental details for your AI employee
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Employee Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Sarah Chen"
                      value={formData.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(v) => {
                        updateForm("department", v)
                        updateForm("role", "")
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => updateForm("role", v)}
                    disabled={!formData.department}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.department ? "Select role" : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(roles[formData.department as keyof typeof roles] || []).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of what this AI employee does..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Role & Skills */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                  <Briefcase className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Role & Skills</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure capabilities and available tools
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Skills (select all that apply)</Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {availableSkills.map((skill) => (
                      <label
                        key={skill}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors",
                          formData.skills.includes(skill)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={formData.skills.includes(skill)}
                          onChange={() => toggleArrayItem("skills", skill)}
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Available Tools (select all that apply)</Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {availableTools.map((tool) => (
                      <label
                        key={tool}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors",
                          formData.tools.includes(tool)
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={formData.tools.includes(tool)}
                          onChange={() => toggleArrayItem("tools", tool)}
                        />
                        <span className="text-sm">{tool}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Knowledge */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                  <Brain className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Knowledge Sources</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect knowledge bases and data sources
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Knowledge Base Entries</Label>
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Company Policies</p>
                          <p className="text-sm text-muted-foreground">Employee handbook and guidelines</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toggleArrayItem("knowledgeSources", "policies")}>
                        {formData.knowledgeSources.includes("policies") ? "Remove" : "Add"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Product Documentation</p>
                          <p className="text-sm text-muted-foreground">Technical specs and user guides</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toggleArrayItem("knowledgeSources", "product")}>
                        {formData.knowledgeSources.includes("product") ? "Remove" : "Add"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Sales Playbook</p>
                          <p className="text-sm text-muted-foreground">Sales processes and strategies</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toggleArrayItem("knowledgeSources", "sales")}>
                        {formData.knowledgeSources.includes("sales") ? "Remove" : "Add"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customPrompt">Custom Instructions (Optional)</Label>
                  <Textarea
                    id="customPrompt"
                    placeholder="Add specific instructions or context for this AI employee..."
                    rows={6}
                    value={formData.customPrompt}
                    onChange={(e) => updateForm("customPrompt", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    These instructions will override default behaviors for this AI employee only.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Permissions */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                  <Shield className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Permissions & Hierarchy</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure access levels and reporting structure
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label>Action Permissions</Label>
                    {["Send Emails", "Create Tasks", "Schedule Meetings", "Access Reports", "Approve Requests"].map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={formData.permissions.includes(perm)}
                          onChange={() => toggleArrayItem("permissions", perm)}
                        />
                        <span className="text-sm">{perm}</span>
                      </label>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Reports To (Manager)</Label>
                      <Select
                        value={formData.managerId}
                        onValueChange={(v) => updateForm("managerId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ceo">John Doe (CEO)</SelectItem>
                          <SelectItem value="hr-dir">HR Director</SelectItem>
                          <SelectItem value="fin-dir">Finance Director</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Approval Limit</Label>
                      <Select
                        value={formData.approvalLimit}
                        onValueChange={(v) => updateForm("approvalLimit", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No approval authority</SelectItem>
                          <SelectItem value="low">Up to $500</SelectItem>
                          <SelectItem value="medium">Up to $5,000</SelectItem>
                          <SelectItem value="high">Up to $50,000</SelectItem>
                          <SelectItem value="unlimited">Unlimited (requires human approval)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Communication Style</Label>
                      <Select
                        value={formData.communicationStyle}
                        onValueChange={(v) => updateForm("communicationStyle", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-lg border bg-primary/10 p-4">
                  <Bot className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Review & Create</h3>
                    <p className="text-sm text-muted-foreground">
                      Review your AI employee configuration before creating
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {formData.name || "Not set"}</p>
                      <p><span className="text-muted-foreground">Department:</span> {formData.department || "Not set"}</p>
                      <p><span className="text-muted-foreground">Role:</span> {formData.role || "Not set"}</p>
                      <p><span className="text-muted-foreground">Description:</span> {formData.description || "Not set"}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Skills:</span> {formData.skills.length || 0} selected</p>
                      <p><span className="text-muted-foreground">Tools:</span> {formData.tools.length || 0} selected</p>
                      <p><span className="text-muted-foreground">Knowledge:</span> {formData.knowledgeSources.length || 0} sources</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Permissions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Actions:</span> {formData.permissions.length || 0} allowed</p>
                      <p><span className="text-muted-foreground">Approval Limit:</span> {formData.approvalLimit || "None"}</p>
                      <p><span className="text-muted-foreground">Style:</span> {formData.communicationStyle}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg text-primary">
                          {formData.name ? formData.name.split(" ").map((n) => n[0]).join("") : "AI"}
                        </div>
                        <div>
                          <p className="font-medium">{formData.name || "AI Employee"}</p>
                          <p className="text-sm text-muted-foreground">{formData.role || "Role not set"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              {currentStep < 5 ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/ai-employees">
                    <Save className="mr-2 h-4 w-4" />
                    Create AI Employee
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
