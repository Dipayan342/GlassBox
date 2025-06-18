"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Users,
  Star,
  Bookmark,
  Send,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Globe,
} from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  salary: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: Date
  applicationDeadline?: Date
  matchScore: number
  source: "linkedin" | "indeed" | "glassdoor" | "company"
  applicationStatus?: "not-applied" | "applied" | "interviewing" | "rejected" | "offered"
  companyRating: number
  companySize: string
  remote: boolean
}

interface JobIntegrationProps {
  userSkills: string[]
  userLocation: string
  userExperience: string
}

export function JobIntegration({ userSkills, userLocation, userExperience }: JobIntegrationProps) {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [autoApply, setAutoApply] = useState(false)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [filters, setFilters] = useState({
    minSalary: 0,
    maxSalary: 200000,
    remote: false,
    jobType: "all",
  })
  const { addToast } = useToast()

  // Simulate fetching jobs from multiple sources
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)

      // Simulate API calls to job boards
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockJobs: JobListing[] = [
        {
          id: "1",
          title: "Senior React Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          type: "full-time",
          salary: { min: 120000, max: 160000, currency: "USD" },
          description: "We're looking for a senior React developer to join our growing team...",
          requirements: ["React", "TypeScript", "Node.js", "5+ years experience"],
          benefits: ["Health insurance", "401k", "Remote work", "Stock options"],
          postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          matchScore: 92,
          source: "linkedin",
          companyRating: 4.5,
          companySize: "500-1000",
          remote: true,
        },
        {
          id: "2",
          title: "Full Stack Engineer",
          company: "StartupXYZ",
          location: "New York, NY",
          type: "full-time",
          salary: { min: 100000, max: 140000, currency: "USD" },
          description: "Join our fast-growing startup as a full stack engineer...",
          requirements: ["JavaScript", "React", "Python", "AWS", "3+ years experience"],
          benefits: ["Equity", "Flexible hours", "Learning budget"],
          postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          matchScore: 88,
          source: "indeed",
          companyRating: 4.2,
          companySize: "50-100",
          remote: false,
        },
        {
          id: "3",
          title: "Frontend Developer",
          company: "DesignStudio",
          location: "Remote",
          type: "contract",
          salary: { min: 80, max: 120, currency: "USD" },
          description: "Remote contract position for an experienced frontend developer...",
          requirements: ["React", "CSS", "JavaScript", "Design systems"],
          benefits: ["Flexible schedule", "Remote work"],
          postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          matchScore: 85,
          source: "glassdoor",
          companyRating: 4.0,
          companySize: "10-50",
          remote: true,
        },
      ]

      setJobs(mockJobs)
      setIsLoading(false)
    }

    fetchJobs()
  }, [userSkills, userLocation, userExperience])

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
    addToast({
      type: "success",
      title: savedJobs.includes(jobId) ? "Job Unsaved" : "Job Saved",
      description: savedJobs.includes(jobId) ? "Removed from saved jobs" : "Added to saved jobs",
    })
  }

  const handleApplyToJob = async (job: JobListing) => {
    setAppliedJobs((prev) => [...prev, job.id])

    // Simulate application process
    addToast({
      type: "info",
      title: "Applying to Job",
      description: `Submitting application to ${job.company}...`,
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addToast({
      type: "success",
      title: "Application Submitted",
      description: `Your application to ${job.company} has been submitted successfully!`,
    })
  }

  const handleQuickApply = async (job: JobListing) => {
    // Auto-apply with pre-filled information
    await handleApplyToJob(job)
  }

  const getSourceIcon = (source: JobListing["source"]) => {
    switch (source) {
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-blue-600" />
      case "indeed":
        return <Globe className="w-4 h-4 text-blue-800" />
      case "glassdoor":
        return <Building className="w-4 h-4 text-green-600" />
      default:
        return <Globe className="w-4 h-4 text-gray-600" />
    }
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-blue-100 text-blue-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  const filteredJobs = jobs.filter((job) => {
    if (filters.remote && !job.remote) return false
    if (filters.jobType !== "all" && job.type !== filters.jobType) return false
    if (job.salary.min < filters.minSalary || job.salary.max > filters.maxSalary) return false
    return true
  })

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Finding Perfect Jobs</h3>
          <p className="text-gray-600">Searching across LinkedIn, Indeed, and Glassdoor...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Integration Status */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ExternalLink className="w-5 h-5 mr-2" />
            Job Board Integrations
          </CardTitle>
          <CardDescription>Connected platforms and auto-application settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Connected Platforms</h4>
              <div className="space-y-3">
                {[
                  { name: "LinkedIn Jobs", status: "connected", count: 45 },
                  { name: "Indeed", status: "connected", count: 32 },
                  { name: "Glassdoor", status: "connected", count: 18 },
                  { name: "AngelList", status: "disconnected", count: 0 },
                ].map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {platform.status === "connected" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="font-medium">{platform.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {platform.status === "connected" && <Badge variant="outline">{platform.count} jobs</Badge>}
                      <Button size="sm" variant={platform.status === "connected" ? "outline" : "default"}>
                        {platform.status === "connected" ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Auto-Application Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-apply">Enable Auto-Apply</Label>
                    <p className="text-sm text-gray-600">Automatically apply to high-match jobs</p>
                  </div>
                  <Switch id="auto-apply" checked={autoApply} onCheckedChange={setAutoApply} />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Match Score</Label>
                  <Input type="number" placeholder="85" min="70" max="100" />
                </div>

                <div className="space-y-2">
                  <Label>Daily Application Limit</Label>
                  <Input type="number" placeholder="5" min="1" max="20" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recommended Jobs ({filteredJobs.length})</CardTitle>
          <CardDescription>Personalized job recommendations from integrated platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <Badge className={getMatchColor(job.matchScore)}>{job.matchScore}% match</Badge>
                        {job.remote && <Badge variant="outline">Remote</Badge>}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />${job.salary.min.toLocaleString()} - $
                          {job.salary.max.toLocaleString()}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 4).map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requirements.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          {getSourceIcon(job.source)}
                          <span className="ml-1 capitalize">{job.source}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {job.companyRating}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.companySize} employees
                        </div>
                        <div className="text-gray-500">
                          Posted {Math.floor((Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApplyToJob(job)}
                        disabled={appliedJobs.includes(job.id)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                      >
                        {appliedJobs.includes(job.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Applied
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Apply Now
                          </>
                        )}
                      </Button>

                      {job.matchScore >= 85 && !appliedJobs.includes(job.id) && (
                        <Button size="sm" variant="outline" onClick={() => handleQuickApply(job)}>
                          Quick Apply
                        </Button>
                      )}

                      <Button size="sm" variant="outline" onClick={() => handleSaveJob(job.id)}>
                        <Bookmark className={`w-4 h-4 mr-2 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                        {savedJobs.includes(job.id) ? "Saved" : "Save"}
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {job.applicationDeadline && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Application deadline: {job.applicationDeadline.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Tracking */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Application Tracking</CardTitle>
          <CardDescription>Monitor your job application progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{appliedJobs.length}</p>
              <p className="text-sm text-gray-600">Applications Sent</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">3</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-sm text-gray-600">Interviews Scheduled</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{savedJobs.length}</p>
              <p className="text-sm text-gray-600">Saved Jobs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
