import { Router, type IRouter } from "express";

const router: IRouter = Router();

const CROP_DATA: Record<string, Record<string, any[]>> = {
  kharif: {
    "Black Cotton": [
      { crop: "Cotton", confidence: 94, suitability: "excellent", description: "Black cotton soil is ideal for cotton cultivation. High water retention benefits the crop.", waterRequirement: "600-1200mm", duration: "150-180 days", expectedYield: "20-25 quintals/acre", marketPrice: "₹5,500-6,500/quintal" },
      { crop: "Soybean", confidence: 88, suitability: "excellent", description: "Black soil with good drainage is excellent for soybean. High protein content variety recommended.", waterRequirement: "450-700mm", duration: "90-120 days", expectedYield: "10-15 quintals/acre", marketPrice: "₹4,000-5,000/quintal" },
      { crop: "Jowar", confidence: 82, suitability: "good", description: "Drought tolerant crop suitable for black soil regions.", waterRequirement: "300-500mm", duration: "90-120 days", expectedYield: "15-20 quintals/acre", marketPrice: "₹2,200-2,800/quintal" },
    ],
    "Red Loamy": [
      { crop: "Groundnut", confidence: 92, suitability: "excellent", description: "Red loamy soil provides excellent drainage for groundnut cultivation.", waterRequirement: "400-600mm", duration: "90-120 days", expectedYield: "12-18 quintals/acre", marketPrice: "₹5,000-6,000/quintal" },
      { crop: "Rice", confidence: 85, suitability: "good", description: "Suitable with proper water management and leveling.", waterRequirement: "1200-2000mm", duration: "120-150 days", expectedYield: "20-30 quintals/acre", marketPrice: "₹1,800-2,200/quintal" },
      { crop: "Maize", confidence: 80, suitability: "good", description: "Good yield in red loamy soil with proper fertilization.", waterRequirement: "500-800mm", duration: "80-110 days", expectedYield: "18-25 quintals/acre", marketPrice: "₹1,600-2,000/quintal" },
    ],
    "Alluvial": [
      { crop: "Rice", confidence: 96, suitability: "excellent", description: "Alluvial soil is perfect for rice cultivation due to water retention and nutrients.", waterRequirement: "1200-2000mm", duration: "120-150 days", expectedYield: "25-35 quintals/acre", marketPrice: "₹1,800-2,200/quintal" },
      { crop: "Sugarcane", confidence: 90, suitability: "excellent", description: "Highly productive in alluvial soils with good irrigation.", waterRequirement: "1500-2500mm", duration: "300-365 days", expectedYield: "300-400 quintals/acre", marketPrice: "₹280-350/quintal" },
      { crop: "Maize", confidence: 88, suitability: "excellent", description: "Excellent nutrient availability in alluvial soil benefits maize.", waterRequirement: "500-800mm", duration: "80-110 days", expectedYield: "22-30 quintals/acre", marketPrice: "₹1,600-2,000/quintal" },
    ],
    "Sandy Loam": [
      { crop: "Bajra", confidence: 90, suitability: "excellent", description: "Sandy loam soil is perfect for bajra, offering good drainage.", waterRequirement: "200-400mm", duration: "70-90 days", expectedYield: "10-15 quintals/acre", marketPrice: "₹2,100-2,500/quintal" },
      { crop: "Sesame", confidence: 84, suitability: "good", description: "Well-drained sandy loam is ideal for sesame cultivation.", waterRequirement: "250-500mm", duration: "80-100 days", expectedYield: "4-8 quintals/acre", marketPrice: "₹9,000-12,000/quintal" },
    ],
    "Clay": [
      { crop: "Rice", confidence: 93, suitability: "excellent", description: "Clay soil retains water well, making it ideal for paddy cultivation.", waterRequirement: "1200-2000mm", duration: "120-150 days", expectedYield: "22-30 quintals/acre", marketPrice: "₹1,800-2,200/quintal" },
      { crop: "Jute", confidence: 86, suitability: "good", description: "Clay soil with high moisture is suitable for jute.", waterRequirement: "1000-2000mm", duration: "120-150 days", expectedYield: "15-25 quintals/acre", marketPrice: "₹4,000-5,500/quintal" },
    ],
  },
  rabi: {
    "Black Cotton": [
      { crop: "Wheat", confidence: 90, suitability: "excellent", description: "Black soil with good moisture retention is ideal for wheat cultivation.", waterRequirement: "400-650mm", duration: "100-130 days", expectedYield: "18-25 quintals/acre", marketPrice: "₹2,015-2,500/quintal" },
      { crop: "Chickpea", confidence: 87, suitability: "excellent", description: "Black soil provides good drainage and nutrients for chickpea.", waterRequirement: "350-500mm", duration: "90-120 days", expectedYield: "8-12 quintals/acre", marketPrice: "₹5,000-6,500/quintal" },
    ],
    "Alluvial": [
      { crop: "Wheat", confidence: 95, suitability: "excellent", description: "Prime wheat growing conditions in alluvial soil with rich nutrients.", waterRequirement: "400-650mm", duration: "100-130 days", expectedYield: "22-30 quintals/acre", marketPrice: "₹2,015-2,500/quintal" },
      { crop: "Mustard", confidence: 88, suitability: "excellent", description: "Alluvial soil supports excellent mustard production.", waterRequirement: "200-400mm", duration: "90-120 days", expectedYield: "8-12 quintals/acre", marketPrice: "₹5,000-6,000/quintal" },
      { crop: "Potato", confidence: 85, suitability: "good", description: "Well-drained alluvial soil is good for potato cultivation.", waterRequirement: "350-600mm", duration: "90-120 days", expectedYield: "80-120 quintals/acre", marketPrice: "₹600-1,200/quintal" },
    ],
    "Red Loamy": [
      { crop: "Groundnut", confidence: 89, suitability: "excellent", description: "Rabi groundnut in red loamy soil gives excellent results.", waterRequirement: "300-500mm", duration: "90-120 days", expectedYield: "10-16 quintals/acre", marketPrice: "₹5,000-6,000/quintal" },
      { crop: "Sunflower", confidence: 83, suitability: "good", description: "Red loamy soil with irrigation supports sunflower cultivation.", waterRequirement: "350-600mm", duration: "90-110 days", expectedYield: "8-12 quintals/acre", marketPrice: "₹5,800-7,000/quintal" },
    ],
    "Sandy Loam": [
      { crop: "Barley", confidence: 88, suitability: "excellent", description: "Sandy loam soil with good drainage is ideal for barley.", waterRequirement: "250-450mm", duration: "90-120 days", expectedYield: "15-22 quintals/acre", marketPrice: "₹1,600-2,000/quintal" },
      { crop: "Mustard", confidence: 82, suitability: "good", description: "Well-drained sandy loam supports good mustard yield.", waterRequirement: "200-400mm", duration: "90-120 days", expectedYield: "6-10 quintals/acre", marketPrice: "₹5,000-6,000/quintal" },
    ],
    "Clay": [
      { crop: "Wheat", confidence: 86, suitability: "good", description: "Clay soil with proper drainage supports wheat cultivation.", waterRequirement: "400-650mm", duration: "100-130 days", expectedYield: "18-24 quintals/acre", marketPrice: "₹2,015-2,500/quintal" },
      { crop: "Lentil", confidence: 84, suitability: "good", description: "Clay loam soil is suitable for lentil with proper moisture.", waterRequirement: "250-400mm", duration: "80-110 days", expectedYield: "6-10 quintals/acre", marketPrice: "₹5,500-7,000/quintal" },
    ],
  },
  zaid: {
    "Alluvial": [
      { crop: "Watermelon", confidence: 92, suitability: "excellent", description: "Sandy alluvial soil is perfect for watermelon in summer season.", waterRequirement: "400-600mm", duration: "70-100 days", expectedYield: "150-250 quintals/acre", marketPrice: "₹400-800/quintal" },
      { crop: "Muskmelon", confidence: 88, suitability: "excellent", description: "Light alluvial soil with good drainage is ideal for muskmelon.", waterRequirement: "350-500mm", duration: "70-90 days", expectedYield: "100-150 quintals/acre", marketPrice: "₹600-1,200/quintal" },
      { crop: "Cucumber", confidence: 84, suitability: "good", description: "Sandy loam alluvial soil supports excellent cucumber growth.", waterRequirement: "350-500mm", duration: "50-70 days", expectedYield: "80-120 quintals/acre", marketPrice: "₹500-1,000/quintal" },
    ],
    "Sandy Loam": [
      { crop: "Moong Dal", confidence: 91, suitability: "excellent", description: "Sandy loam soil is excellent for summer moong cultivation.", waterRequirement: "200-350mm", duration: "60-75 days", expectedYield: "6-10 quintals/acre", marketPrice: "₹6,500-8,000/quintal" },
      { crop: "Sunflower", confidence: 85, suitability: "good", description: "Sandy loam with irrigation gives good sunflower yields in zaid.", waterRequirement: "350-600mm", duration: "90-110 days", expectedYield: "8-12 quintals/acre", marketPrice: "₹5,800-7,000/quintal" },
    ],
    "Black Cotton": [
      { crop: "Vegetables", confidence: 80, suitability: "good", description: "Summer vegetables can be grown in black soil with proper irrigation.", waterRequirement: "400-700mm", duration: "45-90 days", expectedYield: "varies", marketPrice: "varies" },
    ],
    "Red Loamy": [
      { crop: "Moong Dal", confidence: 87, suitability: "good", description: "Red loamy soil is suitable for summer moong with good drainage.", waterRequirement: "200-350mm", duration: "60-75 days", expectedYield: "5-9 quintals/acre", marketPrice: "₹6,500-8,000/quintal" },
    ],
    "Clay": [
      { crop: "Moong Dal", confidence: 75, suitability: "fair", description: "Clay soil can support moong with careful water management.", waterRequirement: "200-350mm", duration: "60-75 days", expectedYield: "4-7 quintals/acre", marketPrice: "₹6,500-8,000/quintal" },
    ],
  },
};

