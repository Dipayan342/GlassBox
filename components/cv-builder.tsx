"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Save,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Brain,
  Palette,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  CheckCircle,
  Lightbulb,
} from "lucide-react"
import type { CVAnalysisResult } from "@/app/actions/analyze-cv"

interface CVData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
    achievements: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    location: string
    startDate: string
    endDate: string
    gpa: string
    description: string
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: Array<{ name: string; level: string }>
    certifications: string[]
  }
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url: string
    github: string
    startDate: string
    endDate: string
  }>
  template: string
  theme: {
    primaryColor: string
    fontFamily: string
    fontSize: string
  }
}

interface CVBuilderProps {
  cvAnalysisResult?: CVAnalysisResult | null
  onSave: (cvData: CVData) => void
}

const templates = [
  { id: "modern", name: "Modern", color: "blue", description: "Clean and contemporary design" },
  { id: "classic", name: "Classic", color: "gray", description: "Traditional professional layout" },
  { id: "creative", name: "Creative", color: "purple", description: "Unique design for creative roles" },
  { id: "minimal", name: "Minimal", color: "green", description: "Simple and elegant" },
]

const steps = [
  { id: "template", title: "Template", icon: Palette },
  { id: "personal", title: "Personal Info", icon: User },
  { id: "experience", title: "Experience", icon: Briefcase },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "skills", title: "Skills", icon: Code },
  { id: "projects", title: "Projects", icon: FolderOpen },
  { id: "review", title: "Review", icon: CheckCircle },
]

