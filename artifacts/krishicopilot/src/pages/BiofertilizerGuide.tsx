const GUIDES = [
  {
    title: "Vermicompost",
    emoji: "🪱",
    color: "from-brown-600 to-orange-700",
    bg: "bg-orange-50 border-orange-200",
    materials: ["Earthworms (Eisenia fetida)", "Organic waste (vegetable peels, dry leaves)", "Cow dung", "Cardboard/newspaper", "Water"],
    steps: ["Prepare a bed of cow dung + dry leaves (15 cm thick)", "Add kitchen waste and earthworms", "Maintain moisture (50-60%) and cover", "Turn the compost weekly for aeration", "Harvest in 60-90 days when dark and earthy"],
    time: "60-90 days",
    benefits: ["Improves soil structure and aeration", "Provides balanced NPK nutrition", "Increases water-holding capacity", "Suppresses soil-borne diseases", "Boosts crop yield by 20-30%"],
    usage: "Apply 2-4 tons per acre at land preparation stage. Can also be used as seed treatment or top dressing.",
  },
  {
    title: "Cow Dung Compost (FYM)",
    emoji: "🐄",
    color: "from-yellow-700 to-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    materials: ["Fresh cow dung", "Crop residues/straw", "Wood ash", "Water", "Soil (for covering)"],
    steps: ["Make a pit 3m × 2m × 1m deep", "Layer cow dung and crop residues alternately", "Add wood ash between layers for potassium", "Cover with soil and water regularly", "Turn monthly and harvest after 4-6 months"],
    time: "4-6 months",
    benefits: ["Excellent source of nitrogen, phosphorus, potassium", "Improves soil microbial activity", "Increases organic matter content", "Reduces dependency on chemical fertilizers", "Low cost and widely available"],
    usage: "Apply 5-8 tons per acre before sowing. Incorporate well into top 15 cm of soil.",
  },
  {
    title: "Crop Residue Compost",
    emoji: "🌾",
    color: "from-green-700 to-green-600",
    bg: "bg-green-50 border-green-200",
    materials: ["Paddy straw/wheat straw", "Cow dung slurry", "Trichoderma (composting culture)", "Nitrogen fertilizer (urea)", "Water"],
    steps: ["Shred crop residue into 5-10 cm pieces", "Spread 6-inch layer of residue", "Apply cow dung slurry and Trichoderma culture", "Add urea for C:N ratio adjustment", "Cover and maintain moisture for 30-45 days"],
    time: "30-45 days",
    benefits: ["Reduces crop residue burning pollution", "Recycles nutrients back to soil", "Improves soil carbon sequestration", "Cost-effective (uses farm waste)", "Increases beneficial soil organisms"],
    usage: "Apply 3-5 tons per acre during land preparation. Speeds up with Trichoderma culture.",
  },
  {
    title: "Kitchen Waste Compost",
    emoji: "♻️",
    color: "from-teal-700 to-teal-600",
    bg: "bg-teal-50 border-teal-200",
    materials: ["Vegetable/fruit peels", "Leftover cooked food", "Dry leaves", "Soil", "Earthworms (optional)"],
    steps: ["Collect kitchen waste excluding non-biodegradable items", "Add to composting bin with equal dry material", "Mix in some soil and maintain moisture", "Stir weekly to provide oxygen", "Compost is ready in 30-60 days"],
    time: "30-60 days",
    benefits: ["Reduces household/farm waste", "Creates rich nutrient-dense compost", "Ideal for kitchen gardens and nurseries", "Zero cost raw materials", "Environmentally sustainable"],
    usage: "Excellent for kitchen gardens, nursery beds, and potted plants. Mix 1 part compost with 3 parts soil.",
  },
  {
    title: "Bio Slurry (Biogas Effluent)",
    emoji: "🔋",
    color: "from-purple-700 to-purple-600",
    bg: "bg-purple-50 border-purple-200",
    materials: ["Biogas plant effluent (slurry)", "Water (for dilution)", "Storage tank"],
    steps: ["Collect slurry from biogas plant outlet", "Dilute with water in ratio 1:3 for foliar spray", "Can be applied directly for soil application", "Store in covered pit or tank", "Use within 48 hours for maximum benefit"],
    time: "Immediate (biogas byproduct)",
    benefits: ["Rich in nitrogen (3-4% N), phosphorus, potassium", "Improves soil microbial diversity", "Free resource from biogas plants", "Increases crop yield by 15-25%", "Reduces chemical fertilizer use by 30-40%"],
    usage: "Apply 1000-1500 liters/acre directly. Dilute 1:3 for foliar spray. Best applied in the morning.",
  },
];

export default function BiofertilizerGuidePage({ t }: { t: (k: string) => string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-green-800 to-green-700 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">🌿</div>
          <h1 className="text-2xl font-bold">Biofertilizer & Compost Guide</h1>
        </div>
        <p className="text-green-100">Learn to make organic fertilizers at home. Reduce costs, improve soil health naturally.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {GUIDES.map((guide) => (
          <div key={guide.title} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${guide.bg.split(" ")[1]}`}>
            <div className={`${guide.bg} p-5 flex items-center gap-3`}>
              <span className="text-4xl">{guide.emoji}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{guide.title}</h2>
                <p className="text-sm text-gray-500">⏱️ Ready in {guide.time}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">📦 Materials Required</h3>
                <ul className="space-y-1">
                  {guide.materials.map((m, i) => <li key={i} className="text-sm text-gray-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />{m}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">📋 Steps</h3>
                <ol className="space-y-1.5">
                  {guide.steps.map((s, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i+1}</span>{s}</li>)}
                </ol>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">✅ Benefits</h3>
                <ul className="space-y-1">
                  {guide.benefits.map((b, i) => <li key={i} className="text-sm text-gray-600 flex items-center gap-1.5"><span className="text-green-500">✓</span>{b}</li>)}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 mt-2">
                <h3 className="text-xs font-bold text-gray-700 mb-1">💡 How to Use</h3>
                <p className="text-xs text-gray-600">{guide.usage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
