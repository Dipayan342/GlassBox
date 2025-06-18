"use server";

import { generateTextWithFallback } from "@/lib/groq-utils";

interface AnalyzeAnswerRequest {
  question: string;
  answer: string;
  jobRole: string;
  skills: string[];
  experienceLevel: string;
}

interface InterviewFeedback {
  score: number;
  feedback: string;
  areasForImprovement: string[];
  suggestedAnswer: string;
}

function cleanAndParseJSON(text: string): any {
  let cleanedText = text.trim();

  // Remove markdown code blocks if present
  if (cleanedText.startsWith("json")) { cleanedText = cleanedText.replace(/^json\s*/, "");
  }
  if (cleanedText.startsWith("")) { cleanedText = cleanedText.replace(/^\s*/, "");
  }
  if (cleanedText.endsWith("")) { cleanedText = cleanedText.replace(/\s*$/, "");
  }

  // Remove any leading/trailing whitespace
  cleanedText = cleanedText.trim();

  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("JSON parsing failed:", error);
    console.log("Cleaned text:", cleanedText);
    throw error;
  }
}

export async function analyzeInterviewAnswer({
  question,
  answer,
  jobRole,
  skills,
  experienceLevel,
}: AnalyzeAnswerRequest): Promise<InterviewFeedback | null> {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not found, skipping AI answer analysis.");
      return null; // Or return a default/placeholder feedback structure
    }

    const prompt = `
      You are an expert interviewer. Analyze the following candidate's answer to an interview question for a ${experienceLevel} ${jobRole} position.

      Candidate Profile:
      - Role: ${jobRole}
      - Experience Level: ${experienceLevel}
      - Key Skills: ${skills.join(", ")}

      Interview Question:
      "${question}"

      Candidate's Answer:
      "${answer}"

      Provide feedback on the answer's relevance, completeness, clarity, and technical accuracy based on the candidate's profile and the question asked. Suggest specific areas for improvement and provide a concise suggested better answer.

      Return ONLY a JSON object with this exact structure:

      {
        "score": 0-100 score representing overall effectiveness,
        "feedback": "Overall summary of the answer's strengths and weaknesses.",
        "areasForImprovement": ["list of specific areas to improve"],
        "suggestedAnswer": "A concise, suggested better answer."
      }

      Ensure the score is an integer between 0 and 100.
      Make the feedback and suggestions specific and actionable.
    `;

    const text = await generateTextWithFallback(prompt);
    console.log("Raw AI Answer Analysis response:", text);

    const feedback = cleanAndParseJSON(text) as InterviewFeedback;

    // Basic validation of the response structure
    if (
      typeof feedback.score !== "number" ||
      typeof feedback.feedback !== "string" ||
      !Array.isArray(feedback.areasForImprovement) ||
      typeof feedback.suggestedAnswer !== "string"
    ) {
      console.warn("Invalid AI feedback format received.");
      // Return a default or indicate failure
      return null;
    }

    // Ensure score is within valid range
    feedback.score = Math.max(0, Math.min(100, Math.round(feedback.score)));


    console.log("AI Answer Analysis successful:", feedback);
    return feedback;

  } catch (error) {
    console.error("Interview answer analysis failed:", error);
    // Depending on desired behavior, re-throw or return null/default feedback
    return null;
  }
}