"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock } from "lucide-react"

interface ProgressStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "pending"
  optional?: boolean
}

interface ProgressTrackerProps {
  steps: ProgressStep[]
  currentStep?: string
}

export function ProgressTracker({ steps, currentStep }: ProgressTrackerProps) {
  const getStepIcon = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "current":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "pending":
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStepColor = (status: ProgressStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "current":
        return "text-blue-600"
      case "pending":
        return "text-gray-400"
    }
  }

  return (
    <Card className="border-0 bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex flex-col items-center">
                {getStepIcon(step.status)}
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-2 ${step.status === "completed" ? "bg-green-600" : "bg-gray-200"}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-medium ${getStepColor(step.status)}`}>{step.title}</h4>
                  {step.optional && (
                    <Badge variant="outline" className="text-xs">
                      Optional
                    </Badge>
                  )}
                  {step.status === "current" && <Badge className="text-xs bg-blue-600">Current</Badge>}
                </div>
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
