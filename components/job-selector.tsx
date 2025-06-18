"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

// Sample job data
const jobData = [
  {
    id: 1,
    title: "Frontend Developer",
    companies: [
      {
        name: "TechCorp Inc.",
        skills: ["JavaScript", "React", "TypeScript", "CSS", "HTML"],
        experience: "3-5 years",
        strengths: ["UI/UX knowledge", "Performance optimization", "Component architecture"],
      },
      {
        name: "InnovateSoft",
        skills: ["JavaScript", "Vue.js", "Tailwind CSS", "Jest", "Webpack"],
        experience: "2-4 years",
        strengths: ["Responsive design", "State management", "Testing"],
      },
    ],
  },
  {
    id: 2,
    title: "Full Stack Developer",
    companies: [
      {
        name: "StartupXYZ",
        skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
        experience: "4-6 years",
        strengths: ["API design", "Database optimization", "Full-stack architecture"],
      },
      {
        name: "GrowthTech",
        skills: ["TypeScript", "Angular", "NestJS", "PostgreSQL", "Docker"],
        experience: "3-5 years",
        strengths: ["Microservices", "CI/CD", "Cloud deployment"],
      },
    ],
  },
  {
    id: 3,
    title: "UX/UI Designer",
    companies: [
      {
        name: "DesignStudio",
        skills: ["Figma", "Adobe XD", "Sketch", "User Research", "Prototyping"],
        experience: "2-4 years",
        strengths: ["User-centered design", "Design systems", "Usability testing"],
      },
      {
        name: "CreativeLabs",
        skills: ["Adobe Creative Suite", "Wireframing", "UI Animation", "Design Thinking"],
        experience: "3-5 years",
        strengths: ["Visual design", "Interaction design", "Brand identity"],
      },
    ],
  },
]

interface JobSelectorProps {
  onJobSelect: (jobDetails: {
    role: string
    company: string
    skills: string[]
    experience: string
    strengths: string[]
  }) => void
}

export function JobSelector({ onJobSelect }: JobSelectorProps) {
  const [selectedJob, setSelectedJob] = useState<string>("")
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [jobSearch, setJobSearch] = useState<string>("")

  const filteredJobs = jobData.filter((job) => job.title.toLowerCase().includes(jobSearch.toLowerCase()))

  const handleJobSelect = (jobTitle: string) => {
    setSelectedJob(jobTitle)
    setSelectedCompany("")
  }

  const handleCompanySelect = (companyName: string) => {
    setSelectedCompany(companyName)

    const job = jobData.find((j) => j.title === selectedJob)
    const company = job?.companies.find((c) => c.name === companyName)

    if (job && company) {
      onJobSelect({
        role: job.title,
        company: companyName,
        skills: company.skills,
        experience: company.experience,
        strengths: company.strengths,
      })
    }
  }

  const currentJob = jobData.find((job) => job.title === selectedJob)

  return (
    <Card className="border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Select Job & Company</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="job-search">Search Job Titles</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="job-search"
              placeholder="Search jobs..."
              className="pl-8"
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {filteredJobs.map((job) => (
            <Button
              key={job.id}
              variant={selectedJob === job.title ? "default" : "outline"}
              className={`justify-start h-auto py-3 ${selectedJob === job.title ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}`}
              onClick={() => handleJobSelect(job.title)}
            >
              {job.title}
            </Button>
          ))}
        </div>

        {selectedJob && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="company-select">Select Company</Label>
            <Select value={selectedCompany} onValueChange={handleCompanySelect}>
              <SelectTrigger id="company-select">
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {currentJob?.companies.map((company) => (
                  <SelectItem key={company.name} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedJob && selectedCompany && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium mb-2">Selected Position</h4>
            <p className="text-gray-700">
              {selectedJob} at {selectedCompany}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
