import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with telemetric user-agent as per SKILL.md rules
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Ensure we have a valid key before using Gemini
function isGeminiEnabled() {
  return !!process.env.GEMINI_API_KEY;
}

// REST API endpoint: Parse natural language task info or quick-capture text
app.post("/api/ai/parse-task", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!isGeminiEnabled()) {
    // Elegant fallback mock if API key isn't set yet during development config
    const lower = prompt.toLowerCase();
    const defaults = {
      title: prompt,
      time: "12:00 PM",
      energy: "Deep Focus",
      category: "Personal",
      subtasks: ["Review details", "Draft initial plan"],
      smartSuggestion: "Parsed offline. Enable Gemini API in Settings > Secrets for instant intelligent planning."
    };

    if (lower.includes("mark")) {
      defaults.title = "Call Mark";
      defaults.time = "2:00 PM";
      defaults.energy = "High Energy";
      defaults.category = "Work";
      defaults.subtasks = ["Review Q3 requirements", "Confirm next demo date", "Update meeting logs"];
    } else if (lower.includes("grocery") || lower.includes("groceries")) {
      defaults.title = "Pick up groceries";
      defaults.time = "6:30 PM";
      defaults.energy = "Low Energy";
      defaults.category = "Personal";
      defaults.subtasks = ["Get almond milk", "Buy avocados & spinach", "Fetch whole grain bread"];
    } else if (lower.includes("portfolio")) {
      defaults.title = "Update portfolio website";
      defaults.time = "4:00 PM";
      defaults.energy = "Deep Focus";
      defaults.category = "Side Hustle";
      defaults.subtasks = ["Select best 3 recent works", "Refine typography header", "Prune legacy projects"];
    }

    return res.json(defaults);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Parse the following natural language productivity quick-capture text into a high-fidelity task object suitable for our mindful productivity OS.
Input text: "${prompt}"

Provide:
1. An elegant, clean task title.
2. A suggested time or time framework (e.g., "2:00 PM", "All day", "Morning", "6:00 PM").
3. Appropriate Energy Level choice ("Low Energy", "Deep Focus", or "High Energy").
4. A productivity category ("Work", "Personal", "Side Hustle", or "Learning").
5. A list of 2 to 4 detailed subtasks/steps required to complete this task.
6. A short smart suggestion caption (1-2 sentences) about how this fits well into their daily routine or energy levels.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A refined title for the task." },
            time: { type: Type.STRING, description: "Suggested or parsed clock time, e.g. '2:00 PM'." },
            energy: { 
              type: Type.STRING, 
              description: "The energy required for the task.",
              enum: ["Low Energy", "Deep Focus", "High Energy"]
            },
            category: { 
              type: Type.STRING, 
              description: "The core category of work.", 
              enum: ["Work", "Personal", "Side Hustle", "Learning"]
            },
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 4 actionable subtasks required to build maximum focus momentum."
            },
            smartSuggestion: { 
              type: Type.STRING, 
              description: "A tailored, mindful productivity recommendation sentence." 
            }
          },
          required: ["title", "time", "energy", "category", "subtasks", "smartSuggestion"]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Quick Capture Error:", error);
    res.status(500).json({ error: "Failed to parse task using Gemini", detail: error.message });
  }
});

