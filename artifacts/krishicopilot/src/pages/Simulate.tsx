import { useState } from "react";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";

interface SimResult { crop: string; landArea: number; estimatedYield: number; estimatedRevenue: number; totalCost: number; profit: number; roi: number; breakdown: { seedCost: number; fertilizerCost: number; irrigationCost: number; laborCost: number; otherCost: number }; recommendations: string[]; }

const CROPS = ["Rice", "Wheat", "Cotton", "Soybean", "Sugarcane", "Maize", "Groundnut", "Chickpea", "Mustard", "Jowar", "Bajra"];
const SOIL_TYPES = ["Black Cotton", "Red Loamy", "Alluvial", "Sandy Loam", "Clay"];
const IRRIGATION_TYPES = [{ value: "drip", label: "Drip Irrigation (Most Efficient)" }, { value: "sprinkler", label: "Sprinkler Irrigation" }, { value: "flood", label: "Flood/Furrow Irrigation" }];
const FERTILIZER_TYPES = [{ value: "organic", label: "Organic (FYM/Compost)" }, { value: "chemical", label: "Chemical (NPK)" }, { value: "integrated", label: "Integrated (Both)" }];
const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Madhya Pradesh", "Punjab", "Haryana"];
const SEASONS = ["kharif", "rabi", "zaid"];

const PIE_COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function SimulatePage({ t }: { t: (k: string) => string }) {
  const [form, setForm] = useState({ crop: "Wheat", land_area: "2", soil_type: "Alluvial", irrigation_type: "drip", fertilizer_type: "integrated", state: "Maharashtra", season: "rabi" });
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try { const data = await api.post<SimResult>("/crops/simulate", { ...form, land_area: parseFloat(form.land_area) }); setResult(data); }
    catch { } finally { setLoading(false); }
  }

  const pieData = result ? [
    { name: "Seeds", value: result.breakdown.seedCost },
    { name: "Fertilizer", value: result.breakdown.fertilizerCost },
    { name: "Irrigation", value: result.breakdown.irrigationCost },
    { name: "Labor", value: result.breakdown.laborCost },
    { name: "Other", value: result.breakdown.otherCost },
  ] : [];

  const barData = result ? [
    { name: "Cost", value: result.totalCost, fill: "#ef4444" },
    { name: "Revenue", value: result.estimatedRevenue, fill: "#16a34a" },
    { name: "Profit", value: result.profit, fill: result.profit > 0 ? "#3b82f6" : "#f59e0b" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-3xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
          <h1 className="text-2xl font-bold">Farm Profit Simulator</h1>
        </div>
        <p className="text-purple-100">Calculate expected yield, cost, revenue, and ROI before you plant.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-5 text-lg">Simulation Parameters</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: "crop", label: "Crop", type: "select", options: CROPS.map(c => ({ value: c, label: c })) },
                { key: "land_area", label: "Land Area (acres)", type: "number" },
                { key: "soil_type", label: "Soil Type", type: "select", options: SOIL_TYPES.map(s => ({ value: s, label: s })) },
                { key: "irrigation_type", label: "Irrigation Type", type: "select", options: IRRIGATION_TYPES },
                { key: "fertilizer_type", label: "Fertilizer Type", type: "select", options: FERTILIZER_TYPES },
                { key: "state", label: "State", type: "select", options: STATES.map(s => ({ value: s, label: s })) },
                { key: "season", label: "Season", type: "select", options: SEASONS.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })) },
              ].map(({ key, label, type, options }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {type === "select" ? (
                    <select value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-400 text-sm">
                      {options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input type="number" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} min="0.1" step="0.1" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-purple-400 text-sm" />
                  )}
                </div>
              ))}
              <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Simulating...</> : "📊 Run Simulation"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {!result && !loading && (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500">Set your farm parameters and run the simulation to see profit projections.</p>
            </div>
          )}
          {result && (
            <>
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Est. Yield", value: `${result.estimatedYield} qtl`, color: "bg-green-50 text-green-800", emoji: "🌾" },
                  { label: "Revenue", value: `₹${result.estimatedRevenue.toLocaleString()}`, color: "bg-blue-50 text-blue-800", emoji: "💰" },
                  { label: "Total Cost", value: `₹${result.totalCost.toLocaleString()}`, color: "bg-red-50 text-red-800", emoji: "📋" },
                  { label: "ROI", value: `${result.roi}%`, color: result.roi > 0 ? "bg-purple-50 text-purple-800" : "bg-orange-50 text-orange-800", emoji: result.roi > 0 ? "📈" : "📉" },
                ].map((kpi) => (
                  <div key={kpi.label} className={`${kpi.color} rounded-2xl p-4 border border-opacity-20 border-current`}>
                    <p className="text-2xl mb-1">{kpi.emoji}</p>
                    <p className="text-xs opacity-70 mb-1">{kpi.label}</p>
                    <p className="text-lg font-bold">{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Profit badge */}
              <div className={`rounded-2xl p-5 flex items-center justify-between ${result.profit >= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div>
                  <p className="text-sm text-gray-600">Net Profit ({result.landArea} acres of {result.crop})</p>
                  <p className={`text-3xl font-bold ${result.profit >= 0 ? "text-green-700" : "text-red-700"}`}>₹{Math.abs(result.profit).toLocaleString()}</p>
                </div>
                <span className="text-5xl">{result.profit >= 0 ? "🎉" : "⚠️"}</span>
              </div>

              {/* Charts */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 text-sm">Revenue vs Cost vs Profit</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                      <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]}>
                        {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-4 text-sm">Cost Breakdown</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">Expert Recommendations</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">✓</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
