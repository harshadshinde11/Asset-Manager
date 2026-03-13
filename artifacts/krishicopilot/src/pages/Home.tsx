import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sprout, CloudSun, Map, BarChart3, ShieldCheck, Store, Bug, Mic } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: CloudSun, title: "Weather Alerts", desc: "Real-time AI alerts for rain, drought, and floods.", href: "/dashboard", color: "bg-blue-500/10 text-blue-500" },
  { icon: Sprout, title: "Crop Recommendations", desc: "Know exactly what to plant based on your soil and season.", href: "/crops", color: "bg-primary/10 text-primary" },
  { icon: BarChart3, title: "Market Intelligence", desc: "Live mandi prices and 10-day price predictions.", href: "/market", color: "bg-secondary/10 text-secondary" },
  { icon: Bug, title: "Pest Detection", desc: "Snap a photo to identify pests and get organic treatments.", href: "/pest-camera", color: "bg-destructive/10 text-destructive" },
  { icon: Store, title: "Farmer Marketplace", desc: "Sell directly to buyers with zero middleman fees.", href: "/farmer-market", color: "bg-orange-500/10 text-orange-500" },
  { icon: Map, title: "Land Marketplace", desc: "Buy, sell, or lease agricultural land easily.", href: "/land-marketplace", color: "bg-emerald-500/10 text-emerald-500" },
  { icon: ShieldCheck, title: "Farm Simulation", desc: "Calculate expected yield, revenue, and ROI before planting.", href: "/simulate", color: "bg-purple-500/10 text-purple-500" },
  { icon: Mic, title: "Voice Assistant", desc: "Talk to Krishi AI in your local language seamlessly.", href: "/voice-assistant", color: "bg-pink-500/10 text-pink-500" },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <section className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Lush green farms" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-16 max-w-2xl text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-md mb-6">
              <span className="flex w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-green-100">Live AI Assistant for Farmers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Farming made <span className="text-primary-foreground bg-primary px-2 rounded-lg">Smart</span> & Simple.
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
              Empowering Indian farmers with AI-driven weather alerts, crop recommendations, pest detection, and market insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="inline-flex">
                <Button size="lg" className="rounded-xl px-8 h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/voice-assistant" className="inline-flex">
                <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-lg font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-md">
                  <Mic className="mr-2 w-5 h-5" /> Try Voice AI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">Everything your farm needs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From planning the right crop to selling it at the best price, KrishiCopilot AI is with you at every step of the journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={f.href}>
                <Card className="h-full p-6 hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer group bg-card">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
