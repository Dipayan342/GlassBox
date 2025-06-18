"use server"

import pdf from 'pdf-parse';
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Simple PDF text extraction approach
    // In a production environment, you'd use a library like pdf-parse or pdf2pic
    // For now, we'll simulate extraction but with more realistic handling

    const data = await pdf(Buffer.from(uint8Array));
 return data.text;
  } catch (error) {
    console.error("PDF extraction failed:", error)
    throw new Error("Failed to extract text from PDF")
  }
}