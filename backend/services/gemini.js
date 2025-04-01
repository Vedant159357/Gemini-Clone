import fetch from "node-fetch";
import dotenv from "dotenv";
import { join } from "path";
import fs from "fs";

// Load environment variables
const envPath = join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  throw new Error(`.env file not found at ${envPath}`);
}
dotenv.config({ path: envPath });

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }
    // Using the endpoint from the curl example
    this.apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  }

  async generateResponse(prompt) {
    try {
      console.log("\n=== Gemini API Request ===");
      console.log("Prompt:", prompt);

      // Using exact format from the curl example
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      };

      // Include API key in URL query parameter
      const url = `${this.apiUrl}?key=${this.apiKey}`;
      console.log("Request URL:", url);
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("\n=== Gemini API Response ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);

      // Get response as text first to handle potential JSON parse errors
      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${responseText}`);
      }

      // Parse the response text as JSON
      const data = JSON.parse(responseText);
      console.log("Parsed Response:", JSON.stringify(data, null, 2));

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response format from Gemini API");
      }

      const result = {
        response: data.candidates[0].content.parts[0].text,
        error: false,
      };

      console.log("Final Result:", result);
      console.log("=========================\n");

      return result;
    } catch (error) {
      console.error("\n=== Gemini API Error ===");
      console.error("Error Name:", error.name);
      console.error("Error Message:", error.message);
      console.error("Stack Trace:", error.stack);
      console.error("======================\n");

      return {
        response: `API Error: ${error.message}`,
        error: true,
      };
    }
  }
}

export default new GeminiService();
