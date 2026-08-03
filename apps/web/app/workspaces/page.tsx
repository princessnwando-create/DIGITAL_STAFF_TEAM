"use client"

import Link from "next/link"
import { Bot, Plus, Users, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const workspaces = [
  {
    id: "1",
    name: "Acme Corporation",
    logo: "AC",
    plan: "Enterprise",
    members: 156,
    aiEmployees: 24,
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "TechStart Inc",
    logo: "TS",
    plan: "Professional",
    members: 42,
    aiEmployees: 8,
    color: "bg-green-500",
  },
]

export default function WorkspacesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DST</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Select Workspace</h1>
          <p className="text-muted-foreground">
            Choose a workspace to continue or create a new one
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} href="/dashboard">
              <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg h-full">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${workspace.color} text-lg font-bold text-white`}
                    >
                      {workspace.logo}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{workspace.name}</CardTitle>
                      <CardDescription>{workspace.plan} Plan</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {workspace.members} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Bot className="h-4 w-4" />
                      {workspace.aiEmployees} AI employees
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          <Link href="/workspaces/new" className="contents">
            <Card className="group cursor-pointer border-dashed transition-all hover:border-primary hover:bg-primary/5 h-full">
              <CardContent className="flex h-[140px] flex-col items-center justify-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
                  <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <p className="font-medium">Create New Workspace</p>
                <p className="text-sm text-muted-foreground">Start fresh with a new team</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
