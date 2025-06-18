"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check, Crown, Building, Star, FileText } from "lucide-react"

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan?: string
}

export function PricingModal({ isOpen, onClose, selectedPlan }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, yearly: 0 },
      icon: FileText,
      color: "gray",
      features: [
        "1 CV analysis per month",
        "Basic job matching",
        "Standard CV templates",
        "Basic skill recommendations",
        "Community support",
      ],
      limitations: ["Limited AI analysis depth", "No premium templates", "No priority support"],
    },
    {
      id: "premium",
      name: "Premium",
      description: "For serious job seekers",
      price: { monthly: 29, yearly: 290 },
      icon: Crown,
      color: "yellow",
      popular: true,
      features: [
        "Unlimited CV analyses",
        "Advanced AI insights",
        "Premium CV templates",
        "Industry-specific analysis",
        "Interview preparation",
        "Salary negotiation tips",
        "ATS optimization",
        "Priority support",
        "Course recommendations",
        "Job application tracking",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For teams and organizations",
      price: { monthly: 99, yearly: 990 },
      icon: Building,
      color: "blue",
      features: [
        "Everything in Premium",
        "Team management dashboard",
        "Bulk CV processing",
        "Custom branding",
        "API access",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom integrations",
        "White-label solution",
        "SLA guarantee",
      ],
    },
  ]

  const handleSelectPlan = (planId: string) => {
    // Simulate payment processing
    console.log(`Selected plan: ${planId} (${billingCycle})`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center">
            Unlock the full potential of AI-powered career development
          </DialogDescription>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
              className="rounded-md"
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "yearly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("yearly")}
              className="rounded-md"
            >
              Yearly
              <Badge className="ml-2 bg-green-500">Save 17%</Badge>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            const isSelected = selectedPlan === plan.id

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? "border-2 border-yellow-500 shadow-lg"
                    : isSelected
                      ? "border-2 border-blue-500"
                      : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      plan.color === "yellow"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : plan.color === "blue"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gray-500"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ${billingCycle === "yearly" ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-gray-600">/{billingCycle === "yearly" ? "year" : "month"}</span>
                    {billingCycle === "yearly" && plan.price.yearly > 0 && (
                      <div className="text-sm text-green-600 mt-1">
                        Save ${plan.price.monthly * 12 - plan.price.yearly}/year
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        : plan.id === "enterprise"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          : ""
                    }`}
                    variant={plan.id === "free" ? "outline" : "default"}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === "free" ? "Current Plan" : plan.id === "enterprise" ? "Contact Sales" : "Upgrade Now"}
                  </Button>

                  {plan.id === "enterprise" && (
                    <p className="text-xs text-center text-gray-500 mt-2">Custom pricing available for large teams</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-center">Feature Comparison</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="font-medium">Features</div>
            <div className="text-center font-medium">Free</div>
            <div className="text-center font-medium">Premium</div>
            <div className="text-center font-medium">Enterprise</div>

            {[
              { feature: "CV Analyses", free: "1/month", premium: "Unlimited", enterprise: "Unlimited" },
              { feature: "AI Depth", free: "Basic", premium: "Advanced", enterprise: "Advanced" },
              { feature: "Templates", free: "3", premium: "20+", enterprise: "Custom" },
              { feature: "Support", free: "Community", premium: "Priority", enterprise: "Dedicated" },
              { feature: "API Access", free: "❌", premium: "❌", enterprise: "✅" },
              { feature: "Team Features", free: "❌", premium: "❌", enterprise: "✅" },
            ].map((row, index) => (
              <div key={index} className="contents">
                <div className="py-2">{row.feature}</div>
                <div className="py-2 text-center">{row.free}</div>
                <div className="py-2 text-center">{row.premium}</div>
                <div className="py-2 text-center">{row.enterprise}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