const ADVISORIES: Record<string, string> = {
  kharif: "Kharif season (June-November): Ensure proper field preparation before monsoon onset. Apply balanced NPK fertilizers. Use certified seeds for better yield.",
  rabi: "Rabi season (November-April): Irrigate at critical growth stages. Apply boron and zinc micronutrients. Watch for aphid and rust disease.",
  zaid: "Zaid season (March-June): Use drip irrigation for water conservation. Apply mulching to reduce moisture loss. Choose heat-tolerant varieties.",
};

router.post("/crops/recommend", (req, res) => {
  const { soil_type, season } = req.body;

  const seasonData = CROP_DATA[season] || CROP_DATA["kharif"];
  let crops = seasonData[soil_type] || [];

  if (crops.length === 0) {
    const firstKey = Object.keys(seasonData)[0];
    crops = seasonData[firstKey] || [];
  }

  res.json({
    recommendations: crops,
    advisory: ADVISORIES[season] || ADVISORIES["kharif"],
  });
});

const CROP_SIMULATION: Record<string, { seedCostPerAcre: number; yieldPerAcre: number; marketPricePerQuintal: number }> = {
  Rice: { seedCostPerAcre: 2000, yieldPerAcre: 25, marketPricePerQuintal: 2000 },
  Wheat: { seedCostPerAcre: 1800, yieldPerAcre: 22, marketPricePerQuintal: 2200 },
  Cotton: { seedCostPerAcre: 3500, yieldPerAcre: 22, marketPricePerQuintal: 5800 },
  Soybean: { seedCostPerAcre: 2500, yieldPerAcre: 12, marketPricePerQuintal: 4500 },
  Sugarcane: { seedCostPerAcre: 8000, yieldPerAcre: 350, marketPricePerQuintal: 300 },
  Maize: { seedCostPerAcre: 2200, yieldPerAcre: 24, marketPricePerQuintal: 1800 },
  Groundnut: { seedCostPerAcre: 3000, yieldPerAcre: 14, marketPricePerQuintal: 5500 },
  Chickpea: { seedCostPerAcre: 2000, yieldPerAcre: 10, marketPricePerQuintal: 5800 },
  Mustard: { seedCostPerAcre: 1500, yieldPerAcre: 9, marketPricePerQuintal: 5500 },
  Jowar: { seedCostPerAcre: 1200, yieldPerAcre: 18, marketPricePerQuintal: 2500 },
  Bajra: { seedCostPerAcre: 1000, yieldPerAcre: 12, marketPricePerQuintal: 2200 },
};