export function CVBuilder({ cvAnalysisResult, onSave }: CVBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: cvAnalysisResult
        ? `${cvAnalysisResult.experienceLevel} professional with expertise in ${cvAnalysisResult.skills.slice(0, 3).join(", ")}. ${cvAnalysisResult.strengths[0]}.`
        : "",
    },
    experience: [],
    education: [],
    skills: {
      technical: cvAnalysisResult?.skills || [],
      soft: [],
      languages: [],
      certifications: [],
    },
    projects: [],
    template: "modern",
    theme: {
      primaryColor: "#2563eb",
      fontFamily: "Inter",
      fontSize: "14",
    },
  })

  const updateCVData = (section: keyof CVData, data: any) => {
    setCvData((prev) => ({ ...prev, [section]: data }))
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [""],
    }
    updateCVData("experience", [...cvData.experience, newExp])
  }

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = cvData.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    updateCVData("experience", updated)
  }

  const removeExperience = (id: string) => {
    updateCVData(
      "experience",
      cvData.experience.filter((exp) => exp.id !== id),
    )
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    }
    updateCVData("education", [...cvData.education, newEdu])
  }

  const updateEducation = (id: string, field: string, value: any) => {
    const updated = cvData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    updateCVData("education", updated)
  }

  const removeEducation = (id: string) => {
    updateCVData(
      "education",
      cvData.education.filter((edu) => edu.id !== id),
    )
  }

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
      startDate: "",
      endDate: "",
    }
    updateCVData("projects", [...cvData.projects, newProject])
  }

  const updateProject = (id: string, field: string, value: any) => {
    const updated = cvData.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project))
    updateCVData("projects", updated)
  }

  const removeProject = (id: string) => {
    updateCVData(
      "projects",
      cvData.projects.filter((project) => project.id !== id),
    )
  }

  const generatePDF = async () => {
    // In a real implementation, you'd use a library like jsPDF or Puppeteer
    // For now, we'll simulate PDF generation
    const element = previewRef.current
    if (!element) return

    // Simulate PDF generation
    const link = document.createElement("a")
    link.download = `${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}_CV.pdf`
    link.href = "#" // In real implementation, this would be the PDF blob URL
    link.click()

    // Show success message
    alert("PDF generated successfully! (This is a demo - in production, a real PDF would be downloaded)")
  }

  const saveDraft = () => {
    localStorage.setItem("cv-draft", JSON.stringify(cvData))
    onSave(cvData)
  }

  const loadDraft = () => {
    const saved = localStorage.getItem("cv-draft")
    if (saved) {
      setCvData(JSON.parse(saved))
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getAISuggestions = () => {
    if (!cvAnalysisResult) return []

    const suggestions = [
      `Highlight your ${cvAnalysisResult.skills[0]} expertise in your summary`,
      `Emphasize your ${cvAnalysisResult.experienceLevel} experience level`,
      `Include projects showcasing ${cvAnalysisResult.skills[1]} skills`,
      `Add quantifiable achievements to demonstrate impact`,
    ]

    return suggestions
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Professional CV Builder</CardTitle>
              <CardDescription>Create a professional CV with AI-powered suggestions</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={loadDraft}>
                Load Draft
              </Button>
              <Button variant="outline" onClick={saveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Steps */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = index === currentStep
                  const isCompleted = index < currentStep

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : isCompleted
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                        onClick={() => setCurrentStep(index)}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`ml-2 text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`}>
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-4 ${isCompleted ? "bg-green-600" : "bg-gray-200"}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {cvAnalysisResult && (
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center text-blue-800">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Suggestions
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {getAISuggestions().map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Step Content */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              {/* Template Selection */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Choose Your Template</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            cvData.template === template.id
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => updateCVData("template", template.id)}
                        >
                          <div className="bg-white h-32 rounded border flex items-center justify-center mb-3">
                            <div
                              className={`w-16 h-20 bg-${template.color}-100 rounded flex items-center justify-center`}
                            >
                              <FileText className={`w-8 h-8 text-${template.color}-600`} />
                            </div>
                          </div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          {cvData.template === template.id && (
                            <Badge className="w-full justify-center mt-2">Selected</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Theme Customization */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Customize Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <input
                          type="color"
                          id="primaryColor"
                          value={cvData.theme.primaryColor}
                          onChange={(e) => updateCVData("theme", { ...cvData.theme, primaryColor: e.target.value })}
                          className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fontFamily">Font Family</Label>
                        <Select
                          value={cvData.theme.fontFamily}
                          onValueChange={(value) => updateCVData("theme", { ...cvData.theme, fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="fontSize">Font Size</Label>
                        <Select
                          value={cvData.theme.fontSize}
                          onValueChange={(value) => updateCVData("theme", { ...cvData.theme, fontSize: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12px</SelectItem>
                            <SelectItem value="14">14px</SelectItem>
                            <SelectItem value="16">16px</SelectItem>
                            <SelectItem value="18">18px</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={cvData.personalInfo.firstName}
                        onChange={(e) =>
                          updateCVData("personalInfo", { ...cvData.personalInfo, firstName: e.target.value })
                        }
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={cvData.personalInfo.lastName}
                        onChange={(e) =>
                          updateCVData("personalInfo", { ...cvData.personalInfo, lastName: e.target.value })
                        }
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cvData.personalInfo.email}
                        onChange={(e) =>
                          updateCVData("personalInfo", { ...cvData.personalInfo, email: e.target.value })
                        }
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) =>
                          updateCVData("personalInfo", { ...cvData.personalInfo, phone: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={cvData.personalInfo.location}
                      onChange={(e) =>
                        updateCVData("personalInfo", { ...cvData.personalInfo, location: e.target.value })
                      }
                      className="mt-1"
                      placeholder="City, State/Country"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={cvData.personalInfo.website}
                        onChange={(e) =>
                          updateCVData("personalInfo", { ...cvData.personalInfo, website: e.target.value })
                        }
                        className="mt-1"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={cvData.personalInfo.linkedin}
                        onChange={(e) =>
                          updateCVData("personalInfo", { ...cvData.personalInfo, linkedin: e.target.value })
                        }
                        className="mt-1"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={cvData.personalInfo.github}
                        onChange={(e) =>
                          updateCVData("personalInfo", { ...cvData.personalInfo, github: e.target.value })
                        }
                        className="mt-1"
                        placeholder="github.com/username"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="summary">Professional Summary *</Label>
                    <Textarea
                      id="summary"
                      value={cvData.personalInfo.summary}
                      onChange={(e) =>
                        updateCVData("personalInfo", { ...cvData.personalInfo, summary: e.target.value })
                      }
                      className="mt-1 h-32"
                      placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      2-3 sentences that summarize your professional background and career goals
                    </p>
                  </div>
                </div>
              )}

              {/* Experience */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Work Experience</h3>
                    <Button onClick={addExperience} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>

                  {cvData.experience.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No work experience added yet</p>
                      <Button onClick={addExperience} variant="outline" className="mt-2">
                        Add Your First Job
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.experience.map((exp, index) => (
                        <Card key={exp.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">Experience #{index + 1}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(exp.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Company *</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                  placeholder="Company Name"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Position *</Label>
                                <Input
                                  value={exp.position}
                                  onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                                  placeholder="Job Title"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <Label>Location</Label>
                                <Input
                                  value={exp.location}
                                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                  placeholder="City, State"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Start Date *</Label>
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                  className="mt-1"
                                  disabled={exp.current}
                                />
                                <div className="flex items-center mt-2">
                                  <input
                                    type="checkbox"
                                    id={`current-${exp.id}`}
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                                    className="mr-2"
                                  />
                                  <Label htmlFor={`current-${exp.id}`} className="text-sm">
                                    Current position
                                  </Label>
                                </div>
                              </div>
                            </div>

                            <div className="mb-4">
                              <Label>Job Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                placeholder="Describe your role, responsibilities, and key accomplishments..."
                                className="mt-1 h-24"
                              />
                            </div>

                            <div>
                              <Label>Key Achievements</Label>
                              {exp.achievements.map((achievement, achIndex) => (
                                <div key={achIndex} className="flex items-center mt-2">
                                  <Input
                                    value={achievement}
                                    onChange={(e) => {
                                      const newAchievements = [...exp.achievements]
                                      newAchievements[achIndex] = e.target.value
                                      updateExperience(exp.id, "achievements", newAchievements)
                                    }}
                                    placeholder="• Quantifiable achievement or impact..."
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newAchievements = exp.achievements.filter((_, i) => i !== achIndex)
                                      updateExperience(exp.id, "achievements", newAchievements)
                                    }}
                                    className="ml-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateExperience(exp.id, "achievements", [...exp.achievements, ""])}
                                className="mt-2"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Achievement
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Education */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Education</h3>
                    <Button onClick={addEducation} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>

                  {cvData.education.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No education added yet</p>
                      <Button onClick={addEducation} variant="outline" className="mt-2">
                        Add Education
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.education.map((edu, index) => (
                        <Card key={edu.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">Education #{index + 1}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(edu.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Institution *</Label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                                  placeholder="University/School Name"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Degree *</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                  placeholder="Bachelor's, Master's, PhD, etc."
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Field of Study</Label>
                                <Input
                                  value={edu.field}
                                  onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                                  placeholder="Computer Science, Engineering, etc."
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Location</Label>
                                <Input
                                  value={edu.location}
                                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                  placeholder="City, State"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <Label>Start Date</Label>
                                <Input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>GPA (Optional)</Label>
                                <Input
                                  value={edu.gpa}
                                  onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                                  placeholder="3.8/4.0"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={edu.description}
                                onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                                placeholder="Relevant coursework, honors, activities..."
                                className="mt-1 h-20"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Skills & Competencies</h3>

                  <div>
                    <Label>Technical Skills</Label>
                    <Input
                      value={cvData.skills.technical.join(", ")}
                      onChange={(e) =>
                        updateCVData("skills", {
                          ...cvData.skills,
                          technical: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        })
                      }
                      placeholder="JavaScript, React, Node.js, Python, AWS..."
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                  </div>

                  <div>
                    <Label>Soft Skills</Label>
                    <Input
                      value={cvData.skills.soft.join(", ")}
                      onChange={(e) =>
                        updateCVData("skills", {
                          ...cvData.skills,
                          soft: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        })
                      }
                      placeholder="Leadership, Communication, Problem Solving..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Languages</Label>
                    <div className="space-y-2 mt-1">
                      {cvData.skills.languages.map((lang, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={lang.name}
                            onChange={(e) => {
                              const newLangs = [...cvData.skills.languages]
                              newLangs[index] = { ...lang, name: e.target.value }
                              updateCVData("skills", { ...cvData.skills, languages: newLangs })
                            }}
                            placeholder="Language"
                            className="flex-1"
                          />
                          <Select
                            value={lang.level}
                            onValueChange={(value) => {
                              const newLangs = [...cvData.skills.languages]
                              newLangs[index] = { ...lang, level: value }
                              updateCVData("skills", { ...cvData.skills, languages: newLangs })
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="native">Native</SelectItem>
                              <SelectItem value="fluent">Fluent</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="basic">Basic</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newLangs = cvData.skills.languages.filter((_, i) => i !== index)
                              updateCVData("skills", { ...cvData.skills, languages: newLangs })
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateCVData("skills", {
                            ...cvData.skills,
                            languages: [...cvData.skills.languages, { name: "", level: "" }],
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Language
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Certifications</Label>
                    <Input
                      value={cvData.skills.certifications.join(", ")}
                      onChange={(e) =>
                        updateCVData("skills", {
                          ...cvData.skills,
                          certifications: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s),
                        })
                      }
                      placeholder="AWS Certified, Google Cloud Professional..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Projects */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Projects</h3>
                    <Button onClick={addProject} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>

                  {cvData.projects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FolderOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No projects added yet</p>
                      <Button onClick={addProject} variant="outline" className="mt-2">
                        Add Your First Project
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cvData.projects.map((project, index) => (
                        <Card key={project.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">Project #{index + 1}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProject(project.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Project Name *</Label>
                                <Input
                                  value={project.name}
                                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                                  placeholder="Project Title"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>Technologies Used</Label>
                                <Input
                                  value={project.technologies.join(", ")}
                                  onChange={(e) =>
                                    updateProject(
                                      project.id,
                                      "technologies",
                                      e.target.value
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter((s) => s),
                                    )
                                  }
                                  placeholder="React, Node.js, MongoDB..."
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="mb-4">
                              <Label>Description *</Label>
                              <Textarea
                                value={project.description}
                                onChange={(e) => updateProject(project.id, "description", e.target.value)}
                                placeholder="Describe the project, your role, and key achievements..."
                                className="mt-1 h-24"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label>Project URL</Label>
                                <Input
                                  value={project.url}
                                  onChange={(e) => updateProject(project.id, "url", e.target.value)}
                                  placeholder="https://project-demo.com"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>GitHub Repository</Label>
                                <Input
                                  value={project.github}
                                  onChange={(e) => updateProject(project.id, "github", e.target.value)}
                                  placeholder="https://github.com/username/repo"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Start Date</Label>
                                <Input
                                  type="month"
                                  value={project.startDate}
                                  onChange={(e) => updateProject(project.id, "startDate", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input
                                  type="month"
                                  value={project.endDate}
                                  onChange={(e) => updateProject(project.id, "endDate", e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Review */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Review Your CV</h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">CV Completeness</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Personal Information</span>
                          <Badge
                            variant={
                              cvData.personalInfo.firstName && cvData.personalInfo.email ? "default" : "secondary"
                            }
                          >
                            {cvData.personalInfo.firstName && cvData.personalInfo.email ? "Complete" : "Incomplete"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Work Experience</span>
                          <Badge variant={cvData.experience.length > 0 ? "default" : "secondary"}>
                            {cvData.experience.length} {cvData.experience.length === 1 ? "entry" : "entries"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Education</span>
                          <Badge variant={cvData.education.length > 0 ? "default" : "secondary"}>
                            {cvData.education.length} {cvData.education.length === 1 ? "entry" : "entries"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Skills</span>
                          <Badge variant={cvData.skills.technical.length > 0 ? "default" : "secondary"}>
                            {cvData.skills.technical.length} technical skills
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Projects</span>
                          <Badge variant={cvData.projects.length > 0 ? "default" : "secondary"}>
                            {cvData.projects.length} {cvData.projects.length === 1 ? "project" : "projects"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Final Actions</h4>
                      <div className="space-y-3">
                        <Button onClick={generatePDF} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button onClick={saveDraft} variant="outline" className="w-full">
                          <Save className="w-4 h-4 mr-2" />
                          Save Draft
                        </Button>
                        <Button onClick={() => setShowPreview(true)} variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview CV
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* CV Summary */}
                  <Card className="border border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2 text-green-800">CV Summary</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>
                          •{" "}
                          <strong>
                            {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                          </strong>
                        </p>
                        <p>• {cvData.experience.length} work experience entries</p>
                        <p>• {cvData.education.length} education entries</p>
                        <p>• {cvData.skills.technical.length} technical skills</p>
                        <p>• {cvData.projects.length} projects</p>
                        <p>• Template: {templates.find((t) => t.id === cvData.template)?.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={saveDraft}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>

                  {currentStep === steps.length - 1 ? (
                    <Button onClick={generatePDF} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  ) : (
                    <Button onClick={nextStep}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-1">
            <Card className="border-0 bg-white/60 backdrop-blur-sm sticky top-4">
              <CardHeader>
                <CardTitle className="text-sm">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div
                  ref={previewRef}
                  className="bg-white border rounded-lg p-4 text-xs"
                  style={{
                    fontFamily: cvData.theme.fontFamily,
                    fontSize: `${cvData.theme.fontSize}px`,
                    minHeight: "600px",
                  }}
                >
                  {/* CV Preview Content */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-center border-b pb-4" style={{ borderColor: cvData.theme.primaryColor }}>
                      <h1 className="text-lg font-bold" style={{ color: cvData.theme.primaryColor }}>
                        {cvData.personalInfo.firstName} {cvData.personalInfo.lastName}
                      </h1>
                      <div className="text-xs text-gray-600 mt-1">
                        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
                        {cvData.personalInfo.phone && <span> • {cvData.personalInfo.phone}</span>}
                        {cvData.personalInfo.location && <span> • {cvData.personalInfo.location}</span>}
                      </div>
                      {(cvData.personalInfo.linkedin || cvData.personalInfo.github || cvData.personalInfo.website) && (
                        <div className="text-xs text-gray-600 mt-1">
                          {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
                          {cvData.personalInfo.github && <span> • {cvData.personalInfo.github}</span>}
                          {cvData.personalInfo.website && <span> • {cvData.personalInfo.website}</span>}
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    {cvData.personalInfo.summary && (
                      <div>
                        <h2 className="font-semibold text-sm mb-2" style={{ color: cvData.theme.primaryColor }}>
                          Professional Summary
                        </h2>
                        <p className="text-xs text-gray-700">{cvData.personalInfo.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {cvData.experience.length > 0 && (
                      <div>
                        <h2 className="font-semibold text-sm mb-2" style={{ color: cvData.theme.primaryColor }}>
                          Work Experience
                        </h2>
                        <div className="space-y-3">
                          {cvData.experience.map((exp) => (
                            <div key={exp.id}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-xs">{exp.position}</h3>
                                  <p className="text-xs text-gray-600">{exp.company}</p>
                                </div>
                                <div className="text-xs text-gray-500 text-right">
                                  <p>
                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                  </p>
                                  {exp.location && <p>{exp.location}</p>}
                                </div>
                              </div>
                              {exp.description && <p className="text-xs text-gray-700 mt-1">{exp.description}</p>}
                              {exp.achievements.filter((a) => a).length > 0 && (
                                <ul className="text-xs text-gray-700 mt-1 list-disc list-inside">
                                  {exp.achievements
                                    .filter((a) => a)
                                    .map((achievement, index) => (
                                      <li key={index}>{achievement}</li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {cvData.education.length > 0 && (
                      <div>
                        <h2 className="font-semibold text-sm mb-2" style={{ color: cvData.theme.primaryColor }}>
                          Education
                        </h2>
                        <div className="space-y-2">
                          {cvData.education.map((edu) => (
                            <div key={edu.id}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-xs">
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                  </h3>
                                  <p className="text-xs text-gray-600">{edu.institution}</p>
                                </div>
                                <div className="text-xs text-gray-500 text-right">
                                  <p>
                                    {edu.startDate} - {edu.endDate}
                                  </p>
                                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                                </div>
                              </div>
                              {edu.description && <p className="text-xs text-gray-700 mt-1">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {(cvData.skills.technical.length > 0 || cvData.skills.soft.length > 0) && (
                      <div>
                        <h2 className="font-semibold text-sm mb-2" style={{ color: cvData.theme.primaryColor }}>
                          Skills
                        </h2>
                        {cvData.skills.technical.length > 0 && (
                          <div className="mb-2">
                            <h3 className="font-medium text-xs mb-1">Technical Skills</h3>
                            <p className="text-xs text-gray-700">{cvData.skills.technical.join(", ")}</p>
                          </div>
                        )}
                        {cvData.skills.soft.length > 0 && (
                          <div className="mb-2">
                            <h3 className="font-medium text-xs mb-1">Soft Skills</h3>
                            <p className="text-xs text-gray-700">{cvData.skills.soft.join(", ")}</p>
                          </div>
                        )}
                        {cvData.skills.languages.length > 0 && (
                          <div className="mb-2">
                            <h3 className="font-medium text-xs mb-1">Languages</h3>
                            <p className="text-xs text-gray-700">
                              {cvData.skills.languages.map((lang) => `${lang.name} (${lang.level})`).join(", ")}
                            </p>
                          </div>
                        )}
                        {cvData.skills.certifications.length > 0 && (
                          <div>
                            <h3 className="font-medium text-xs mb-1">Certifications</h3>
                            <p className="text-xs text-gray-700">{cvData.skills.certifications.join(", ")}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Projects */}
                    {cvData.projects.length > 0 && (
                      <div>
                        <h2 className="font-semibold text-sm mb-2" style={{ color: cvData.theme.primaryColor }}>
                          Projects
                        </h2>
                        <div className="space-y-3">
                          {cvData.projects.map((project) => (
                            <div key={project.id}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-xs">{project.name}</h3>
                                  {project.technologies.length > 0 && (
                                    <p className="text-xs text-gray-600">{project.technologies.join(", ")}</p>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {project.startDate} - {project.endDate}
                                </div>
                              </div>
                              {project.description && (
                                <p className="text-xs text-gray-700 mt-1">{project.description}</p>
                              )}
                              <div className="text-xs text-gray-600 mt-1">
                                {project.url && <span>Demo: {project.url}</span>}
                                {project.github && <span> • Code: {project.github}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
