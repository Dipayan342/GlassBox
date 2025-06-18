"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye, Download, Clock, Target } from "lucide-react"

interface AnalyticsData {
  cvAnalyses: {
    total: number
    thisMonth: number
    trend: "up" | "down"
    trendPercentage: number
  }
  jobApplications: {
    total: number
    thisMonth: number
    successRate: number
  }
  skillProgress: {
    completed: number
    inProgress: number
    recommended: number
  }
  interviewSessions: {
    total: number
    averageScore: number
    improvement: number
  }
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CV Analyses</p>
                <p className="text-2xl font-bold">{data.cvAnalyses.total}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {data.cvAnalyses.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${data.cvAnalyses.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {data.cvAnalyses.trendPercentage}% this month
                  </span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Job Applications</p>
                <p className="text-2xl font-bold">{data.jobApplications.total}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs text-gray-600">{data.jobApplications.successRate}% success rate</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skills Completed</p>
                <p className="text-2xl font-bold">{data.skillProgress.completed}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs text-gray-600">{data.skillProgress.inProgress} in progress</span>
                </div>
              </div>
              <Download className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Interview Score</p>
                <p className="text-2xl font-bold">{data.interviewSessions.averageScore}%</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{data.interviewSessions.improvement}% improved</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Skill Development Progress</CardTitle>
            <CardDescription>Your learning journey overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed Skills</span>
                <Badge className="bg-green-100 text-green-800">{data.skillProgress.completed}</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (data.skillProgress.completed /
                        (data.skillProgress.completed +
                          data.skillProgress.inProgress +
                          data.skillProgress.recommended)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-green-600">{data.skillProgress.completed}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-blue-600">{data.skillProgress.inProgress}</p>
                  <p className="text-xs text-gray-600">In Progress</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-600">{data.skillProgress.recommended}</p>
                  <p className="text-xs text-gray-600">Recommended</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest platform interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Completed CV Analysis", time: "2 hours ago", type: "success" },
                { action: "Started Interview Prep", time: "1 day ago", type: "info" },
                { action: "Applied to 3 jobs", time: "2 days ago", type: "success" },
                { action: "Updated profile", time: "3 days ago", type: "info" },
                { action: "Completed React course", time: "1 week ago", type: "success" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div
                    className={`w-2 h-2 rounded-full ${activity.type === "success" ? "bg-green-500" : "bg-blue-500"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
