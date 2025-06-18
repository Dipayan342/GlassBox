"use server"

import { generateTextWithFallback } from "@/lib/groq-utils"

interface QuestionRequest {
  jobRole: string
  skills: string[]
  experienceLevel: string
}

interface InterviewQuestion {
  category: string
  question: string
  difficulty: "Easy" | "Medium" | "Hard"
  tips: string
  timeLimit: number
  followUp?: string
}

function cleanAndParseJSON(text: string): any {
  let cleanedText = text.trim()

  // Remove markdown code blocks if present
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.replace(/^```json\s*/, "")
  }
  if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.replace(/^```\s*/, "")
  }
  if (cleanedText.endsWith("```")) {
    cleanedText = cleanedText.replace(/\s*```$/, "")
  }

  cleanedText = cleanedText.trim()

  try {
    return JSON.parse(cleanedText)
  } catch (error) {
    console.error("JSON parsing failed:", error)
    throw error
  }
}

export async function generateInterviewQuestions({
  jobRole,
  skills,
  experienceLevel,
}: QuestionRequest): Promise<InterviewQuestion[]> {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not found, using fallback questions")
      return getFallbackQuestions(jobRole, skills, experienceLevel)
    }

    const prompt = `
      You are an expert technical interviewer and HR professional. Generate 6 personalized interview questions for a ${experienceLevel} ${jobRole} position.

      Candidate Profile:
      - Role: ${jobRole}
      - Experience Level: ${experienceLevel}
      - Key Skills: ${skills.join(", ")}

      Generate questions that are:
      1. Specifically tailored to the ${jobRole} role
      2. Appropriate for ${experienceLevel} experience level
      3. Cover the candidate's skills: ${skills.slice(0, 5).join(", ")}
      4. Include a mix of technical, behavioral, and problem-solving questions
      5. Realistic and commonly asked in actual interviews

      Return ONLY a JSON array with this exact structure:
      [
        {
          "category": "Technical|Behavioral|Problem Solving|Experience|Leadership|System Design",
          "question": "Specific question tailored to the role and skills",
          "difficulty": "Easy|Medium|Hard",
          "tips": "Specific advice for answering this question well",
          "timeLimit": 180,
          "followUp": "Optional follow-up question"
        }
      ]

      Guidelines:
      - Make questions specific to ${jobRole} and ${skills[0] || "the primary skill"}
      - For ${experienceLevel} level, adjust complexity appropriately
      - Include real-world scenarios they might face in this role
      - Time limits: Easy (2-3 min), Medium (4-5 min), Hard (6-7 min)
      - Make tips actionable and specific to the question
      - Include follow-up questions for deeper technical questions

      Generate exactly 6 questions with good variety.
    `

    const text = await generateTextWithFallback(prompt)
    console.log("Raw AI response:", text)

    const questions = cleanAndParseJSON(text) as InterviewQuestion[]

    // Validate the response
    if (!Array.isArray(questions) || questions.length === 0) {
      console.warn("Invalid AI response format, using fallback")
      return getFallbackQuestions(jobRole, skills, experienceLevel)
    }

    // Ensure all questions have required fields
    const validQuestions = questions.filter((q) => q.question && q.category && q.difficulty && q.tips && q.timeLimit)

    if (validQuestions.length < 4) {
      console.warn("Not enough valid questions, using fallback")
      return getFallbackQuestions(jobRole, skills, experienceLevel)
    }

    console.log("Generated questions successfully:", validQuestions)
    return validQuestions.slice(0, 6) // Ensure max 6 questions
  } catch (error) {
    console.error("Question generation failed:", error)
    return getFallbackQuestions(jobRole, skills, experienceLevel)
  }
}

function getFallbackQuestions(jobRole: string, skills: string[], experienceLevel: string): InterviewQuestion[] {
  const primarySkill = skills[0] || "programming"
  const secondarySkill = skills[1] || "problem solving"

  const baseQuestions: InterviewQuestion[] = [
    {
      category: "Technical",
      question: `How would you design and implement a scalable ${primarySkill} solution for a high-traffic application?`,
      difficulty: experienceLevel === "entry-level" ? "Medium" : "Hard",
      tips: `Focus on architecture patterns, scalability considerations, and specific ${primarySkill} best practices. Mention performance optimization and monitoring.`,
      timeLimit: experienceLevel === "entry-level" ? 240 : 360,
      followUp: "What challenges might you face during implementation and how would you address them?",
    },
    {
      category: "Behavioral",
      question: `Tell me about a time when you had to learn ${secondarySkill} quickly to complete a project. How did you approach it?`,
      difficulty: "Easy",
      tips: "Use the STAR method (Situation, Task, Action, Result). Focus on your learning process and the impact of your quick adaptation.",
      timeLimit: 180,
    },
    {
      category: "Problem Solving",
      question: `Walk me through how you would debug a performance issue in a ${jobRole.toLowerCase()} application using ${primarySkill}.`,
      difficulty: "Medium",
      tips: "Describe a systematic approach: identify symptoms, use profiling tools, isolate the problem, implement solutions, and verify fixes.",
      timeLimit: 300,
      followUp: "What tools and metrics would you use to monitor performance ongoing?",
    },
    {
      category: "Experience",
      question: `Describe the most challenging ${jobRole.toLowerCase()} project you've worked on. What made it challenging and how did you overcome those challenges?`,
      difficulty: "Medium",
      tips: "Highlight technical complexity, team collaboration, and problem-solving skills. Quantify the impact of your contributions.",
      timeLimit: 240,
    },
    {
      category: "System Design",
      question: `How would you architect a system that needs to handle ${primarySkill} processing at scale? Consider both technical and operational aspects.`,
      difficulty: experienceLevel === "entry-level" ? "Hard" : "Medium",
      tips: "Discuss scalability patterns, data flow, technology choices, monitoring, and deployment strategies. Consider trade-offs.",
      timeLimit: 420,
      followUp: "How would you handle failure scenarios and ensure system reliability?",
    },
    {
      category: "Leadership",
      question:
        experienceLevel === "entry-level"
          ? `How do you stay updated with the latest ${primarySkill} trends and best practices?`
          : `How do you mentor junior developers and share knowledge about ${primarySkill} within your team?`,
      difficulty: experienceLevel === "entry-level" ? "Easy" : "Medium",
      tips:
        experienceLevel === "entry-level"
          ? "Mention specific resources, communities, and learning methods. Show passion for continuous learning."
          : "Discuss mentoring approaches, knowledge sharing practices, and how you help others grow technically.",
      timeLimit: 180,
    },
  ]

  // Adjust questions based on experience level
  if (experienceLevel === "entry-level") {
    baseQuestions[0].question = `Explain how you would approach building a ${primarySkill} application. What are the key considerations?`
    baseQuestions[0].difficulty = "Medium"
    baseQuestions[4].question = `Describe how you would structure a ${primarySkill} project for maintainability and scalability.`
  } else if (experienceLevel === "senior" || experienceLevel === "expert") {
    baseQuestions.push({
      category: "Leadership",
      question: `How do you make technical decisions and influence architecture choices in a ${jobRole} role?`,
      difficulty: "Hard",
      tips: "Discuss decision-making frameworks, stakeholder communication, and balancing technical debt with feature delivery.",
      timeLimit: 300,
    })
  }

  return baseQuestions.slice(0, 6)
}
