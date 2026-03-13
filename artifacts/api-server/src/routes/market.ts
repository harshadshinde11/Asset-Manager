import { Router, type IRouter } from "express";
import { db, marketSearchHistoryTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

type MandiData = {
  market: string;
  district: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  unit: string;
  distance: string;
};

const MANDI_DATA: Record<string, Record<string, Record<string, MandiData[]>>> = {
  Maharashtra: {
    Nashik: {
      Tomato: [
        { market: "Lasalgaon", district: "Nashik", currentPrice: 1200, minPrice: 900, maxPrice: 1500, unit: "quintal", distance: "5 km" },
        { market: "Pimpalgaon", district: "Nashik", currentPrice: 1150, minPrice: 850, maxPrice: 1400, unit: "quintal", distance: "12 km" },
        { market: "Nandgaon", district: "Nashik", currentPrice: 1080, minPrice: 800, maxPrice: 1350, unit: "quintal", distance: "18 km" },
      ],
      Onion: [
        { market: "Lasalgaon", district: "Nashik", currentPrice: 2500, minPrice: 2000, maxPrice: 3000, unit: "quintal", distance: "5 km" },
        { market: "Pimpalgaon", district: "Nashik", currentPrice: 2400, minPrice: 1900, maxPrice: 2900, unit: "quintal", distance: "12 km" },
        { market: "Nandgaon", district: "Nashik", currentPrice: 2300, minPrice: 1800, maxPrice: 2800, unit: "quintal", distance: "18 km" },
      ],
      Grape: [
        { market: "Lasalgaon", district: "Nashik", currentPrice: 8000, minPrice: 6000, maxPrice: 10000, unit: "quintal", distance: "5 km" },
        { market: "Pimpalgaon", district: "Nashik", currentPrice: 7800, minPrice: 5800, maxPrice: 9800, unit: "quintal", distance: "12 km" },
      ],
    },
    Pune: {
      Tomato: [
        { market: "Pune APMC", district: "Pune", currentPrice: 1350, minPrice: 1000, maxPrice: 1700, unit: "quintal", distance: "3 km" },
        { market: "Hadapsar", district: "Pune", currentPrice: 1280, minPrice: 950, maxPrice: 1600, unit: "quintal", distance: "8 km" },
        { market: "Supa", district: "Ahmednagar", currentPrice: 1100, minPrice: 850, maxPrice: 1400, unit: "quintal", distance: "25 km" },
      ],
      Cotton: [
        { market: "Pune APMC", district: "Pune", currentPrice: 6200, minPrice: 5800, maxPrice: 6800, unit: "quintal", distance: "3 km" },
        { market: "Baramati", district: "Pune", currentPrice: 6100, minPrice: 5700, maxPrice: 6700, unit: "quintal", distance: "15 km" },
      ],
    },
  },
  Karnataka: {
    Belgaum: {
      Jowar: [
        { market: "Belgaum APMC", district: "Belgaum", currentPrice: 2800, minPrice: 2400, maxPrice: 3200, unit: "quintal", distance: "4 km" },
        { market: "Dharwad", district: "Dharwad", currentPrice: 2750, minPrice: 2300, maxPrice: 3100, unit: "quintal", distance: "20 km" },
        { market: "Haveri", district: "Haveri", currentPrice: 2700, minPrice: 2250, maxPrice: 3050, unit: "quintal", distance: "35 km" },
      ],
      Cotton: [
        { market: "Belgaum APMC", district: "Belgaum", currentPrice: 6500, minPrice: 6000, maxPrice: 7000, unit: "quintal", distance: "4 km" },
        { market: "Dharwad", district: "Dharwad", currentPrice: 6400, minPrice: 5900, maxPrice: 6900, unit: "quintal", distance: "20 km" },
      ],
    },
    Bangalore: {
      Tomato: [
        { market: "Yeshwanthpur", district: "Bangalore", currentPrice: 1800, minPrice: 1400, maxPrice: 2200, unit: "quintal", distance: "3 km" },
        { market: "Anekal", district: "Bangalore Rural", currentPrice: 1650, minPrice: 1300, maxPrice: 2000, unit: "quintal", distance: "25 km" },
        { market: "Doddaballapur", district: "Bangalore Rural", currentPrice: 1600, minPrice: 1250, maxPrice: 1950, unit: "quintal", distance: "30 km" },
      ],
    },
  },
  "Tamil Nadu": {
    Chennai: {
      Tomato: [
        { market: "Koyambedu", district: "Chennai", currentPrice: 2100, minPrice: 1700, maxPrice: 2600, unit: "quintal", distance: "2 km" },
        { market: "Thiruvallur", district: "Thiruvallur", currentPrice: 1950, minPrice: 1550, maxPrice: 2400, unit: "quintal", distance: "40 km" },
        { market: "Vellore", district: "Vellore", currentPrice: 1800, minPrice: 1400, maxPrice: 2200, unit: "quintal", distance: "130 km" },
      ],
      Rice: [
        { market: "Koyambedu", district: "Chennai", currentPrice: 2200, minPrice: 1900, maxPrice: 2500, unit: "quintal", distance: "2 km" },
        { market: "Thanjavur", district: "Thanjavur", currentPrice: 2000, minPrice: 1750, maxPrice: 2300, unit: "quintal", distance: "310 km" },
      ],
    },
  },
  Kerala: {
    Kochi: {
      Banana: [
        { market: "Ernakulam", district: "Ernakulam", currentPrice: 2800, minPrice: 2200, maxPrice: 3500, unit: "quintal", distance: "5 km" },
        { market: "Thrissur", district: "Thrissur", currentPrice: 2600, minPrice: 2000, maxPrice: 3300, unit: "quintal", distance: "80 km" },
        { market: "Palakkad", district: "Palakkad", currentPrice: 2500, minPrice: 1900, maxPrice: 3200, unit: "quintal", distance: "120 km" },
      ],
    },
  },
  "West Bengal": {
    Kolkata: {
      Rice: [
        { market: "Kolkata APMC", district: "Kolkata", currentPrice: 2100, minPrice: 1800, maxPrice: 2400, unit: "quintal", distance: "3 km" },
        { market: "Howrah", district: "Howrah", currentPrice: 2050, minPrice: 1750, maxPrice: 2350, unit: "quintal", distance: "8 km" },
        { market: "Bardhaman", district: "Bardhaman", currentPrice: 1950, minPrice: 1650, maxPrice: 2250, unit: "quintal", distance: "110 km" },
      ],
      Jute: [
        { market: "Kolkata APMC", district: "Kolkata", currentPrice: 5000, minPrice: 4500, maxPrice: 5500, unit: "quintal", distance: "3 km" },
        { market: "Malda", district: "Malda", currentPrice: 4800, minPrice: 4300, maxPrice: 5300, unit: "quintal", distance: "340 km" },
      ],
    },
  },
  "Uttar Pradesh": {
    Lucknow: {
      Wheat: [
        { market: "Lucknow APMC", district: "Lucknow", currentPrice: 2300, minPrice: 2015, maxPrice: 2600, unit: "quintal", distance: "5 km" },
        { market: "Unnao", district: "Unnao", currentPrice: 2250, minPrice: 2000, maxPrice: 2550, unit: "quintal", distance: "40 km" },
        { market: "Raibareli", district: "Raebareli", currentPrice: 2200, minPrice: 1980, maxPrice: 2500, unit: "quintal", distance: "80 km" },
      ],
      Sugarcane: [
        { market: "Lucknow APMC", district: "Lucknow", currentPrice: 350, minPrice: 320, maxPrice: 380, unit: "quintal", distance: "5 km" },
        { market: "Kanpur", district: "Kanpur", currentPrice: 340, minPrice: 310, maxPrice: 370, unit: "quintal", distance: "80 km" },
      ],
    },
  },
  "Madhya Pradesh": {
    Indore: {
      Soybean: [
        { market: "Indore APMC", district: "Indore", currentPrice: 4800, minPrice: 4300, maxPrice: 5300, unit: "quintal", distance: "4 km" },
        { market: "Dewas", district: "Dewas", currentPrice: 4700, minPrice: 4200, maxPrice: 5200, unit: "quintal", distance: "35 km" },
        { market: "Ujjain", district: "Ujjain", currentPrice: 4650, minPrice: 4150, maxPrice: 5150, unit: "quintal", distance: "55 km" },
      ],
      Wheat: [
        { market: "Indore APMC", district: "Indore", currentPrice: 2350, minPrice: 2050, maxPrice: 2650, unit: "quintal", distance: "4 km" },
        { market: "Dewas", district: "Dewas", currentPrice: 2300, minPrice: 2020, maxPrice: 2600, unit: "quintal", distance: "35 km" },
      ],
    },
  },
};

router.post("/market/prices", async (req, res) => {
  const { state, district, crop_name, quantity } = req.body;

  const stateData = MANDI_DATA[state] || MANDI_DATA["Maharashtra"];
  const districtKey = district || Object.keys(stateData)[0];
  const districtData = stateData[districtKey] || stateData[Object.keys(stateData)[0]];
  const cropKey = crop_name || Object.keys(districtData)[0];
  let mandis: MandiData[] = districtData[cropKey] || districtData[Object.keys(districtData)[0]];

  if (!mandis || mandis.length === 0) {
    mandis = [
      { market: "Local APMC", district: districtKey, currentPrice: 2000, minPrice: 1700, maxPrice: 2300, unit: "quintal", distance: "5 km" },
      { market: "Nearby Mandi", district: districtKey, currentPrice: 1950, minPrice: 1650, maxPrice: 2250, unit: "quintal", distance: "15 km" },
      { market: "Regional Market", district: districtKey, currentPrice: 1900, minPrice: 1600, maxPrice: 2200, unit: "quintal", distance: "30 km" },
    ];
  }

  const currentPrice = mandis[0].currentPrice;
  const variance = currentPrice * 0.05;
  const prediction5Day = Math.round(currentPrice + (Math.random() - 0.4) * variance * 2);
  const prediction10Day = Math.round(currentPrice + (Math.random() - 0.3) * variance * 4);

  const diff = prediction5Day - currentPrice;
  const trend = diff > currentPrice * 0.02 ? "rising" : diff < -currentPrice * 0.02 ? "falling" : "stable";
  const trendPercent = Math.round((Math.abs(diff) / currentPrice) * 100 * 10) / 10;

  const bestMandi = mandis.reduce((a, b) => (a.currentPrice > b.currentPrice ? a : b));

  try {
    await db.insert(marketSearchHistoryTable).values({
      crop: crop_name || "Unknown",
      state: state || "Unknown",
      district: district || null,
      market: district || null,
    });
  } catch {}

  res.json({
    crop: crop_name || cropKey,
    state: state || "Maharashtra",
    currentPrice,
    prediction5Day,
    prediction10Day,
    trend,
    trendPercent,
    unit: "quintal",
    nearbyMandis: mandis,
    bestMarket: bestMandi.market,
    advice:
      trend === "rising"
        ? `Prices are rising! Consider holding stock for ${trendPercent}% more gain. Best market: ${bestMandi.market}.`
        : trend === "falling"
          ? `Prices declining. Sell at ${bestMandi.market} immediately for best returns.`
          : `Prices are stable. Sell at ${bestMandi.market} for best price of ₹${bestMandi.currentPrice}/quintal.`,
  });
});

router.get("/market/history", async (req, res) => {
  try {
    const history = await db.select().from(marketSearchHistoryTable).orderBy(desc(marketSearchHistoryTable.searchedAt)).limit(20);
    res.json(history.map((h) => ({ id: h.id, crop: h.crop, state: h.state, district: h.district, searchedAt: h.searchedAt?.toISOString() })));
  } catch {
    res.json([]);
  }
});

export default router;
