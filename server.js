import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3e3;
app.use(express.json({ limit: "10mb" }));
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set. Please configure it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== "string" || notes.trim().length === 0) {
      return res.status(400).json({ error: "Please provide study notes to generate a quiz." });
    }
    const ai = getGenAI();
    const systemInstruction = `You are an expert educator and quiz creator.
Generate exactly three multiple-choice questions from the supplied study notes.
Requirements:
1. Number the questions 1, 2, and 3.
2. Give each question exactly four options labelled A, B, C, and D.
3. Ensure each question has exactly one undeniably correct answer based strictly on the supplied material.
4. Present all three questions without revealing which option is correct or providing explanations.
5. In instructionsPrompt, ask the student to submit answers using question numbers and option labels, such as 1B, 2D, 3A.
6. Return only the questions and options for student assessment.`;
    const prompt = `Study Material:
"""
${notes.trim()}
"""

Generate three multiple-choice questions strictly from this material with four options (A, B, C, D) each. Do not reveal answers or explanations.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            instructionsPrompt: {
              type: Type.STRING,
              description: "Instruction text asking the student to submit answers using question numbers and option labels, such as 1B, 2D, 3A."
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: {
                    type: Type.INTEGER,
                    description: "Question number (1, 2, or 3)"
                  },
                  question: {
                    type: Type.STRING,
                    description: "The question text"
                  },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: {
                          type: Type.STRING,
                          description: "Option label: A, B, C, or D"
                        },
                        text: {
                          type: Type.STRING,
                          description: "The option description/content"
                        }
                      },
                      required: ["label", "text"]
                    },
                    description: "Exactly 4 options: A, B, C, and D"
                  }
                },
                required: ["id", "question", "options"]
              },
              description: "Exactly 3 multiple-choice questions"
            }
          },
          required: ["instructionsPrompt", "questions"]
        }
      }
    });
    const text = response.text;
    if (!text) {
      throw new Error("No content returned from Gemini model.");
    }
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate quiz. Please verify your study notes or API key."
    });
  }
});
app.post("/api/quiz/grade", async (req, res) => {
  try {
    const { notes, questions, studentAnswers, submissionString } = req.body;
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Quiz questions are required for grading." });
    }
    const ai = getGenAI();
    const systemInstruction = `You are an educational quiz grader.
Your instructions:
1. Assess the student's submitted answers against the questions and the supplied study material.
2. Report a score out of three and identify whether each answer is correct or incorrect.
3. For each incorrect answer, give the correct option (e.g. "B") and a brief explanation of why that option is correct and why the student's choice was incorrect.
4. For correct answers, provide a brief positive affirmation/explanation reinforcing why it is correct.
5. If any answer is missing or its question number is unclear, set needsClarification to true, specify the clarificationMessage asking the student for clarification, and mark that question's clarity.
6. Avoid generating another quiz unless the student explicitly requests one.`;
    const promptPayload = {
      suppliedMaterial: notes || "Provided in questions context",
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options.map((opt) => `${opt.label}: ${opt.text}`)
      })),
      studentSubmissionString: submissionString || "",
      studentAnswersMap: studentAnswers || {}
    };
    const prompt = `Grade the student's quiz submission based on the supplied material and questions:

${JSON.stringify(
      promptPayload,
      null,
      2
    )}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "The number of correct answers (out of 3)"
            },
            total: {
              type: Type.INTEGER,
              description: "Total number of questions (should be 3)"
            },
            summary: {
              type: Type.STRING,
              description: "Overall feedback summary for the student"
            },
            needsClarification: {
              type: Type.BOOLEAN,
              description: "True if an answer was missing, invalid, or unclear"
            },
            clarificationMessage: {
              type: Type.STRING,
              description: "Clarification request if an answer is missing or unclear"
            },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: {
                    type: Type.INTEGER,
                    description: "Question number (1, 2, or 3)"
                  },
                  studentAnswer: {
                    type: Type.STRING,
                    description: 'The option label chosen by student (e.g. A, B, C, D or "Unanswered")'
                  },
                  isCorrect: {
                    type: Type.BOOLEAN,
                    description: "Whether the student answered correctly"
                  },
                  correctOption: {
                    type: Type.STRING,
                    description: "The correct option label (A, B, C, or D)"
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Brief explanation. For incorrect answers, explain why the correct option is right."
                  }
                },
                required: ["questionId", "studentAnswer", "isCorrect", "correctOption", "explanation"]
              },
              description: "Grading breakdown for each question"
            }
          },
          required: ["score", "total", "summary", "needsClarification", "results"]
        }
      }
    });
    const text = response.text;
    if (!text) {
      throw new Error("No content returned from Gemini grader.");
    }
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error) {
    console.error("Quiz Grading Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to grade quiz answers. Please try again."
    });
  }
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
