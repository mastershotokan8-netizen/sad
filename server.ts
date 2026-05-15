import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { OpenAI } from "openai";
import { ElevenLabsClient } from "elevenlabs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize ElevenLabs
const elevenLabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// API Routes
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, systemPrompt } = req.body;

    const messages = [
      { role: "system", content: systemPrompt || "You are a helpful assistant." },
      ...history,
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    res.json(JSON.parse(content || "{}"));
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceId = "21m00Tcm4TlvDq8ikWAM" } = req.body; // Default "Rachel" voice

    const audioStream = await elevenLabs.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
    });

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    res.set("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (error: any) {
    console.error("ElevenLabs Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
