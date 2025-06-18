"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  DollarSign,
  Calendar,
  Users,
  Award,
  BarChart3,
  LineChart,
  Download,
} from "lucide-react"

interface AnalyticsData {
  careerInsights: {
    careerTrajectory: {
      current: string
      predicted: string[]
      confidence: number
      timeframe: string
    }
    skillGaps: Array<{
      skill: string
      importance: number
      currentLevel: number
      targetLevel: number
      marketDemand: number
    }>
    salaryPrediction: {
      current: number
      predicted: number
      factors: string[]
      timeline: string
    }
    marketTrends: Array<{
      skill: string
      trend: "rising" | "stable" | "declining"
      growth: number
      demand: number
    }>
  }
  performanceMetrics: {
    applicationSuccess: {
      rate: number
      trend: number
      benchmarkComparison: number
    }
    interviewPerformance: {
      averageScore: number
      improvement: number
      strongAreas: string[]
      weakAreas: string[]
    }
    skillDevelopment: {
      completionRate: number
      learningVelocity: number
      retentionScore: number
    }
    goalProgress: Array<{
      goal: string
      progress: number
      deadline: string
      status: "on-track" | "behind" | "ahead"
    }>
  }
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData
  timeRange: string
  onTimeRangeChange: (range: string) => void
}

export function AdvancedAnalytics({ data, timeRange, onTimeRangeChange }: AdvancedAnalyticsProps) {
  const [activeView, setActiveView] = useState<"insights" | "performance" | "predictions">("insights")

  const exportData = (format: "pdf" | "csv" | "excel") => {
    // Simulate export functionality
    console.log(`Exporting data as ${format}`)
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Advanced Career Analytics
              </CardTitle>
              <CardDescription>AI-powered insights and predictions for your career development</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => exportData("pdf")}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* View Selector */}
      <div className="flex space-x-2">
        <Button
          variant={activeView === "insights" ? "default" : "outline"}
          onClick={() => setActiveView("insights")}
          className="flex items-center"
        >
          <Brain className="w-4 h-4 mr-2" />
          Career Insights
        </Button>
        <Button
          variant={activeView === "performance" ? "default" : "outline"}
          onClick={() => setActiveView("performance")}
          className="flex items-center"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Performance
        </Button>
        <Button
          variant={activeView === "predictions" ? "default" : "outline"}
          onClick={() => setActiveView("predictions")}
          className="flex items-center"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Predictions
        </Button>
      </div>

      {/* Career Insights View */}
      {activeView === "insights" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Career Trajectory */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Career Trajectory Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Current Role</h3>
                  <Badge className="text-lg px-4 py-2">{data.careerInsights.careerTrajectory.current}</Badge>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Predicted Career Path</h4>
                  {data.careerInsights.careerTrajectory.predicted.map((role, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{role}</p>
                        <p className="text-sm text-gray-600">
                          {index === 0 ? "1-2 years" : index === 1 ? "3-5 years" : "5+ years"}
                        </p>
                      </div>
                      <Badge variant="outline">{data.careerInsights.careerTrajectory.confidence}% confidence</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Gap Analysis */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Skill Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.careerInsights.skillGaps.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge
                        className={
                          skill.importance >= 80
                            ? "bg-red-100 text-red-800"
                            : skill.importance >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {skill.importance >= 80 ? "Critical" : skill.importance >= 60 ? "Important" : "Nice to have"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Current Level</span>
                        <span>{skill.currentLevel}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(skill.currentLevel / 10) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Target Level</span>
                        <span>{skill.targetLevel}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(skill.targetLevel / 10) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Market Demand</span>
                        <span className="font-medium text-purple-600">{skill.marketDemand}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Salary Prediction */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Salary Prediction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Estimated Salary</p>
                  <p className="text-2xl font-bold">${data.careerInsights.salaryPrediction.current.toLocaleString()}</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    Predicted Salary ({data.careerInsights.salaryPrediction.timeline})
                  </p>
                  <p className="text-3xl font-bold text-green-800">
                    ${data.careerInsights.salaryPrediction.predicted.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-700">
                      +
                      {Math.round(
                        ((data.careerInsights.salaryPrediction.predicted -
                          data.careerInsights.salaryPrediction.current) /
                          data.careerInsights.salaryPrediction.current) *
                          100,
                      )}
                      % increase
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Growth Factors</h4>
                  <ul className="space-y-1">
                    {data.careerInsights.salaryPrediction.factors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChart className="w-5 h-5 mr-2" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.careerInsights.marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          trend.trend === "rising"
                            ? "bg-green-500"
                            : trend.trend === "stable"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span className="font-medium">{trend.skill}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {trend.trend === "rising" ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : trend.trend === "stable" ? (
                        <div className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">+{trend.growth}%</span>
                      <Badge variant="outline" className="text-xs">
                        {trend.demand}% demand
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance View */}
      {activeView === "performance" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Application Success */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Application Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">{data.performanceMetrics.applicationSuccess.rate}%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="font-medium text-green-600">
                        +{data.performanceMetrics.applicationSuccess.trend}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">vs last period</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{data.performanceMetrics.applicationSuccess.benchmarkComparison}%</p>
                    <p className="text-xs text-gray-600">above average</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Performance */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Interview Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-purple-600">
                    {data.performanceMetrics.interviewPerformance.averageScore}
                  </p>
                  <p className="text-sm text-gray-600">Average Score</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-700 mb-1">Strong Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {data.performanceMetrics.interviewPerformance.strongAreas.map((area, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-orange-700 mb-1">Areas for Improvement</h4>
                    <div className="flex flex-wrap gap-1">
                      {data.performanceMetrics.interviewPerformance.weakAreas.map((area, index) => (
                        <Badge key={index} className="bg-orange-100 text-orange-800">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Development */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Skill Development Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {data.performanceMetrics.skillDevelopment.completionRate}%
                    </p>
                    <p className="text-xs text-gray-600">Completion Rate</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {data.performanceMetrics.skillDevelopment.learningVelocity}
                    </p>
                    <p className="text-xs text-gray-600">Learning Velocity</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {data.performanceMetrics.skillDevelopment.retentionScore}%
                    </p>
                    <p className="text-xs text-gray-600">Retention Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.performanceMetrics.goalProgress.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.goal}</span>
                      <Badge
                        className={
                          goal.status === "on-track"
                            ? "bg-green-100 text-green-800"
                            : goal.status === "ahead"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {goal.status}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          goal.status === "on-track"
                            ? "bg-green-600"
                            : goal.status === "ahead"
                              ? "bg-blue-600"
                              : "bg-red-600"
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.progress}% complete</span>
                      <span>Due: {goal.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Predictions View */}
      {activeView === "predictions" && (
        <div className="space-y-6">
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">AI Career Predictions</h2>
              <p className="text-blue-100">
                Based on your profile, market trends, and performance data, here are personalized predictions for your
                career growth.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Next Role Prediction</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Senior Software Engineer</h3>
                <p className="text-gray-600 mb-4">Predicted timeline: 18-24 months</p>
                <Badge className="bg-green-100 text-green-800">87% confidence</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Salary Growth</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">+32% increase</h3>
                <p className="text-gray-600 mb-4">Expected in next 2 years</p>
                <Badge className="bg-blue-100 text-blue-800">Based on skill growth</Badge>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Market Opportunity</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">High Demand</h3>
                <p className="text-gray-600 mb-4">Your skills are trending up</p>
                <Badge className="bg-purple-100 text-purple-800">95% job market fit</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