router.post("/crops/simulate", (req, res) => {
  const { crop, land_area, soil_type, irrigation_type, fertilizer_type } = req.body;

  const cropInfo = CROP_SIMULATION[crop] || CROP_SIMULATION["Wheat"];
  const area = parseFloat(land_area) || 1;

  const irrigationMultiplier = irrigation_type === "drip" ? 1.2 : irrigation_type === "sprinkler" ? 1.15 : 1.0;
  const fertilizerMultiplier = fertilizer_type === "organic" ? 1.05 : fertilizer_type === "chemical" ? 1.15 : 1.1;
  const soilMultiplier = soil_type === "Alluvial" ? 1.15 : soil_type === "Black Cotton" ? 1.1 : 1.0;

  const estimatedYield = cropInfo.yieldPerAcre * area * irrigationMultiplier * fertilizerMultiplier * soilMultiplier;
  const estimatedRevenue = estimatedYield * cropInfo.marketPricePerQuintal;

  const seedCost = cropInfo.seedCostPerAcre * area;
  const fertilizerCost = fertilizer_type === "organic" ? 4000 * area : 3500 * area;
  const irrigationCost = irrigation_type === "drip" ? 2000 * area : irrigation_type === "sprinkler" ? 1500 * area : 800 * area;
  const laborCost = 5000 * area;
  const otherCost = 1500 * area;
  const totalCost = seedCost + fertilizerCost + irrigationCost + laborCost + otherCost;

  const profit = estimatedRevenue - totalCost;
  const roi = (profit / totalCost) * 100;

  const recommendations = [
    `Use ${irrigation_type === "drip" ? "drip irrigation" : "flood irrigation"} for optimal water usage`,
    `Apply ${fertilizer_type} fertilizer in split doses for better absorption`,
    `Soil health card recommended before sowing for precise nutrient management`,
    `Consider crop insurance under PM Fasal Bima Yojana`,
    roi > 50 ? "Excellent ROI expected — scale up production if possible" : "Consider value-added processing to improve margins",
  ];

  res.json({
    crop,
    landArea: area,
    estimatedYield: Math.round(estimatedYield * 10) / 10,
    estimatedRevenue: Math.round(estimatedRevenue),
    totalCost: Math.round(totalCost),
    profit: Math.round(profit),
    roi: Math.round(roi * 10) / 10,
    breakdown: {
      seedCost: Math.round(seedCost),
      fertilizerCost: Math.round(fertilizerCost),
      irrigationCost: Math.round(irrigationCost),
      laborCost: Math.round(laborCost),
      otherCost: Math.round(otherCost),
    },
    recommendations,
  });
});

export default router;
