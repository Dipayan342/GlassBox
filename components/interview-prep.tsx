"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Clock, Target, Play, Pause, RotateCcw, Lightbulb, Star, RefreshCw, Loader2 } from "lucide-react"
import { generateInterviewQuestions } from "@/app/actions/generate-interview-questions"

import { analyzeInterviewAnswer } from "@/app/actions/analyzeInterviewAnswer";
interface InterviewPrepProps {
  jobRole?: string
  skills?: string[]
  experienceLevel?: string
  isPremium?: boolean
  onUpgrade?: () => void
}

interface InterviewQuestion {
  category: string
  question: string
  difficulty: "Easy" | "Medium" | "Hard"
  tips: string
  timeLimit: number
  followUp?: string
}

interface InterviewFeedback {
  score: number;
  feedback: string;
  areasForImprovement: string[];
  suggestedAnswer: string;
}

export function InterviewPrep({
  jobRole = "Software Developer",
  skills = [],
  experienceLevel = "mid-level",
  isPremium = false,
  onUpgrade,
}: InterviewPrepProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timerActive, setTimerActive] = useState(false)

  // Generate questions when component mounts or job profile changes
  useEffect(() => {
    if (isPremium && jobRole && skills.length > 0) {
      generateQuestions()
    }
  }, [jobRole, skills, experienceLevel, isPremium])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setTimerActive(false)
      setIsRecording(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const generateQuestions = async () => {
    setIsGenerating(true)
    try {
      const questions = await generateInterviewQuestions({
        jobRole,
        skills,
        experienceLevel,
      })
      setInterviewQuestions(questions)
      setCurrentQuestion(0)
      setTimeLeft(questions[0]?.timeLimit || 300)
      setAnswers(new Array(questions.length).fill(""))
    } catch (error) {
      console.error("Failed to generate questions:", error)
      // Fallback to default questions
      setInterviewQuestions(getDefaultQuestions())
    } finally {
      setIsGenerating(false)
    }
  }

  const getDefaultQuestions = (): InterviewQuestion[] => [
    {
      category: "Technical",
      question: `How would you approach building a scalable ${jobRole.toLowerCase()} application?`,
      difficulty: "Medium",
      tips: "Focus on architecture, scalability patterns, and technology choices.",
      timeLimit: 300,
    },
    {
      category: "Behavioral",
      question: "Tell me about a challenging project you worked on and how you overcame obstacles.",
      difficulty: "Easy",
      tips: "Use the STAR method: Situation, Task, Action, Result.",
      timeLimit: 180,
    },
    {
      category: "Problem Solving",
      question: `Describe how you would debug a performance issue in a ${skills[0] || "web"} application.`,
      difficulty: "Hard",
      tips: "Mention specific tools, methodologies, and systematic approaches.",
      timeLimit: 420,
    },
    {
      category: "Experience",
      question: `What's the most complex ${skills[1] || "technical"} challenge you've solved?`,
      difficulty: "Medium",
      tips: "Highlight your problem-solving process and technical depth.",
      timeLimit: 240,
    },
  ]

  const handleStartRecording = () => {
    setIsRecording(true)
    setTimerActive(true)
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    setTimerActive(false)
    await analyzeCurrentAnswer();
  }

  const analyzeCurrentAnswer = async () => {
    const currentAnswer = answers[currentQuestion];
    const currentQ = interviewQuestions[currentQuestion];

    if (!currentAnswer || !currentQ) return;

    setIsAnalyzing(true);
    setFeedback(null); // Clear previous feedback
    try {
      const result = await analyzeInterviewAnswer({
        question: currentQ.question,
        answer: currentAnswer,
        jobRole: jobRole!,
        skills: skills!,
        experienceLevel: experienceLevel!,
      });
      setFeedback(result);
    } catch (error) {
      console.error("Failed to analyze answer:", error);
      setFeedback(null); // Indicate analysis failed
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextQuestion = async () => {
    await analyzeCurrentAnswer(); // Analyze before moving
    if (currentQuestion < interviewQuestions.length - 1) {
      const nextIndex = currentQuestion + 1
      setCurrentQuestion(nextIndex)
      setTimeLeft(interviewQuestions[nextIndex].timeLimit)
      setTimerActive(false)
      setIsRecording(false)
      setFeedback(null); // Clear feedback for the new question
    }
  }

  const handlePreviousQuestion = async () => {
    await analyzeCurrentAnswer(); // Analyze before moving
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1
      setCurrentQuestion(prevIndex)
      setTimeLeft(interviewQuestions[prevIndex].timeLimit)
      setTimerActive(false)
      setIsRecording(false)
    }
    setFeedback(null); // Clear feedback for the new question
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft <= 30) return "text-red-600"
    if (timeLeft <= 60) return "text-yellow-600"
    return "text-blue-600"
  }

  if (!isPremium) {
    return (
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Interview Preparation
          </CardTitle>
          <CardDescription>Practice with AI-powered interview questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-4">
              Get personalized interview questions based on your target role and skills
            </p>
            <Button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isGenerating) {
    return (
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Generating Personalized Questions</h3>
            <p className="text-gray-600">AI is creating interview questions tailored to your {jobRole} profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (interviewQuestions.length === 0) {
    return (
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Interview Preparation
          </CardTitle>
          <CardDescription>Generate AI-powered questions for your job profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Practice?</h3>
            <p className="text-gray-600 mb-4">Generate personalized interview questions for {jobRole} position</p>
            <Button onClick={generateQuestions} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQ = interviewQuestions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Interview Session Header */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Interview Practice Session
              </CardTitle>
              <CardDescription>
                Practicing for: <span className="font-medium text-blue-600">{jobRole}</span> • Question{" "}
                {currentQuestion + 1} of {interviewQuestions.length}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={`${getTimeColor()} border-current`}>
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
              <Button variant="outline" size="sm" onClick={generateQuestions} disabled={isGenerating}>
                <RefreshCw className="w-3 h-3 mr-1" />
                New Questions
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Job Profile Summary */}
      <Card className="border-0 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2 text-blue-900">Your Profile</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="secondary">{experienceLevel}</Badge>
            {skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-blue-700 border-blue-300">
                {skill}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-blue-700">
            Questions are tailored to your {experienceLevel} {jobRole} profile with {skills.length} identified skills.
          </p>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{currentQ.category}</Badge>
                <Badge
                  className={
                    currentQ.difficulty === "Easy"
                      ? "bg-green-100 text-green-800"
                      : currentQ.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {currentQ.difficulty}
                </Badge>
                <Badge variant="outline">{Math.floor(currentQ.timeLimit / 60)} min</Badge>
              </div>
              <CardTitle className="text-lg leading-relaxed">{currentQ.question}</CardTitle>
              {currentQ.followUp && <p className="text-sm text-gray-600 mt-2 italic">Follow-up: {currentQ.followUp}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Interview Tip</h4>
                <p className="text-sm text-blue-700">{currentQ.tips}</p>
              </div>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`${
                isRecording ? "bg-red-600 hover:bg-red-700" : "bg-gradient-to-r from-blue-600 to-purple-600"
              }`}
              size="lg"
            >
              {isRecording ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setTimeLeft(currentQ.timeLimit)
                setTimerActive(false)
                setIsRecording(false)
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Timer
            </Button>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type your answer here or use voice recording above..."
              value={answers[currentQuestion] || ""}
              onChange={(e) => {
                const newAnswers = [...answers]
                newAnswers[currentQuestion] = e.target.value
                setAnswers(newAnswers)
              }}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Button variant="outline" disabled={currentQuestion === 0} onClick={handlePreviousQuestion}>
              Previous Question
            </Button>

            <div className="flex space-x-2">
              {interviewQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer ${
                    index === currentQuestion ? "bg-blue-600" : answers[index] ? "bg-green-500" : "bg-gray-300"
                  }`}
                  onClick={() => {
                    setCurrentQuestion(index)
                    setTimeLeft(interviewQuestions[index].timeLimit)
                    setTimerActive(false)
                    setIsRecording(false)
                  }}
                />
              ))}
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestion === interviewQuestions.length - 1}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {currentQuestion === interviewQuestions.length - 1 ? "Finish Session" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Feedback (Premium Feature) */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            AI Feedback & Scoring
          </CardTitle>
          <CardDescription>Real-time analysis based on your {jobRole} requirements</CardDescription>
        </CardHeader>
        <CardContent>
 {isAnalyzing ? (
 <div className="text-center">
 <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
 <p className="text-gray-600">Analyzing your answer...</p>
 </div>
 ) : feedback ? (
 <>
 <div className="grid md:grid-cols-3 gap-4">
 {/* Display score - You might need to refine how score translates to categories */}
 <div className="text-center">
 <div className="text-2xl font-bold text-blue-600 mb-1">{feedback.score}%</div>
 <p className="text-sm text-gray-600">Overall Score</p>
 </div>
 {/* Add more score categories if your AI provides them */}
 <div className="text-center">
 <div className="text-2xl font-bold text-green-600 mb-1">N/A</div> {/* Placeholder */}
 <p className="text-sm text-gray-600">Communication</p>
 </div>
 <div className="text-center">
 <div className="text-2xl font-bold text-yellow-600 mb-1">N/A</div> {/* Placeholder */}
 <p className="text-sm text-gray-600">Role Alignment</p>
 </div>
 </div>

 <div className="mt-4 p-4 bg-gray-50 rounded-lg">
 <h4 className="font-medium mb-2">AI Feedback:</h4>
 <p className="text-sm text-gray-700 mb-3">{feedback.feedback}</p>

            <h4 className="font-medium mb-2">Areas for Improvement:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
 {feedback.areasForImprovement.map((area, index) => (
 <li key={index}>• {area}</li>
 ))}
            </ul>
            </div>
 </>
 ) : (
 <div className="text-center text-gray-600 py-4">
              Analyze your answer to see AI feedback and scoring.
 </div>
 )}
        </CardContent>
      </Card>

      {/* Question Overview */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {interviewQuestions.map((q, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  index === currentQuestion
                    ? "border-blue-500 bg-blue-50"
                    : answers[index]
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setCurrentQuestion(index)
                  setTimeLeft(q.timeLimit)
                  setTimerActive(false)
                  setIsRecording(false)
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <Badge variant="outline" className="text-xs">
                    {q.category}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      q.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : q.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {q.difficulty}
                  </Badge>
                </div>
                <p className="text-sm font-medium line-clamp-2">{q.question}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{Math.floor(q.timeLimit / 60)} min</span>
                  {answers[index] && <Badge className="text-xs bg-green-500">Answered</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
