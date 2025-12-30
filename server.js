import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": 'Bearer ${process.env.HF_API_KEY}',
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `
### Instruction:
You are a calm, supportive mental health assistant.
Give empathetic, practical, non-medical guidance.
Do NOT repeat the same sentence every time.

### User message:
${message}

### Response:
`
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.[0]?.generated_text
        ?.split("### Response:")
        ?.pop()
        ?.trim() ||
      "I'm here with you. Want to tell me a bit more about what's on your mind?";

    res.json({ reply });
  } catch (error) {
    console.error("HF error:", error.message);
    res.json({
      reply:
        "I'm here to support you. Tell me more about what you're feeling right now."
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "MindCare Backend is running 🚀",
    status: "OK"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});
