const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { OpenAI } = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const openaiKey = defineSecret("OPENAI_API_KEY");
const anthropicKey = defineSecret("ANTHROPIC_API_KEY");
const geminiKey = defineSecret("GEMINI_API_KEY");

function buildPrompt(userPrompt, framework) {
  const lang = framework === "selenium" ? "Python Selenium WebDriver" : "JavaScript Playwright";
  return `You are an expert test automation engineer. Generate a complete, runnable ${lang} test based on the following instructions.
Only output the code, no explanations. Add brief comments in Macedonian where helpful.

Instructions: ${userPrompt}`;
}

async function callGPT(prompt, apiKey) {
  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.3,
  });
  return response.choices[0].message.content;
}

async function callClaude(prompt, apiKey) {
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].text;
}

async function callGemini(prompt, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

exports.generateTest = onCall(
  {
    secrets: [openaiKey, anthropicKey, geminiKey],
    cors: true,
    maxInstances: 5,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Мора да бидеш најавен.");
    }

    const { prompt, model, framework } = request.data;

    if (!prompt || !model || !framework) {
      throw new HttpsError("invalid-argument", "Недостасуваат параметри.");
    }

    const fullPrompt = buildPrompt(prompt, framework);
    const start = Date.now();

    try {
      let code;
      if (model === "gpt4") {
        code = await callGPT(fullPrompt, openaiKey.value());
      } else if (model === "claude") {
        code = await callClaude(fullPrompt, anthropicKey.value());
      } else if (model === "gemini") {
        code = await callGemini(fullPrompt, geminiKey.value());
      } else {
        throw new HttpsError("invalid-argument", "Непознат модел: " + model);
      }

      const elapsed = ((Date.now() - start) / 1000).toFixed(2);

      // Clean up markdown code fences if the AI wraps them
      code = code.replace(/^```(?:python|javascript|js|py)?\n?/gm, "").replace(/```$/gm, "").trim();

      return { code, time: elapsed };
    } catch (error) {
      console.error("AI generation error:", error);
      throw new HttpsError("internal", "Грешка при генерирање: " + error.message);
    }
  }
);

exports.generateComparison = onCall(
  {
    secrets: [openaiKey, anthropicKey, geminiKey],
    cors: true,
    maxInstances: 5,
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Мора да бидеш најавен.");
    }

    const { prompt, framework } = request.data;

    if (!prompt || !framework) {
      throw new HttpsError("invalid-argument", "Недостасуваат параметри.");
    }

    const fullPrompt = buildPrompt(prompt, framework);

    const callWithTiming = async (fn, apiKey) => {
      const start = Date.now();
      try {
        let code = await fn(fullPrompt, apiKey);
        code = code.replace(/^```(?:python|javascript|js|py)?\n?/gm, "").replace(/```$/gm, "").trim();
        return { code, time: ((Date.now() - start) / 1000).toFixed(2), error: null };
      } catch (err) {
        return { code: null, time: "-", error: err.message };
      }
    };

    const [gpt, claude, gemini] = await Promise.all([
      callWithTiming(callGPT, openaiKey.value()),
      callWithTiming(callClaude, anthropicKey.value()),
      callWithTiming(callGemini, geminiKey.value()),
    ]);

    return { gpt, claude, gemini };
  }
);
