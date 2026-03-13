import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CloudRain, Wind, Droplets, AlertTriangle, MapPin, RefreshCw, Leaf, BarChart2, Bug, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface WeatherDay { date: string; day: string; maxTemp: number; minTemp: number; precipitation: number; humidity: number; windSpeed: number; condition: string; icon: string; }
interface WeatherAlert { type: string; severity: string; message: string; icon: string; }
interface WeatherData { location: string; current: WeatherDay; forecast: WeatherDay[]; alerts: WeatherAlert[]; }

const ALERT_COLORS: Record<string, string> = {
  rain_alert: "bg-blue-50 border-blue-200 text-blue-800",
  drought_risk: "bg-orange-50 border-orange-200 text-orange-800",
  heat_stress: "bg-red-50 border-red-200 text-red-800",
  flood_risk: "bg-indigo-50 border-indigo-200 text-indigo-800",
};
const SEVERITY_BADGE: Record<string, string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };

export default function Dashboard({ t }: { t: (k: string) => string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Pune, Maharashtra");

  async function fetchWeather() {
    setLoading(true);
    try { const data = await api.get<WeatherData>(`/weather?location=${encodeURIComponent(location)}`); setWeather(data); }
    catch { } finally { setLoading(false); }
  }
  useEffect(() => { fetchWeather(); }, []);

  const QUICK_LINKS = [
    { href: "/crops", label: "Crop Advisor 🌾", color: "from-green-500 to-green-600" },
    { href: "/market", label: "Market Prices 📊", color: "from-blue-500 to-blue-600" },
    { href: "/pest-camera", label: "Pest Scanner 🔬", color: "from-red-500 to-red-600" },
    { href: "/simulate", label: "Farm Simulator 📈", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🌾 Farming Dashboard</h1>
        <p className="text-gray-500 mt-1">Your daily agriculture intelligence hub</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_LINKS.map((ql) => (
          <Link key={ql.href} href={ql.href}>
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${ql.color} cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center font-semibold text-white shadow-md text-sm`}>
              {ql.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <MapPin className="w-4 h-4 text-green-600" />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location..." className="flex-1 outline-none text-sm text-gray-700" onKeyDown={(e) => e.key === "Enter" && fetchWeather()} />
        </div>
        <button onClick={fetchWeather} disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Update
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-green-600"><RefreshCw className="w-6 h-6 animate-spin inline mr-2" />Loading weather...</div>
      ) : weather ? (
        <>
          {weather.alerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> Weather Alerts</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {weather.alerts.map((alert, i) => (
                  <div key={i} className={`border rounded-xl p-4 ${ALERT_COLORS[alert.type] || "bg-gray-50 border-gray-200 text-gray-800"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl">{alert.icon}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_BADGE[alert.severity]}`}>{alert.severity}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl p-5 shadow-md">
              <p className="text-green-200 text-sm mb-1">{weather.location}</p>
              <div className="text-4xl mb-1">{weather.current.icon}</div>
              <p className="text-3xl font-bold">{weather.current.maxTemp}°C</p>
              <p className="text-green-200 text-sm">{weather.current.condition}</p>
            </div>
            {[
              { icon: "🌧️", label: "Precipitation", value: `${weather.current.precipitation} mm`, bg: "bg-blue-50 text-blue-800" },
              { icon: "💧", label: "Humidity", value: `${weather.current.humidity}%`, bg: "bg-cyan-50 text-cyan-800" },
              { icon: "💨", label: "Wind Speed", value: `${weather.current.windSpeed} km/h`, bg: "bg-gray-50 text-gray-800" },
            ].map((card) => (
              <div key={card.label} className={`${card.bg} rounded-2xl p-5 border border-gray-100`}>
                <div className="text-2xl mb-2">{card.icon}</div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">7-Day Temperature & Rainfall Forecast</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weather.forecast}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} /><stop offset="95%" stopColor="#16a34a" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="t" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area yAxisId="t" type="monotone" dataKey="maxTemp" stroke="#16a34a" fill="url(#g1)" name="Temp (°C)" />
                <Area yAxisId="r" type="monotone" dataKey="precipitation" stroke="#3b82f6" fill="url(#g2)" name="Rain (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Daily Forecast</h2>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {weather.forecast.map((day, i) => (
                <div key={i} className={`text-center p-3 rounded-xl ${i === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
                  <p className="text-xs font-semibold text-gray-600">{day.day}</p>
                  <p className="text-xl my-1">{day.icon}</p>
                  <p className="text-sm font-bold text-gray-800">{Math.round(day.maxTemp)}°</p>
                  <p className="text-xs text-gray-400">{Math.round(day.minTemp)}°</p>
                  <p className="text-xs text-blue-500">{day.precipitation}mm</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">Failed to load weather data.</div>
      )}
    </div>
  );
}
