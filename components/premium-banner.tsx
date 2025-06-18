"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Star } from "lucide-react"

interface PremiumBannerProps {
  feature: string
  onUpgrade: () => void
}

export function PremiumBanner({ feature, onUpgrade }: PremiumBannerProps) {
  return (
    <Card className="border-2 border-gradient-to-r from-yellow-400 to-orange-500 bg-gradient-to-r from-yellow-50 to-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Unlock {feature}</h3>
              <p className="text-sm text-gray-600">Upgrade to Premium for advanced features</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