// REST API endpoint: Dynamic Mindful AI Coach recommendation
app.post("/api/ai/coach", async (req, res) => {
  const { currentTasks, contextMode, energyLevel, customPrompt } = req.body;

  if (!isGeminiEnabled()) {
    // Seamless fallback mock for offline/non-configured API states
    let advice = "Your energy modes and context modes are beautifully aligned. Remember to integrate the Pomodoro schedule today: 50 minutes of pure focus, followed by a 10-minute visual break. Stepping away from the blue light resets cognitive overload.";
    if (energyLevel === "Deep Focus") {
      advice = "Deep Focus detected. This is a supreme cognitive window. Silence notifications, close redundant browser channels, and dive straight into your Q3 Roadmap or creative writing. Protect this hour with clear visual boundaries.";
    } else if (energyLevel === "Low Energy") {
      advice = "Low energy levels registered. It is wise to run your administrative 'busywork' stack now. Log receipts, schedule trivial replies, or clean your physical workspace. Protect your creative mind from fatigue.";
    }

    if (customPrompt) {
      advice = `[Offline Mode] You asked about "${customPrompt}". Register your free Gemini API key in AI Studio settings to unlock high-fidelity live conversational advice!`;
    }

    return res.json({
      message: advice,
      productivityScoreSuggestion: 87,
      isOffline: true
    });
  }

  try {
    const formattedTasks = Array.isArray(currentTasks) 
      ? currentTasks.map(t => `- [${t.completed ? "x" : " "}] ${t.title} (${t.category}, ${t.energy})`).join("\n")
      : "No tasks captured yet";

    const systemPrompt = `You are "Vinai AI Coach", a warm, mindful, elite productivity guide built directly into Vinai — a mindful productivity operating system. 
You follow a style inspired by Apple's Human Interface philosophy: clear, respectful, jargon-free, deeply helpful, and prioritizing mental clarity and work-life balance.
You speak directly, avoiding robotic preambles. Focus on helping the user succeed while defending them against cognitive fatigue and burnout. Keep your answers concise, impactful, and elegant (around 2 to 3 sentences maximum, or a very brief bulleted insight).`;

    const userPrompt = customPrompt 
      ? `The user has sent a specific query/command: "${customPrompt}"
      
Current environment context:
- Today's energy state selection: ${energyLevel || "Deep Focus"}
- User context location detected: ${contextMode || "Office"}
- Current list of tasks:
${formattedTasks}`
      : `Provide Alex with a personalized daily focus recommendation based on their active environment settings.
Current state:
- Today's selected energy state: ${energyLevel || "Deep Focus"}
- Context location: ${contextMode || "Office"}
- Loaded Tasks for Today:
${formattedTasks}

Formulate a concise, beautifully poised mindful encouragement or strategy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8
      }
    });

    const parsedText = response.text || "";
    // Calculate a dynamic productivity score based on count of completed tasks
    const completedCount = Array.isArray(currentTasks) ? currentTasks.filter(t => t.completed).length : 0;
    const totalCount = Array.isArray(currentTasks) ? currentTasks.length : 0;
    const score = totalCount > 0 ? Math.round(75 + (completedCount / totalCount) * 20) : 87;

    return res.json({
      message: parsedText.trim(),
      productivityScoreSuggestion: score,
      isOffline: false
    });
  } catch (error: any) {
    console.error("AI Coach recommendation error:", error);
    res.status(500).json({ error: "Failed to query AI Coach", detail: error.message });
  }
});

// REST API endpoint: AI Reschedule Suggestions
app.get("/api/ai/reschedule-suggestions", async (req, res) => {
  if (!isGeminiEnabled()) {
    // Premium instant static responses
    return res.json([
      {
        id: "r1",
        title: "Review Q3 Revenue Projections",
        previousDate: "Yesterday",
        category: "Work",
        smartSuggestion: "Reschedule to 1:00 PM. Directly aligns with your upcoming Deep Focus window.",
        energy: "Deep Focus"
      },
      {
        id: "r2",
        title: "Send Invoice to Delta Studio",
        previousDate: "Yesterday",
        category: "Work",
        smartSuggestion: "Reschedule to 5:00 PM. Perfect low-energy admin tasks to wrap up the work window.",
        energy: "Low Energy"
      }
    ]);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide exactly two premium, creative rescheduling suggestion items for a premium productivity OS. 
These represent outstanding items from yesterday that overdue and need priority today. 
Each item must contain:
1. title (something realistic like 'Review Q3 Revenue Projections' or 'Update legal agreements')
2. previousDate (always set this to 'Yesterday')
3. category ('Work', 'Personal', 'Side Hustle', 'Learning')
4. energy ('Low Energy', 'Deep Focus', 'High Energy')
5. smartSuggestion (a tailored 1-sentence explanation of why rescheduling this to today or tomorrow makes mindful sense, e.g., 'Aligns with your morning high energy level' or 'Perfect low-intensity wind-down task').`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              previousDate: { type: Type.STRING },
              category: { type: Type.STRING },
              energy: { type: Type.STRING },
              smartSuggestion: { type: Type.STRING }
            },
            required: ["title", "previousDate", "category", "energy", "smartSuggestion"]
          }
        }
      }
    });

    const parsedArray = JSON.parse(response.text.trim());
    // Ensure IDs exist
    const finalData = parsedArray.map((item: any, idx: number) => ({
      id: item.id || `r-${idx}`,
      title: item.title,
      previousDate: item.previousDate || "Yesterday",
      category: item.category || "Work",
      energy: item.energy || "Deep Focus",
      smartSuggestion: item.smartSuggestion
    }));

    return res.json(finalData);
  } catch (error) {
    console.error("AI Reschedule Suggestion Error:", error);
    // Graceful fallback
    return res.json([
      {
        id: "r1",
        title: "Review Q3 Revenue Projections",
        previousDate: "Yesterday",
        category: "Work",
        smartSuggestion: "Reschedule to 1:00 PM. Directly aligns with your upcoming Deep Focus energy score.",
        energy: "Deep Focus"
      },
      {
        id: "r2",
        title: "Send Invoice to Delta Studio",
        previousDate: "Yesterday",
        category: "Work",
        smartSuggestion: "Reschedule to 5:00 PM. Perfect low-energy checklist item to finish the workday gently.",
        energy: "Low Energy"
      }
    ]);
  }
});

async function startServer() {
  // Vite middleware integrational route setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Listen to incoming connections on custom container port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Vinai OS Gateway] Server booting up dynamically at http://0.0.0.0:${PORT}`);
  });
}

startServer();
