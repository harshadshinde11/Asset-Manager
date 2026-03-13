import { useState } from "react";
import { api } from "@/lib/api";
import { Leaf, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface CropRec { crop: string; confidence: number; suitability: string; description: string; waterRequirement: string; duration: string; expectedYield: string; marketPrice: string; }

const SOIL_TYPES = ["Black Cotton", "Red Loamy", "Alluvial", "Sandy Loam", "Clay"];
const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Kerala", "West Bengal", "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Punjab", "Haryana", "Rajasthan", "Bihar"];
const SEASONS = [{ value: "kharif", label: "Kharif (Jun-Nov)" }, { value: "rabi", label: "Rabi (Nov-Apr)" }, { value: "zaid", label: "Zaid (Mar-Jun)" }];

const SUIT_COLORS: Record<string, string> = { excellent: "bg-green-100 text-green-700", good: "bg-blue-100 text-blue-700", fair: "bg-yellow-100 text-yellow-700" };
const SUIT_ICONS: Record<string, JSX.Element> = { excellent: <CheckCircle className="w-4 h-4" />, good: <CheckCircle className="w-4 h-4" />, fair: <AlertCircle className="w-4 h-4" /> };

export default function CropsPage({ t }: { t: (k: string) => string }) {
  const [form, setForm] = useState({ soil_type: "Black Cotton", state: "Maharashtra", season: "kharif", rainfall: "", temperature: "", ph: "", nitrogen: "", phosphorus: "", potassium: "" });
  const [result, setResult] = useState<{ recommendations: CropRec[]; advisory: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post<{ recommendations: CropRec[]; advisory: string }>("/crops/recommend", form);
      setResult(data);
    } catch { } finally { setLoading(false); }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Leaf className="w-5 h-5" /></div>
          <h1 className="text-2xl font-bold">AI Crop Recommendation</h1>
        </div>
        <p className="text-green-100">Get personalized crop suggestions based on your soil, climate, and location.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-5 text-lg">Farm Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type *</label>
                <select value={form.soil_type} onChange={(e) => setForm({ ...form, soil_type: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-green-400 text-sm">
                  {SOIL_TYPES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-green-400 text-sm">
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season *</label>
                <select value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-green-400 text-sm">
                  {SEASONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[["rainfall", "Rainfall (mm)"], ["temperature", "Temperature (°C)"], ["ph", "Soil pH"], ["nitrogen", "Nitrogen (N)"], ["phosphorus", "Phosphorus (P)"], ["potassium", "Potassium (K)"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input type="number" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder="Optional" className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-400 text-sm" />
                  </div>
                ))}
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</> : "🌾 Get Recommendations"}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {!result && !loading && (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">🌾</div>
              <p className="text-gray-500 font-medium">Fill in your farm details and click "Get Recommendations" to see the best crops for your land.</p>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              {/* Advisory */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="text-sm font-medium text-green-800">💡 {result.advisory}</p>
              </div>
              {/* Crop cards */}
              {result.recommendations.map((crop, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-green-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{crop.crop}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${SUIT_COLORS[crop.suitability]}`}>
                          {SUIT_ICONS[crop.suitability]} {crop.suitability}
                        </span>
                        <span className="text-sm text-gray-500">Confidence: <strong>{crop.confidence}%</strong></span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${crop.confidence}%` }} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{crop.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[["💧", "Water", crop.waterRequirement], ["⏱️", "Duration", crop.duration], ["🌾", "Yield", crop.expectedYield], ["💰", "Price", crop.marketPrice]].map(([icon, label, value]) => (
                      <div key={label as string} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">{icon} {label}</p>
                        <p className="text-xs font-semibold text-gray-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
