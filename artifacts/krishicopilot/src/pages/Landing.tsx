import { Link } from "wouter";
import { Leaf, Cloud, BarChart2, Bug, ShoppingBag, Map, Mic, Newspaper, ArrowRight, TrendingUp, Shield, Users } from "lucide-react";

const FEATURES = [
  { icon: <Cloud className="w-6 h-6" />, title: "Smart Weather Alerts", desc: "Rain, drought, heat stress, and flood warnings powered by real-time data.", href: "/", color: "blue", emoji: "🌦️" },
  { icon: <Leaf className="w-6 h-6" />, title: "AI Crop Advisor", desc: "Get personalized crop recommendations based on your soil, season, and location.", href: "/crops", color: "green", emoji: "🌾" },
  { icon: <BarChart2 className="w-6 h-6" />, title: "Market Intelligence", desc: "Real mandi prices, 10-day predictions, and best market suggestions near you.", href: "/market", color: "orange", emoji: "📊" },
  { icon: <Bug className="w-6 h-6" />, title: "Pest Detection", desc: "Scan your crops with camera and get instant AI pest detection and treatment advice.", href: "/pest-camera", color: "red", emoji: "🔬" },
  { icon: <ShoppingBag className="w-6 h-6" />, title: "Farmer Marketplace", desc: "Sell your produce directly to buyers. No middlemen, better prices.", href: "/farmer-market", color: "purple", emoji: "🛒" },
  { icon: <Map className="w-6 h-6" />, title: "Land Marketplace", desc: "Buy, rent, sell or lease farm land across India with verified listings.", href: "/land-marketplace", color: "teal", emoji: "🗺️" },
  { icon: <Mic className="w-6 h-6" />, title: "Voice Assistant", desc: "Talk in Hindi, Marathi, or English. Get farming advice by voice.", href: "/voice-assistant", color: "yellow", emoji: "🎤" },
  { icon: <Newspaper className="w-6 h-6" />, title: "Agri News & Schemes", desc: "Latest agriculture news and government schemes for farmers.", href: "/agri-news", color: "indigo", emoji: "📰" },
];

const STATS = [
  { label: "Active Farmers", value: "2.5 Lakh+", icon: <Users className="w-5 h-5" /> },
  { label: "Mandi Prices Tracked", value: "5000+", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Crop Varieties", value: "200+", icon: <Leaf className="w-5 h-5" /> },
  { label: "Success Rate", value: "94%", icon: <Shield className="w-5 h-5" /> },
];

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
  green: "bg-green-50 text-green-600 group-hover:bg-green-100",
  orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
  red: "bg-red-50 text-red-600 group-hover:bg-red-100",
  purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
  teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-100",
  yellow: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100",
  indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",
};

export default function Landing({ t }: { t: (k: string) => string }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #14532d 0%, #166534 35%, #15803d 70%, #16a34a 100%)" }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: "3s" }}>🌾</div>
        <div className="absolute bottom-20 right-10 text-5xl opacity-20 animate-bounce" style={{ animationDuration: "4s" }}>🌱</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20 animate-bounce" style={{ animationDuration: "5s" }}>🌿</div>
        <div className="absolute bottom-40 left-20 text-4xl opacity-15 animate-bounce" style={{ animationDuration: "3.5s" }}>🚜</div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Leaf className="w-4 h-4 text-green-300" />
            <span className="text-sm text-green-100">AI-Powered Agriculture Platform for India</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">KrishiCopilot</span>
            <span className="text-green-300"> AI</span>
          </h1>
          <p className="text-2xl md:text-3xl text-green-100 mb-4 font-light">
            {t("tagline")}
          </p>
          <p className="text-lg text-green-200 mb-10 max-w-2xl mx-auto">
            Empowering 140 million Indian farmers with AI-driven crop advice, real-time market intelligence, pest detection, and voice assistance in 8 languages.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/crops"
              className="group bg-white text-green-700 font-bold px-8 py-4 rounded-2xl hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2">
              {t("get_started")} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/chatbot"
              className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2">
              🤖 Talk to KrishiBot
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex items-center justify-center mb-2 text-green-300">{s.icon}</div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-green-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything a Farmer Needs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">From weather alerts to market prices — KrishiCopilot AI is your complete farming partner.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <Link key={f.href} href={f.href}>
                <div className="group bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer feature-card-hover shadow-sm hover:border-green-200 h-full">
                  <div className="text-3xl mb-3">{f.emoji}</div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${COLOR_MAP[f.color]}`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-800 to-green-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
        <p className="text-green-100 mb-8 text-lg">Join thousands of farmers using AI to make smarter decisions</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/crops" className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg">
            Get Crop Recommendations
          </Link>
          <Link href="/agri-news" className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
            View Government Schemes
          </Link>
        </div>
      </section>
    </div>
  );
}
