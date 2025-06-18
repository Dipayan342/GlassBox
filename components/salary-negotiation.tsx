"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingUp, Target, Lightbulb, Calculator, MapPin, Building, Award } from "lucide-react"

interface SalaryNegotiationProps {
  currentSalary?: number
  targetRole?: string
  location?: string
  experience?: string
  isPremium?: boolean
}

export function SalaryNegotiation({
  currentSalary = 75000,
  targetRole = "Software Developer",
  location = "San Francisco, CA",
  experience = "mid-level",
  isPremium = false,
}: SalaryNegotiationProps) {
  const [desiredSalary, setDesiredSalary] = useState<number>(90000)
  const [benefits, setBenefits] = useState<string[]>([])

  const marketData = {
    min: 85000,
    max: 120000,
    median: 102000,
    percentile75: 115000,
    percentile90: 130000,
  }

  const negotiationTips = [
    {
      category: "Research",
      tip: "Know your market value",
      description: "Research salary ranges for your role in your location using multiple sources.",
    },
    {
      category: "Timing",
      tip: "Choose the right moment",
      description:
        "Best times are during performance reviews, after completing major projects, or when taking on new responsibilities.",
    },
    {
      category: "Value",
      tip: "Demonstrate your worth",
      description: "Prepare specific examples of your contributions, achievements, and impact on the company.",
    },
    {
      category: "Benefits",
      tip: "Consider total compensation",
      description: "Factor in health insurance, retirement contributions, stock options, and other benefits.",
    },
  ]

  const calculateNegotiationRange = () => {
    const increase = desiredSalary - currentSalary
    const percentageIncrease = (increase / currentSalary) * 100

    return {
      increase,
      percentageIncrease,
      isReasonable: percentageIncrease <= 20 && desiredSalary <= marketData.percentile75,
    }
  }

  const negotiationData = calculateNegotiationRange()

  return (
    <div className="space-y-6">
      {/* Market Analysis */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Market Salary Analysis
          </CardTitle>
          <CardDescription>
            Salary data for {targetRole} in {location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Market Range</span>
                <span className="font-semibold">
                  ${marketData.min.toLocaleString()} - ${marketData.max.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Median Salary</span>
                <span className="font-semibold text-blue-600">${marketData.median.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">75th Percentile</span>
                <span className="font-semibold text-green-600">${marketData.percentile75.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location Factor
                </h4>
                <p className="text-sm text-gray-600">
                  {location} has a +15% salary premium compared to national average
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Experience Level
                </h4>
                <p className="text-sm text-gray-600">
                  {experience} professionals typically earn ${marketData.median.toLocaleString()} - $
                  {marketData.percentile75.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Calculator */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Negotiation Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-salary">Current Salary</Label>
                <Input
                  id="current-salary"
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setDesiredSalary(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="desired-salary">Desired Salary</Label>
                <Input
                  id="desired-salary"
                  type="number"
                  value={desiredSalary}
                  onChange={(e) => setDesiredSalary(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Negotiation Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Salary Increase:</span>
                    <span className="font-medium">${negotiationData.increase.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Percentage Increase:</span>
                    <span
                      className={`font-medium ${negotiationData.percentageIncrease > 20 ? "text-red-600" : "text-green-600"}`}
                    >
                      {negotiationData.percentageIncrease.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Position:</span>
                    <Badge
                      className={
                        desiredSalary <= marketData.median
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {desiredSalary <= marketData.median ? "Below Median" : "Above Median"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${negotiationData.isReasonable ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
              >
                <h4 className={`font-medium mb-1 ${negotiationData.isReasonable ? "text-green-800" : "text-red-800"}`}>
                  {negotiationData.isReasonable ? "Reasonable Request" : "High Risk Request"}
                </h4>
                <p className={`text-sm ${negotiationData.isReasonable ? "text-green-700" : "text-red-700"}`}>
                  {negotiationData.isReasonable
                    ? "Your request is within market range and likely to be considered."
                    : "Your request may be too high. Consider a more conservative approach."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Negotiation Tips */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="w-5 h-5 mr-2" />
            Negotiation Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {negotiationTips.map((tip, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{tip.tip}</h4>
                    <Badge variant="outline" className="mb-2">
                      {tip.category}
                    </Badge>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Plan */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium mb-3 text-blue-900">Your Negotiation Action Plan</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>
                  Target salary: ${desiredSalary.toLocaleString()} ({negotiationData.percentageIncrease.toFixed(1)}%
                  increase)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>
                  Market position: {desiredSalary > marketData.median ? "Above" : "Below"} median for {targetRole}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>
                  Negotiation range: ${(desiredSalary * 0.9).toLocaleString()} - ${desiredSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Template */}
      {isPremium && (
        <Card className="border-0 bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Negotiation Email Template</CardTitle>
            <CardDescription>Customized email template for your situation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap text-gray-700">
                {`Subject: Discussion About Compensation Review

Dear [Manager's Name],

I hope this email finds you well. I wanted to schedule a time to discuss my compensation based on my current contributions and market research.

Over the past [time period], I have:
• [Specific achievement 1]
• [Specific achievement 2]
• [Specific achievement 3]

Based on my research of market rates for ${targetRole} positions in ${location}, and considering my ${experience} experience level, I believe a salary adjustment to $${desiredSalary.toLocaleString()} would be appropriate.

I would appreciate the opportunity to discuss this further at your convenience.

Best regards,
[Your Name]`}
              </pre>
            </div>
            <Button className="mt-4" variant="outline">
              Copy Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
