import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";
import { connectDB } from "./config/db.js";
import SymptomHistory from "./models/SymptomHistory.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Symptom check route
app.post("/api/symptom-check", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) return res.status(400).json({ error: "Symptoms are required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
You are an AI healthcare assistant. The user has the following symptoms: ${symptoms}.
Respond in JSON format with:
{
  "diagnosis": "...",
  "advice": "...",
  "severity": "...",
  "emergency": true/false
}
`;

    const result = await model.generateContent(prompt);
    let text = await result.response.text();
    text = text.replace(/```json\s*([\s\S]*?)```/, "$1").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text, error: "Failed to parse JSON" };
    }

    // Save in MongoDB
    const newEntry = await SymptomHistory.create({
      symptoms,
      diagnosis: parsed.diagnosis || "Unknown",
      advice: parsed.advice || "No advice",
      severity: parsed.severity || "Unknown",
      emergency: parsed.emergency || false,
    });

    res.json(newEntry); // return the saved entry
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong.", details: error.message });
  }
});

// ✅ Get symptom history
app.get("/api/history", async (req, res) => {
  try {
    const history = await SymptomHistory.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ✅ Delete a history item by ID
app.delete("/api/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SymptomHistory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "History not found" });
    res.json({ message: "History deleted successfully" });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ error: "Failed to delete history" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});