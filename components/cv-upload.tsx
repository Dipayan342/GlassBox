"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Loader2, Download, CheckCircle, AlertCircle } from "lucide-react"
import { analyzeCV, type CVAnalysisResult } from "@/app/actions/analyze-cv"
import { isAIEnabled } from "@/lib/config"

interface CVUploadProps {
  onAnalysisComplete: (result: CVAnalysisResult) => void
}

export function CVUpload({ onAnalysisComplete }: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisStatus, setAnalysisStatus] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
      setAnalysisStatus("")
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]

    if (droppedFile) {
      if (droppedFile.type !== "application/pdf") {
        setError("Please upload a PDF file")
        return
      }
      setFile(droppedFile)
      setError(null)
      setAnalysisStatus("")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    setIsUploading(true)
    setError(null)
    setAnalysisStatus("Extracting text from PDF...")

    try {
      const formData = new FormData()
      formData.append("cv", file)

      setAnalysisStatus("Analyzing CV with AI...")
      const result = await analyzeCV(formData)

      setAnalysisStatus("Analysis complete!")
      setTimeout(() => {
        onAnalysisComplete(result)
      }, 500)
    } catch (err) {
      setError("Failed to analyze CV. Please try again.")
      setAnalysisStatus("")
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Function to create and download sample CV files
  const downloadSampleCV = (type: "junior" | "mid" | "senior") => {
    const content = `Sample ${type} level CV - ${type}.pdf`
    const blob = new Blob([content], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sample-cv-${type}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          {isAIEnabled ? (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-700 font-medium">AI Analysis Enabled</span>
              </div>
              <p className="text-xs text-green-600 mt-1">Your CV will be analyzed using advanced AI technology</p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-700 font-medium">Demo Mode</span>
              </div>
              <p className="text-xs text-yellow-600 mt-1">Using sample analysis data for demonstration</p>
            </div>
          )}

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">{file.name}</h3>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>

                {analysisStatus && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">{analysisStatus}</span>
                  </div>
                )}

                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze CV"
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setFile(null)} disabled={isUploading}>
                    Change File
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload your CV</h3>
                <p className="text-gray-600 mb-4">Drag and drop your PDF file here, or click to browse</p>
                <Button onClick={triggerFileInput} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Choose File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
              </>
            )}
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample CV Downloads */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Don't have a CV? Try our samples:</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadSampleCV("junior")}
              className="flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Junior Level CV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadSampleCV("mid")}
              className="flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Mid Level CV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadSampleCV("senior")}
              className="flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Senior Level CV</span>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Download a sample CV to test the analysis feature</p>
        </CardContent>
      </Card>
    </div>
  )
}
