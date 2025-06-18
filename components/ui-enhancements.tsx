"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Palette,
  Monitor,
  Moon,
  Sun,
  Layout,
  Zap,
  Settings,
  Eye,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Upload,
} from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface ThemeSettings {
  mode: "light" | "dark" | "auto"
  primaryColor: string
  accentColor: string
  fontSize: number
  borderRadius: number
  animations: boolean
  reducedMotion: boolean
}

interface LayoutSettings {
  sidebarPosition: "left" | "right"
  compactMode: boolean
  showQuickActions: boolean
  dashboardLayout: "grid" | "list" | "cards"
  widgetOrder: string[]
}

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  soundEffects: boolean
  focusIndicators: boolean
}

export function UIEnhancements() {
  const [theme, setTheme] = useState<ThemeSettings>({
    mode: "light",
    primaryColor: "#3b82f6",
    accentColor: "#8b5cf6",
    fontSize: 14,
    borderRadius: 8,
    animations: true,
    reducedMotion: false,
  })

  const [layout, setLayout] = useState<LayoutSettings>({
    sidebarPosition: "left",
    compactMode: false,
    showQuickActions: true,
    dashboardLayout: "grid",
    widgetOrder: ["overview", "analytics", "jobs", "courses"],
  })

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    soundEffects: true,
    focusIndicators: true,
  })

  const [activeTab, setActiveTab] = useState<"theme" | "layout" | "accessibility">("theme")
  const { addToast } = useToast()

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--primary-color", theme.primaryColor)
    root.style.setProperty("--accent-color", theme.accentColor)
    root.style.setProperty("--font-size", `${theme.fontSize}px`)
    root.style.setProperty("--border-radius", `${theme.borderRadius}px`)

    if (theme.mode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    if (theme.reducedMotion) {
      root.style.setProperty("--animation-duration", "0s")
    } else {
      root.style.setProperty("--animation-duration", "0.3s")
    }
  }, [theme])

  const presetThemes = [
    { name: "Ocean Blue", primary: "#0ea5e9", accent: "#06b6d4" },
    { name: "Forest Green", primary: "#10b981", accent: "#059669" },
    { name: "Sunset Orange", primary: "#f97316", accent: "#ea580c" },
    { name: "Royal Purple", primary: "#8b5cf6", accent: "#7c3aed" },
    { name: "Rose Pink", primary: "#ec4899", accent: "#db2777" },
  ]

  const exportSettings = () => {
    const settings = { theme, layout, accessibility }
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "glassbox-ai-settings.json"
    a.click()
    URL.revokeObjectURL(url)

    addToast({
      type: "success",
      title: "Settings Exported",
      description: "Your customization settings have been downloaded",
    })
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string)
        if (settings.theme) setTheme(settings.theme)
        if (settings.layout) setLayout(settings.layout)
        if (settings.accessibility) setAccessibility(settings.accessibility)

        addToast({
          type: "success",
          title: "Settings Imported",
          description: "Your customization settings have been applied",
        })
      } catch (error) {
        addToast({
          type: "error",
          title: "Import Failed",
          description: "Invalid settings file format",
        })
      }
    }
    reader.readAsText(file)
  }

  const resetToDefaults = () => {
    setTheme({
      mode: "light",
      primaryColor: "#3b82f6",
      accentColor: "#8b5cf6",
      fontSize: 14,
      borderRadius: 8,
      animations: true,
      reducedMotion: false,
    })
    setLayout({
      sidebarPosition: "left",
      compactMode: false,
      showQuickActions: true,
      dashboardLayout: "grid",
      widgetOrder: ["overview", "analytics", "jobs", "courses"],
    })
    setAccessibility({
      highContrast: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: true,
      soundEffects: true,
      focusIndicators: true,
    })

    addToast({
      type: "info",
      title: "Settings Reset",
      description: "All customizations have been reset to defaults",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                UI Customization
              </CardTitle>
              <CardDescription>
                Personalize your Glassbox AI experience with themes, layouts, and accessibility options
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportSettings}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => document.getElementById("import-settings")?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input id="import-settings" type="file" accept=".json" onChange={importSettings} className="hidden" />
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === "theme" ? "default" : "outline"}
          onClick={() => setActiveTab("theme")}
          className="flex items-center"
        >
          <Palette className="w-4 h-4 mr-2" />
          Theme
        </Button>
        <Button
          variant={activeTab === "layout" ? "default" : "outline"}
          onClick={() => setActiveTab("layout")}
          className="flex items-center"
        >
          <Layout className="w-4 h-4 mr-2" />
          Layout
        </Button>
        <Button
          variant={activeTab === "accessibility" ? "default" : "outline"}
          onClick={() => setActiveTab("accessibility")}
          className="flex items-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          Accessibility
        </Button>
      </div>

      {/* Theme Settings */}
      {activeTab === "theme" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sun className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode */}
              <div className="space-y-3">
                <Label>Theme Mode</Label>
                <div className="flex space-x-2">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "auto", icon: Monitor, label: "Auto" },
                  ].map((mode) => (
                    <Button
                      key={mode.value}
                      variant={theme.mode === mode.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme({ ...theme, mode: mode.value as any })}
                      className="flex items-center"
                    >
                      <mode.icon className="w-4 h-4 mr-2" />
                      {mode.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-3">
                <Label>Color Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetThemes.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => setTheme({ ...theme, primaryColor: preset.primary, accentColor: preset.accent })}
                      className="justify-start"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <span>{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-3">
                <Label>Custom Colors</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Label className="w-20">Primary</Label>
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                      className="w-12 h-8 rounded border"
                    />
                    <span className="text-sm text-gray-600">{theme.primaryColor}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Label className="w-20">Accent</Label>
                    <input
                      type="color"
                      value={theme.accentColor}
                      onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                      className="w-12 h-8 rounded border"
                    />
                    <span className="text-sm text-gray-600">{theme.accentColor}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Typography & Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Size */}
              <div className="space-y-3">
                <Label>Font Size: {theme.fontSize}px</Label>
                <Slider
                  value={[theme.fontSize]}
                  onValueChange={([value]) => setTheme({ ...theme, fontSize: value })}
                  min={12}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Border Radius */}
              <div className="space-y-3">
                <Label>Border Radius: {theme.borderRadius}px</Label>
                <Slider
                  value={[theme.borderRadius]}
                  onValueChange={([value]) => setTheme({ ...theme, borderRadius: value })}
                  min={0}
                  max={20}
                  step={2}
                  className="w-full"
                />
              </div>

              {/* Animations */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Animations</Label>
                  <p className="text-sm text-gray-600">Smooth transitions and effects</p>
                </div>
                <Switch
                  checked={theme.animations}
                  onCheckedChange={(checked) => setTheme({ ...theme, animations: checked })}
                />
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-gray-600">Minimize animations for accessibility</p>
                </div>
                <Switch
                  checked={theme.reducedMotion}
                  onCheckedChange={(checked) => setTheme({ ...theme, reducedMotion: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Layout Settings */}
      {activeTab === "layout" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="w-5 h-5 mr-2" />
                Dashboard Layout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sidebar Position */}
              <div className="space-y-3">
                <Label>Sidebar Position</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={layout.sidebarPosition === "left" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayout({ ...layout, sidebarPosition: "left" })}
                  >
                    Left
                  </Button>
                  <Button
                    variant={layout.sidebarPosition === "right" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLayout({ ...layout, sidebarPosition: "right" })}
                  >
                    Right
                  </Button>
                </div>
              </div>

              {/* Dashboard Layout */}
              <div className="space-y-3">
                <Label>Content Layout</Label>
                <div className="flex space-x-2">
                  {[
                    { value: "grid", label: "Grid" },
                    { value: "list", label: "List" },
                    { value: "cards", label: "Cards" },
                  ].map((layoutType) => (
                    <Button
                      key={layoutType.value}
                      variant={layout.dashboardLayout === layoutType.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLayout({ ...layout, dashboardLayout: layoutType.value as any })}
                    >
                      {layoutType.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Compact Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Compact Mode</Label>
                  <p className="text-sm text-gray-600">Reduce spacing and padding</p>
                </div>
                <Switch
                  checked={layout.compactMode}
                  onCheckedChange={(checked) => setLayout({ ...layout, compactMode: checked })}
                />
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Quick Actions</Label>
                  <p className="text-sm text-gray-600">Display action buttons in headers</p>
                </div>
                <Switch
                  checked={layout.showQuickActions}
                  onCheckedChange={(checked) => setLayout({ ...layout, showQuickActions: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Widget Order</CardTitle>
              <CardDescription>Drag to reorder dashboard widgets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {layout.widgetOrder.map((widget, index) => (
                  <div
                    key={widget}
                    className="flex items-center justify-between p-3 border rounded-lg cursor-move hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-gray-300 rounded cursor-grab" />
                      <span className="font-medium capitalize">{widget}</span>
                    </div>
                    <Badge variant="outline">{index + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Accessibility Settings */}
      {activeTab === "accessibility" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Visual Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-gray-600">Increase color contrast for better visibility</p>
                </div>
                <Switch
                  checked={accessibility.highContrast}
                  onCheckedChange={(checked) => setAccessibility({ ...accessibility, highContrast: checked })}
                />
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Large Text</Label>
                  <p className="text-sm text-gray-600">Increase text size for better readability</p>
                </div>
                <Switch
                  checked={accessibility.largeText}
                  onCheckedChange={(checked) => setAccessibility({ ...accessibility, largeText: checked })}
                />
              </div>

              {/* Focus Indicators */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enhanced Focus Indicators</Label>
                  <p className="text-sm text-gray-600">Stronger visual focus indicators</p>
                </div>
                <Switch
                  checked={accessibility.focusIndicators}
                  onCheckedChange={(checked) => setAccessibility({ ...accessibility, focusIndicators: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Interaction & Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enhanced Keyboard Navigation</Label>
                  <p className="text-sm text-gray-600">Improved keyboard shortcuts and navigation</p>
                </div>
                <Switch
                  checked={accessibility.keyboardNavigation}
                  onCheckedChange={(checked) => setAccessibility({ ...accessibility, keyboardNavigation: checked })}
                />
              </div>

              {/* Screen Reader */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Screen Reader Optimization</Label>
                  <p className="text-sm text-gray-600">Enhanced compatibility with screen readers</p>
                </div>
                <Switch
                  checked={accessibility.screenReader}
                  onCheckedChange={(checked) => setAccessibility({ ...accessibility, screenReader: checked })}
                />
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-gray-600">Audio feedback for actions and notifications</p>
                </div>
                <div className="flex items-center space-x-2">
                  {accessibility.soundEffects ? (
                    <Volume2 className="w-4 h-4 text-blue-600" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                  <Switch
                    checked={accessibility.soundEffects}
                    onCheckedChange={(checked) => setAccessibility({ ...accessibility, soundEffects: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preview */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>See how your customizations look in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: theme.primaryColor }}>
                  Sample Dashboard Widget
                </h3>
                <Badge style={{ backgroundColor: theme.accentColor, color: "white" }}>New Feature</Badge>
              </div>

              <p className="text-gray-600" style={{ fontSize: `${theme.fontSize}px` }}>
                This is how your content will appear with the current theme settings. The colors, typography, and
                spacing will be applied throughout the application.
              </p>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  style={{
                    backgroundColor: theme.primaryColor,
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  Primary Action
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  style={{
                    borderColor: theme.accentColor,
                    color: theme.accentColor,
                    borderRadius: `${theme.borderRadius}px`,
                  }}
                >
                  Secondary Action
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
