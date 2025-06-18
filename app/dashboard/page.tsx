"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Upload,
  FileText,
  Target,
  BookOpen,
  User,
  Settings,
  Bell,
  TrendingUp,
  Award,
  DollarSign,
  Lightbulb,
  Clock,
  MessageSquare,
  Calculator,
  Crown,
  Zap,
  BarChart3,
} from "lucide-react"
import { CVUpload } from "@/components/cv-upload"
import { JobSelector } from "@/components/job-selector"
import { PremiumBanner } from "@/components/premium-banner"
import { PricingModal } from "@/components/pricing-modal"
import { InterviewPrep } from "@/components/interview-prep"
import { SalaryNegotiation } from "@/components/salary-negotiation"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ProgressTracker } from "@/components/progress-tracker"
import { SearchFilter } from "@/components/search-filter"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { useToast } from "@/components/toast-provider"
import type { CVAnalysisResult } from "@/app/actions/analyze-cv"
import { CVBuilder } from "@/components/cv-builder"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [cvAnalysisResult, setCvAnalysisResult] = useState<CVAnalysisResult | null>(null)
  const [selectedJobDetails, setSelectedJobDetails] = useState<{
    role: string
    company: string
    skills: string[]
    experience: string
    strengths: string[]
  } | null>(null)
  const [isPremium, setIsPremium] = useState(true)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  // Mock analytics data
  const analyticsData = {
    cvAnalyses: {
      total: 12,
      thisMonth: 3,
      trend: "up" as const,
      trendPercentage: 25,
    },
    jobApplications: {
      total: 8,
      thisMonth: 2,
      successRate: 37,
    },
    skillProgress: {
      completed: 5,
      inProgress: 3,
      recommended: 7,
    },
    interviewSessions: {
      total: 6,
      averageScore: 85,
      improvement: 12,
    },
  }

  // Progress tracking steps
  const progressSteps = [
    {
      id: "upload",
      title: "Upload CV",
      description: "Upload your CV for AI analysis",
      status: cvAnalysisResult ? "completed" : "current",
    },
    {
      id: "analysis",
      title: "CV Analysis",
      description: "Get comprehensive AI insights",
      status: cvAnalysisResult ? "completed" : "pending",
    },
    {
      id: "jobs",
      title: "Job Matching",
      description: "Find matching job opportunities",
      status: cvAnalysisResult ? "completed" : "pending",
    },
    {
      id: "interview",
      title: "Interview Prep",
      description: "Practice with AI-generated questions",
      status: "pending",
      optional: true,
    },
    {
      id: "apply",
      title: "Apply to Jobs",
      description: "Start applying to recommended positions",
      status: "pending",
    },
  ] as const

  const handleAnalysisComplete = (result: CVAnalysisResult) => {
    setCvAnalysisResult(result)
    setActiveTab("cv-analysis")
    addToast({
      type: "success",
      title: "CV Analysis Complete!",
      description: "Your CV has been successfully analyzed with AI insights.",
    })
  }

  const handleJobSelect = (jobDetails: {
    role: string
    company: string
    skills: string[]
    experience: string
    strengths: string[]
  }) => {
    setSelectedJobDetails(jobDetails)
    addToast({
      type: "info",
      title: "Job Selected",
      description: `Selected ${jobDetails.role} at ${jobDetails.company}`,
    })
  }

  const handleUpgrade = () => {
    setShowPricingModal(true)
  }

  const handleTabChange = (tab: string) => {
    setIsLoading(true)
    setActiveTab(tab)

    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false)
    }, 300)
  }

  // Job search filters
  const jobFilters = {
    experience: [
      { id: "entry", label: "Entry Level", count: 45 },
      { id: "mid", label: "Mid Level", count: 78 },
      { id: "senior", label: "Senior Level", count: 32 },
    ],
    type: [
      { id: "fulltime", label: "Full Time", count: 120 },
      { id: "contract", label: "Contract", count: 35 },
      { id: "remote", label: "Remote", count: 89 },
    ],
    skills: [
      { id: "javascript", label: "JavaScript", count: 67 },
      { id: "react", label: "React", count: 54 },
      { id: "python", label: "Python", count: 43 },
      { id: "nodejs", label: "Node.js", count: 38 },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Glassbox AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {!isPremium && (
                <Button
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  size="sm"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-4">
            <Card className="border-0 bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange("overview")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === "analytics" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange("analytics")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    variant={activeTab === "cv-analysis" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange("cv-analysis")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    CV Analysis
                  </Button>
                  <Button
                    variant={activeTab === "job-matching" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange("job-matching")}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Job Matching
                  </Button>
                  <Button
                    variant={activeTab === "interview-prep" ? "default" : "ghost"}
                    className="w-full justify-start relative"
                    onClick={() => handleTabChange("interview-prep")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Interview Prep
                    {!isPremium && <Crown className="w-3 h-3 ml-auto text-yellow-500" />}
                  </Button>
                  <Button
                    variant={activeTab === "salary-negotiation" ? "default" : "ghost"}
                    className="w-full justify-start relative"
                    onClick={() => handleTabChange("salary-negotiation")}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Salary Tools
                    {!isPremium && <Crown className="w-3 h-3 ml-auto text-yellow-500" />}
                  </Button>
                  <Button
                    variant={activeTab === "courses" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange("courses")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Courses
                  </Button>
                  <Button
                    variant={activeTab === "cv-builder" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabChange("cv-builder")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    CV Builder
                  </Button>
                </nav>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <ProgressTracker steps={progressSteps} currentStep={activeTab} />

            {/* Premium Status */}
            {isPremium ? (
              <Card className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-4 text-center">
                  <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-yellow-800">Premium Member</h3>
                  <p className="text-xs text-yellow-700">All features unlocked</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-gray-200 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-700">Free Plan</h3>
                  <p className="text-xs text-gray-600 mb-3">Limited features</p>
                  <Button
                    size="sm"
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    Upgrade
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="space-y-6">
                <LoadingSkeleton
                  type={
                    activeTab === "cv-analysis" ? "analysis" : activeTab === "interview-prep" ? "questions" : "card"
                  }
                />
                <LoadingSkeleton type="card" />
              </div>
            ) : (
              <>
                {/* Premium banners for non-premium features */}
                {!isPremium && (activeTab === "interview-prep" || activeTab === "salary-negotiation") && (
                  <div className="mb-6">
                    <PremiumBanner
                      feature={activeTab === "interview-prep" ? "Interview Preparation" : "Salary Negotiation Tools"}
                      onUpgrade={handleUpgrade}
                    />
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <Card className="border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Analytics Dashboard</CardTitle>
                        <CardDescription>Track your career development progress and platform usage</CardDescription>
                      </CardHeader>
                    </Card>
                    <AnalyticsDashboard data={analyticsData} />
                  </div>
                )}

                {activeTab === "interview-prep" && (
                  <InterviewPrep
                    jobRole={selectedJobDetails?.role || cvAnalysisResult?.jobFit[0]?.role}
                    skills={cvAnalysisResult?.skills}
                    experienceLevel={cvAnalysisResult?.experienceLevel}
                    isPremium={isPremium}
                    onUpgrade={handleUpgrade}
                  />
                )}

                {activeTab === "salary-negotiation" && (
                  <div className="space-y-6">
                    {!isPremium && <PremiumBanner feature="Salary Negotiation Tools" onUpgrade={handleUpgrade} />}
                    <SalaryNegotiation
                      targetRole={selectedJobDetails?.role || cvAnalysisResult?.jobFit[0]?.role}
                      experience={cvAnalysisResult?.experienceLevel}
                      isPremium={isPremium}
                    />
                  </div>
                )}

                {activeTab === "cv-analysis" && (
                  <div className="space-y-6">
                    {!cvAnalysisResult ? (
                      <>
                        <Card className="border-0 bg-white/60 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle>Real CV Analysis</CardTitle>
                            <CardDescription>
                              Upload your CV in PDF format for comprehensive AI-powered analysis
                            </CardDescription>
                          </CardHeader>
                        </Card>

                        <CVUpload onAnalysisComplete={handleAnalysisComplete} />

                        <JobSelector onJobSelect={handleJobSelect} />
                      </>
                    ) : (
                      <>
                        {/* Enhanced Analysis Results */}
                        <Card className="border-0 bg-white/60 backdrop-blur-sm">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                              <CardTitle>Comprehensive CV Analysis</CardTitle>
                              <CardDescription>AI-powered analysis of your professional profile</CardDescription>
                            </div>
                            <Button variant="outline" onClick={() => setCvAnalysisResult(null)}>
                              Upload New CV
                            </Button>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Skills & Experience */}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <Award className="w-4 h-4 mr-2" />
                                    Skills Identified
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {cvAnalysisResult.skills.map((skill, index) => (
                                      <Badge key={index} variant="secondary">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Experience Level
                                  </h4>
                                  <Badge variant="outline" className="text-lg px-3 py-1">
                                    {cvAnalysisResult.experienceLevel}
                                  </Badge>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Estimated Salary Range
                                  </h4>
                                  <p className="text-lg font-semibold text-green-600">
                                    ${cvAnalysisResult.salaryRange.min.toLocaleString()} - $
                                    {cvAnalysisResult.salaryRange.max.toLocaleString()}{" "}
                                    {cvAnalysisResult.salaryRange.currency}
                                  </p>
                                </div>
                              </div>

                              {/* Strengths & Recommendations */}
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Key Strengths</h4>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {cvAnalysisResult.strengths.map((strength, index) => (
                                      <li key={index}>{strength}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2 flex items-center">
                                    <Lightbulb className="w-4 h-4 mr-2" />
                                    Recommendations
                                  </h4>
                                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {cvAnalysisResult.recommendations.map((rec, index) => (
                                      <li key={index}>{rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            {/* Missing Skills */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <h4 className="font-medium mb-3">Skills to Develop</h4>
                              <div className="flex flex-wrap gap-2">
                                {cvAnalysisResult.missingSkills.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-orange-600 border-orange-200 bg-orange-50"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Career Suggestions */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                              <h4 className="font-medium mb-3">Career Development Suggestions</h4>
                              <ul className="list-disc list-inside text-gray-600 space-y-1">
                                {cvAnalysisResult.careerSuggestions.map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Job Fit Analysis */}
                        <Card className="border-0 bg-white/60 backdrop-blur-sm">
                          <CardHeader>
                            <CardTitle>Job Match Analysis</CardTitle>
                            <CardDescription>Positions that align with your profile</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {cvAnalysisResult.jobFit.map((job, index) => (
                                <Card key={index} className="border border-gray-200">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h3 className="font-medium text-lg">{job.role}</h3>
                                        <p className="text-gray-600">{job.company}</p>
                                      </div>
                                      <Badge
                                        className={`${
                                          job.matchPercentage >= 90
                                            ? "bg-green-100 text-green-800"
                                            : job.matchPercentage >= 80
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {job.matchPercentage}% Match
                                      </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-3">{job.reasoning}</p>

                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div>
                                        <h5 className="text-sm font-medium mb-1">Required Skills</h5>
                                        <div className="flex flex-wrap gap-1">
                                          {job.requiredSkills.map((skill, skillIndex) => (
                                            <Badge key={skillIndex} variant="secondary" className="text-xs">
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>

                                      <div>
                                        <h5 className="text-sm font-medium mb-1">Skills to Develop</h5>
                                        <div className="flex flex-wrap gap-1">
                                          {job.missingSkills.map((skill, skillIndex) => (
                                            <Badge
                                              key={skillIndex}
                                              variant="outline"
                                              className="text-xs text-red-500 border-red-200"
                                            >
                                              {skill}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {!selectedJobDetails && <JobSelector onJobSelect={handleJobSelect} />}
                      </>
                    )}
                  </div>
                )}

                {activeTab === "job-matching" && (
                  <div className="space-y-6">
                    <Card className="border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Job Recommendations</CardTitle>
                        <CardDescription>
                          {cvAnalysisResult
                            ? "Personalized job matches based on your CV analysis"
                            : "Upload your CV first to get personalized job recommendations"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Enhanced Search and Filter */}
                        <div className="mb-6">
                          <SearchFilter
                            placeholder="Search jobs by title, company, or skills..."
                            filters={jobFilters}
                            onSearch={(query) => console.log("Search:", query)}
                            onFilterChange={(filters) => console.log("Filters:", filters)}
                          />
                        </div>

                        {cvAnalysisResult ? (
                          <div className="space-y-4">
                            {cvAnalysisResult.jobFit.map((job, index) => (
                              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                  <div className="flex justify-between items-start mb-4">
                                    <div>
                                      <h3 className="font-semibold text-lg text-gray-900">{job.role}</h3>
                                      <p className="text-gray-600">{job.company}</p>
                                      <div className="flex items-center mt-2">
                                        <Badge
                                          className={`${
                                            job.matchPercentage >= 90
                                              ? "bg-green-100 text-green-800"
                                              : job.matchPercentage >= 80
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {job.matchPercentage}% Match
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-gray-900">
                                        $
                                        {(
                                          cvAnalysisResult.salaryRange.min +
                                          (job.matchPercentage - 70) * 1000
                                        ).toLocaleString()}{" "}
                                        - $
                                        {(
                                          cvAnalysisResult.salaryRange.max +
                                          (job.matchPercentage - 70) * 1000
                                        ).toLocaleString()}
                                      </p>
                                      <p className="text-xs text-gray-500">Estimated salary</p>
                                    </div>
                                  </div>

                                  <p className="text-gray-700 mb-4">{job.reasoning}</p>

                                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <h5 className="text-sm font-medium mb-2">Your Matching Skills</h5>
                                      <div className="flex flex-wrap gap-1">
                                        {job.requiredSkills.slice(0, 4).map((skill, skillIndex) => (
                                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <h5 className="text-sm font-medium mb-2">Skills to Develop</h5>
                                      <div className="flex flex-wrap gap-1">
                                        {job.missingSkills.slice(0, 3).map((skill, skillIndex) => (
                                          <Badge
                                            key={skillIndex}
                                            variant="outline"
                                            className="text-xs text-orange-600 border-orange-200"
                                          >
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="flex space-x-2">
                                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        Apply Now
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        Save Job
                                      </Button>
                                    </div>
                                    <Button size="sm" variant="ghost">
                                      View Details
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No CV Analysis Yet</h3>
                            <p className="text-gray-600 mb-4">
                              Upload and analyze your CV to get personalized job recommendations
                            </p>
                            <Button
                              onClick={() => handleTabChange("cv-analysis")}
                              className="bg-gradient-to-r from-blue-600 to-purple-600"
                            >
                              Analyze CV First
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Additional Job Search Tools */}
                    <Card className="border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Job Search Tools</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <Card className="border border-gray-200">
                            <CardContent className="p-4 text-center">
                              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                              <h4 className="font-medium mb-1">Job Alerts</h4>
                              <p className="text-sm text-gray-600 mb-3">Get notified of new matching jobs</p>
                              <Button size="sm" variant="outline">
                                Set Up Alerts
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="border border-gray-200">
                            <CardContent className="p-4 text-center">
                              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                              <h4 className="font-medium mb-1">Cover Letter</h4>
                              <p className="text-sm text-gray-600 mb-3">AI-generated cover letters</p>
                              <Button size="sm" variant="outline">
                                Generate Letter
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="border border-gray-200">
                            <CardContent className="p-4 text-center">
                              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                              <h4 className="font-medium mb-1">Salary Insights</h4>
                              <p className="text-sm text-gray-600 mb-3">Market salary data</p>
                              <Button size="sm" variant="outline">
                                View Insights
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "courses" && (
                  <div className="space-y-6">
                    <Card className="border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Recommended Courses</CardTitle>
                        <CardDescription>
                          {cvAnalysisResult
                            ? "Personalized learning paths based on your CV analysis"
                            : "Enhance your skills with these popular courses"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <SearchFilter
                            placeholder="Search courses by skill, technology, or topic..."
                            filters={{
                              level: [
                                { id: "beginner", label: "Beginner", count: 45 },
                                { id: "intermediate", label: "Intermediate", count: 32 },
                                { id: "advanced", label: "Advanced", count: 18 },
                              ],
                              duration: [
                                { id: "short", label: "Under 10 hours", count: 28 },
                                { id: "medium", label: "10-30 hours", count: 42 },
                                { id: "long", label: "30+ hours", count: 25 },
                              ],
                              category: [
                                { id: "frontend", label: "Frontend", count: 35 },
                                { id: "backend", label: "Backend", count: 28 },
                                { id: "fullstack", label: "Full Stack", count: 22 },
                                { id: "devops", label: "DevOps", count: 15 },
                              ],
                            }}
                            onSearch={(query) => console.log("Course search:", query)}
                            onFilterChange={(filters) => console.log("Course filters:", filters)}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Skill-based recommendations */}
                          {cvAnalysisResult?.missingSkills
                            ? cvAnalysisResult.missingSkills.map((skill, index) => (
                                <Card key={index} className="border border-gray-200">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h3 className="font-medium mb-1">Master {skill}</h3>
                                        <p className="text-sm text-gray-600">
                                          Complete course to enhance your {skill} skills
                                        </p>
                                      </div>
                                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                                        Recommended
                                      </Badge>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{20 + index * 5} hours</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Award className="w-4 h-4 mr-1" />
                                        <span>Certificate included</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-lg font-semibold text-green-600">${49 + index * 10}</span>
                                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        Enroll Now
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))
                            : // Default courses if no CV analysis
                              [
                                {
                                  title: "Advanced React Patterns",
                                  description: "Master advanced React concepts and patterns for scalable applications",
                                  duration: "40 hours",
                                  price: 79,
                                  level: "Intermediate",
                                },
                                {
                                  title: "TypeScript Fundamentals",
                                  description: "Learn TypeScript to write more robust and maintainable code",
                                  duration: "25 hours",
                                  price: 59,
                                  level: "Beginner",
                                },
                                {
                                  title: "Node.js & Express Mastery",
                                  description: "Build scalable backend applications with Node.js and Express",
                                  duration: "35 hours",
                                  price: 89,
                                  level: "Intermediate",
                                },
                                {
                                  title: "AWS Cloud Fundamentals",
                                  description: "Learn cloud computing basics and AWS core services",
                                  duration: "30 hours",
                                  price: 99,
                                  level: "Beginner",
                                },
                              ].map((course, index) => (
                                <Card key={index} className="border border-gray-200">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h3 className="font-medium mb-1">{course.title}</h3>
                                        <p className="text-sm text-gray-600">{course.description}</p>
                                      </div>
                                      <Badge variant="secondary">{course.level}</Badge>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-1" />
                                        <span>{course.duration}</span>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Award className="w-4 h-4 mr-1" />
                                        <span>Certificate included</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span className="text-lg font-semibold text-green-600">${course.price}</span>
                                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                        Enroll Now
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Learning Path */}
                    <Card className="border-0 bg-white/60 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Suggested Learning Path</CardTitle>
                        <CardDescription>
                          {cvAnalysisResult
                            ? `Customized path for ${cvAnalysisResult.experienceLevel} developers`
                            : "Popular learning progression for web developers"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {(
                            cvAnalysisResult?.careerSuggestions || [
                              "Master fundamental programming concepts",
                              "Learn modern frontend frameworks",
                              "Understand backend development",
                              "Explore cloud technologies",
                              "Practice system design",
                            ]
                          ).map((step, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{step}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                Start Learning
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* CV Builder Tab */}
                {activeTab === "cv-builder" && (
                  <CVBuilder
                    cvAnalysisResult={cvAnalysisResult}
                    onSave={(cvData) => {
                      addToast({
                        type: "success",
                        title: "CV Saved!",
                        description: "Your CV has been saved successfully.",
                      })
                    }}
                  />
                )}

                {/* Overview tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <CardContent className="p-6">
                        <h1 className="text-2xl font-bold mb-2">Welcome to Glassbox AI!</h1>
                        <p className="text-blue-100 mb-4">
                          Upload your CV to get comprehensive AI-powered analysis and career insights.
                        </p>
                        <Button
                          className="bg-white text-blue-600 hover:bg-gray-100"
                          onClick={() => handleTabChange("cv-analysis")}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Start CV Analysis
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Feature Overview Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">CV Analysis</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Get detailed insights about your skills, experience, and career potential
                          </p>
                          <Button size="sm" variant="outline" onClick={() => handleTabChange("cv-analysis")}>
                            Get Started
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                          <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Job Matching</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Find perfect job opportunities that match your skills and experience
                          </p>
                          <Button size="sm" variant="outline" onClick={() => handleTabChange("job-matching")}>
                            Explore Jobs
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow relative">
                        <CardContent className="p-6 text-center">
                          <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Interview Prep</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Practice with AI-powered interview questions and get feedback
                          </p>
                          {!isPremium && <Badge className="absolute top-2 right-2 bg-yellow-500">Premium</Badge>}
                          <Button size="sm" variant="outline" onClick={() => handleTabChange("interview-prep")}>
                            Start Practice
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                          <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Skill Development</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Get personalized course recommendations to advance your career
                          </p>
                          <Button size="sm" variant="outline" onClick={() => handleTabChange("courses")}>
                            Browse Courses
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow relative">
                        <CardContent className="p-6 text-center">
                          <Calculator className="w-12 h-12 text-red-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Salary Tools</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Market analysis and negotiation strategies for better compensation
                          </p>
                          {!isPremium && <Badge className="absolute top-2 right-2 bg-yellow-500">Premium</Badge>}
                          <Button size="sm" variant="outline" onClick={() => handleTabChange("salary-negotiation")}>
                            Explore Tools
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                          <User className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">CV Builder</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Create professional CVs with AI suggestions and modern templates
                          </p>
                          <Button size="sm" variant="outline" onClick={() => handleTabChange("cv-builder")}>
                            Build CV
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  )
}
