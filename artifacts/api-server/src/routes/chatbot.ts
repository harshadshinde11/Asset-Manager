import { Router, type IRouter } from "express";
import { db, chatMessagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

type BotAnswer = { response: string; suggestions: string[] };

const KB: Record<string, BotAnswer> = {
  weather: {
    response: "🌤️ Check your local weather using the Weather Dashboard. I monitor rain alerts, drought risks, heat stress, and flood warnings daily. For real-time weather, go to the Dashboard page and enter your location.",
    suggestions: ["How to handle drought?", "What crops for heavy rainfall?", "When to irrigate?"],
  },
  rain: {
    response: "🌧️ During heavy rain, avoid field operations, ensure proper drainage, and protect standing crops with covers. After rain, check for waterlogging and apply fungicide if needed to prevent root rot.",
    suggestions: ["Rain-resistant crops", "Drainage tips", "Post-rain fertilization"],
  },
  drought: {
    response: "🏜️ For drought management: Use drip irrigation for 40% water saving, mulch soil to retain moisture, grow drought-tolerant varieties like Bajra, Jowar, or Cotton. Apply wilt guard spray on leaves during severe heat.",
    suggestions: ["Drought-tolerant crops", "Water conservation methods", "Government drought relief"],
  },
  crop: {
    response: "🌾 For crop recommendations, visit the Crop Recommendation page and enter your soil type, state, season, and soil parameters (NPK, pH). Our AI will suggest the best crops with confidence scores and market prices.",
    suggestions: ["Best kharif crops", "Rabi crop guide", "Soil testing tips"],
  },
  disease: {
    response: "🔬 Use the Pest Camera feature to capture your crop image and get instant pest/disease detection. Common diseases include: Leaf blight (treat with Mancozeb), Powdery mildew (treat with Sulfur), and Stem borer (use Chlorpyrifos).",
    suggestions: ["Leaf blight treatment", "Organic pest control", "Preventive spraying"],
  },
  pest: {
    response: "🐛 Common pests include Aphids, Caterpillars, Thrips, Whitefly, and Stem Borers. Use the Pest Camera for detection. Organic control: Neem oil spray (5ml/L), Yellow sticky traps. Chemical: Imidacloprid, Chlorpyrifos.",
    suggestions: ["Neem oil spray recipe", "Aphid control", "Stem borer management"],
  },
  fertilizer: {
    response: "🌱 Fertilizer guide:\n• NPK 10:26:26 for phosphorus-deficient soils\n• Urea (46% N) for nitrogen boost\n• DAP for balanced nutrition\n• Organic: Vermicompost (2-3 tons/acre), FYM (5-8 tons/acre)\nApply in split doses — 30% at sowing, 70% at tillering/branching.",
    suggestions: ["Organic fertilizers", "When to apply urea?", "Micronutrient deficiency"],
  },
  market: {
    response: "📊 Check real-time mandi prices on the Market page. Enter your state, district, and crop to see current prices, 5-day and 10-day predictions, and nearby mandi comparison. Best time to sell is when the rising trend badge shows.",
    suggestions: ["Best time to sell Wheat?", "How to register on eNAM?", "Storage for better prices"],
  },
  yield: {
    response: "📈 Improve crop yield with:\n1. Certified high-yield seeds\n2. Balanced fertilization (soil test-based)\n3. Timely irrigation at critical stages\n4. Integrated Pest Management (IPM)\n5. Proper spacing and thinning\nUse Farm Simulation to estimate yield before planting.",
    suggestions: ["High-yield rice varieties", "Fertilizer for better yield", "Irrigation schedule"],
  },
  soil: {
    response: "🪱 Soil health tips:\n• Get Soil Health Card every 2 years\n• Maintain pH 6.0-7.5 for most crops\n• Add organic matter (FYM/compost) to improve structure\n• Deep plowing once in 3 years\n• Avoid burning crop residue — incorporate into soil instead.",
    suggestions: ["Soil testing lab near me", "How to improve sandy soil?", "Clay soil management"],
  },
  simulation: {
    response: "🧮 Use the Farm Simulation page to calculate expected yield, revenue, cost, and profit before planting. Enter crop, land area, soil type, irrigation method, and fertilizer type to get detailed financial projections and ROI.",
    suggestions: ["Simulate Cotton farming", "Estimate wheat profit", "Best irrigation for ROI"],
  },
  government: {
    response: "🏛️ Key farmer schemes:\n• PM Kisan Samman Nidhi: ₹6,000/year direct benefit\n• PM Fasal Bima Yojana: Crop insurance at 1.5-2% premium\n• Soil Health Card: Free soil testing\n• Kisan Credit Card: Low-interest farm loans\n• eNAM: Online mandi platform for better prices",
    suggestions: ["How to apply PM Kisan?", "Crop insurance guide", "Kisan Credit Card limit"],
  },
  insurance: {
    response: "🛡️ PM Fasal Bima Yojana coverage:\n• Kharif crops: 2% premium\n• Rabi crops: 1.5% premium\n• Annual Commercial/Horticultural crops: 5% premium\nCovers: Natural calamities, pest attacks, disease. Apply online at pmfby.gov.in or through your bank.",
    suggestions: ["PMFBY registration", "Claim process", "Which crops are covered?"],
  },
  organic: {
    response: "🌿 Organic farming tips:\n• Use vermicompost (2-3 tons/acre) for soil health\n• Prepare Jeevamrit: 10kg cow dung + 10L cow urine + 2kg jaggery + 2kg besan (per 200L water)\n• Neem cake for pest control\n• Crop rotation to break pest cycles\nCheck our Biofertilizer Guide for detailed recipes.",
    suggestions: ["Vermicompost preparation", "Jeevamrit recipe", "Organic certification"],
  },
};

const SUGGESTIONS_DEFAULT = ["Weather alerts today", "Best crops for my soil", "Pest detection help", "Market prices near me", "Government schemes"];

function getBotResponse(message: string): { response: string; suggestions: string[] } {
  const lower = message.toLowerCase();

  for (const [key, value] of Object.entries(KB)) {
    if (lower.includes(key)) {
      return value;
    }
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste") || lower.includes("helo")) {
    return {
      response: "🙏 Namaste! I'm KrishiBot, your intelligent farming assistant. I can help you with weather advice, crop recommendations, pest detection, market prices, fertilizer guidance, and government schemes. What would you like to know today?",
      suggestions: SUGGESTIONS_DEFAULT,
    };
  }

  if (lower.includes("thank")) {
    return {
      response: "🌾 You're welcome! Happy farming! Feel free to ask anything about crops, weather, markets, or farming advice. Jai Kisan! 🙏",
      suggestions: SUGGESTIONS_DEFAULT,
    };
  }

  if (lower.includes("price") || lower.includes("mandi") || lower.includes("sell")) {
    return KB["market"];
  }

  if (lower.includes("water") || lower.includes("irrigat")) {
    return {
      response: "💧 Irrigation guide:\n• Drip irrigation saves 40-50% water\n• Sprinkler is ideal for wheat and vegetables\n• Flood irrigation for paddy\n• Irrigate at critical stages: germination, flowering, grain filling\nCheck weather forecast before irrigating to avoid over-watering.",
      suggestions: ["Drip irrigation cost", "Irrigation subsidy schemes", "When to irrigate wheat?"],
    };
  }

  if (lower.includes("seed")) {
    return {
      response: "🌱 Seed selection tips:\n• Always buy certified seeds (ISI marked)\n• Check germination rate on packet (>85% is good)\n• Treat seeds with Thiram or Mancozeb before sowing\n• Use High Yielding Varieties (HYV) from state agriculture departments\n• Keep seed moisture below 12% for storage.",
      suggestions: ["Best rice variety", "Hybrid vs open-pollinated seeds", "Seed treatment methods"],
    };
  }

  return {
    response: `I understand you're asking about "${message}". As your farming assistant, I can help with weather, crop recommendations, pest detection, market prices, fertilizer advice, and government schemes. Could you be more specific about what you need help with?`,
    suggestions: SUGGESTIONS_DEFAULT,
  };
}

router.post("/chatbot/message", async (req, res) => {
  const { message, session_id, language } = req.body;
  const sessionId = session_id || "default";

  try {
    await db.insert(chatMessagesTable).values({
      sessionId,
      role: "user",
      message,
      language: language || "en",
    });
  } catch {}

  const { response, suggestions } = getBotResponse(message);

  try {
    await db.insert(chatMessagesTable).values({
      sessionId,
      role: "bot",
      message: response,
      language: language || "en",
    });
  } catch {}

  res.json({ response, sessionId, suggestions });
});

router.get("/chatbot/history", async (req, res) => {
  const sessionId = (req.query["session_id"] as string) || "default";
  try {
    const history = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, sessionId)).orderBy(chatMessagesTable.createdAt).limit(50);
    res.json(history.map((m) => ({ id: m.id, sessionId: m.sessionId, role: m.role, message: m.message, createdAt: m.createdAt?.toISOString() })));
  } catch {
    res.json([]);
  }
});

router.delete("/chatbot/history", async (req, res) => {
  const sessionId = (req.query["session_id"] as string) || "default";
  try {
    const { eq: eqOp } = await import("drizzle-orm");
    await db.delete(chatMessagesTable).where(eqOp(chatMessagesTable.sessionId, sessionId));
    res.json({ success: true, message: "Chat history cleared" });
  } catch {
    res.json({ success: true, message: "Cleared" });
  }
});

export default router;
