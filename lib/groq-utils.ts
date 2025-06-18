import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import type { GroqModel } from "./config"

export async function generateTextWithFallback(prompt: string): Promise<string> {
  const modelsToTry: GroqModel[] = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ]

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`)
      const { text } = await generateText({
        model: groq(modelName),
        prompt,
        temperature: 0.1, // Lower temperature for more consistent JSON output
        maxTokens: 2000,
      })
      console.log(`Success with model: ${modelName}`)
      return text
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error)
      // Continue to next model
    }
  }

  throw new Error("All Groq models failed")
}
