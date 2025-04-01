import express from "express";
import cors from "cors";
import geminiService from "./services/gemini.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend server is running!" });
});

// Chat route with Gemini API integration
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: true,
        response: "Prompt is required",
      });
    }

    console.log("\n--- New Chat Request ---");
    console.log("Prompt:", prompt);

    const result = await geminiService.generateResponse(prompt);
    console.log("Gemini Service Result:", result);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("Chat endpoint error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      error: true,
      response: `Server error: ${error.message}`,
    });
  }
});

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    server = app.listen(PORT, () => {
      console.log("\n=== Server Configuration ===");
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log("API Key configured:", !!process.env.GEMINI_API_KEY);
      console.log("=========================\n");
    });

    server.on("error", (error) => {
      console.error("\n=== Server Error ===");
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      console.error("Stack Trace:", error.stack);
      console.error("==================\n");

      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM");
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("\nShutting down server");
  process.exit(0);
});

startServer().catch((error) => {
  console.error("Startup error:", error);
  process.exit(1);
});
