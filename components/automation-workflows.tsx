"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Zap,
  Clock,
  Target,
  Bell,
  Mail,
  Calendar,
  CheckCircle,
  Settings,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: "job_match" | "skill_update" | "application_status" | "time_based" | "goal_milestone"
    condition: string
    value: any
  }
  actions: Array<{
    type: "apply_job" | "send_email" | "update_profile" | "schedule_reminder" | "add_to_calendar"
    parameters: any
  }>
  isActive: boolean
  lastTriggered?: Date
  triggerCount: number
}

interface AutomationWorkflowsProps {
  userProfile: {
    skills: string[]
    experience: string
    goals: string[]
  }
}

export function AutomationWorkflows({ userProfile }: AutomationWorkflowsProps) {
  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Auto-Apply to High Match Jobs",
      description: "Automatically apply to jobs with 90%+ match score",
      trigger: {
        type: "job_match",
        condition: "match_score_above",
        value: 90,
      },
      actions: [
        {
          type: "apply_job",
          parameters: { useCustomCoverLetter: true, includePortfolio: true },
        },
        {
          type: "send_email",
          parameters: { template: "application_confirmation", recipient: "self" },
        },
      ],
      isActive: true,
      lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      triggerCount: 5,
    },
    {
      id: "2",
      name: "Weekly Skill Progress Reminder",
      description: "Send weekly reminders to continue learning",
      trigger: {
        type: "time_based",
        condition: "weekly",
        value: "monday_9am",
      },
      actions: [
        {
          type: "send_email",
          parameters: { template: "skill_progress_reminder" },
        },
        {
          type: "schedule_reminder",
          parameters: { message: "Continue your learning journey!", delay: "1_hour" },
        },
      ],
      isActive: true,
      lastTriggered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      triggerCount: 12,
    },
    {
      id: "3",
      name: "Interview Follow-up Automation",
      description: "Send follow-up emails after interviews automatically",
      trigger: {
        type: "application_status",
        condition: "status_changed_to",
        value: "interviewed",
      },
      actions: [
        {
          type: "schedule_reminder",
          parameters: { message: "Send thank you email", delay: "24_hours" },
        },
        {
          type: "send_email",
          parameters: { template: "interview_followup", delay: "24_hours" },
        },
      ],
      isActive: false,
      triggerCount: 0,
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAutomation, setEditingAutomation] = useState<AutomationRule | null>(null)
  const { addToast } = useToast()

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((automation) => (automation.id === id ? { ...automation, isActive: !automation.isActive } : automation)),
    )

    const automation = automations.find((a) => a.id === id)
    addToast({
      type: "success",
      title: `Automation ${automation?.isActive ? "Disabled" : "Enabled"}`,
      description: `${automation?.name} has been ${automation?.isActive ? "disabled" : "enabled"}`,
    })
  }

  const deleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((automation) => automation.id !== id))
    addToast({
      type: "success",
      title: "Automation Deleted",
      description: "The automation rule has been removed",
    })
  }

  const getTriggerIcon = (type: AutomationRule["trigger"]["type"]) => {
    switch (type) {
      case "job_match":
        return <Target className="w-4 h-4 text-blue-600" />
      case "time_based":
        return <Clock className="w-4 h-4 text-green-600" />
      case "application_status":
        return <CheckCircle className="w-4 h-4 text-purple-600" />
      case "skill_update":
        return <Zap className="w-4 h-4 text-orange-600" />
      case "goal_milestone":
        return <Target className="w-4 h-4 text-red-600" />
      default:
        return <Settings className="w-4 h-4 text-gray-600" />
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "apply_job":
        return <Target className="w-3 h-3" />
      case "send_email":
        return <Mail className="w-3 h-3" />
      case "schedule_reminder":
        return <Bell className="w-3 h-3" />
      case "add_to_calendar":
        return <Calendar className="w-3 h-3" />
      default:
        return <Settings className="w-3 h-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Automation & Workflows
              </CardTitle>
              <CardDescription>Automate your job search and career development tasks</CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{automations.filter((a) => a.isActive).length}</p>
            <p className="text-sm text-gray-600">Active Automations</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {automations.reduce((sum, a) => sum + a.triggerCount, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Triggers</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {
                automations.filter(
                  (a) => a.lastTriggered && a.lastTriggered > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                ).length
              }
            </p>
            <p className="text-sm text-gray-600">This Week</p>
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">24</p>
            <p className="text-sm text-gray-600">Hours Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Your Automation Rules</CardTitle>
          <CardDescription>Manage your automated workflows and triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automations.map((automation) => (
              <Card key={automation.id} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{automation.name}</h3>
                        <Badge
                          className={automation.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {automation.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {automation.triggerCount > 0 && (
                          <Badge variant="outline">{automation.triggerCount} triggers</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{automation.description}</p>

                      {/* Trigger */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                          {getTriggerIcon(automation.trigger.type)}
                          <div>
                            <p className="text-sm font-medium">Trigger</p>
                            <p className="text-xs text-gray-600 capitalize">
                              {automation.trigger.type.replace("_", " ")} - {automation.trigger.condition}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-gray-400" />

                        {/* Actions */}
                        <div className="flex space-x-2">
                          {automation.actions.map((action, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                              {getActionIcon(action.type)}
                              <div>
                                <p className="text-sm font-medium">Action</p>
                                <p className="text-xs text-gray-600 capitalize">{action.type.replace("_", " ")}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Last Triggered */}
                      {automation.lastTriggered && (
                        <p className="text-sm text-gray-500">
                          Last triggered: {automation.lastTriggered.toLocaleDateString()} at{" "}
                          {automation.lastTriggered.toLocaleTimeString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch checked={automation.isActive} onCheckedChange={() => toggleAutomation(automation.id)} />
                      <Button size="sm" variant="outline" onClick={() => setEditingAutomation(automation)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteAutomation(automation.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Templates */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>Pre-built automation templates to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "Job Application Pipeline",
                description: "Automatically apply to matching jobs and track applications",
                triggers: ["High match jobs", "Skill requirements met"],
                actions: ["Apply with custom cover letter", "Add to tracking", "Schedule follow-up"],
              },
              {
                name: "Learning Progress Tracker",
                description: "Monitor skill development and suggest next steps",
                triggers: ["Course completion", "Skill milestone"],
                actions: ["Update profile", "Recommend next course", "Celebrate achievement"],
              },
              {
                name: "Interview Preparation",
                description: "Automate interview scheduling and preparation",
                triggers: ["Interview invitation", "Interview scheduled"],
                actions: ["Research company", "Prepare questions", "Set reminders"],
              },
              {
                name: "Career Goal Monitor",
                description: "Track progress toward career objectives",
                triggers: ["Goal deadline approaching", "Milestone reached"],
                actions: ["Send progress update", "Adjust timeline", "Suggest actions"],
              },
            ].map((template, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-700">Triggers:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.triggers.map((trigger, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700">Actions:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.actions.map((action, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Automation Activity</CardTitle>
          <CardDescription>Latest automated actions and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                time: "2 hours ago",
                action: "Auto-applied to Senior React Developer at TechCorp",
                status: "success",
                details: "Application submitted with custom cover letter",
              },
              {
                time: "1 day ago",
                action: "Sent weekly learning reminder",
                status: "success",
                details: "Email delivered successfully",
              },
              {
                time: "2 days ago",
                action: "Updated profile with new TypeScript skill",
                status: "success",
                details: "Skill level increased to Advanced",
              },
              {
                time: "3 days ago",
                action: "Attempted to apply to Frontend Developer role",
                status: "failed",
                details: "Application deadline had passed",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    activity.status === "success" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.details}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge
                  className={activity.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
