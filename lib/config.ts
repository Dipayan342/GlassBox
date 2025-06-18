// Configuration for AI models
export const AI_CONFIG = {
  // Use the GROQ_API_KEY environment variable
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // Updated to current supported model
}

// Validate that we have the required API key
if (!AI_CONFIG.apiKey) {
  console.warn("GROQ_API_KEY not found. CV analysis will use fallback data.")
}

export const isAIEnabled = !!AI_CONFIG.apiKey

// List of available Groq models (as of current date)
export const AVAILABLE_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
] as const

export type GroqModel = (typeof AVAILABLE_MODELS)[number]
