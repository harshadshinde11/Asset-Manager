import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Leaf, ChevronDown } from "lucide-react";
import { LANGUAGES, Language } from "@/lib/translations";

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  t: (k: string) => string;
}

const NAV_LINKS = [
  { href: "/", label: "dashboard" },
  { href: "/crops", label: "crops" },
  { href: "/simulate", label: "simulate" },
  { href: "/market", label: "market" },
  { href: "/agri-news", label: "news" },
];

const MORE_LINKS = [
  { href: "/pest-camera", label: "pest" },
  { href: "/chatbot", label: "chatbot" },
  { href: "/voice-assistant", label: "voice" },
  { href: "/farmer-market", label: "farmer_market" },
  { href: "/land-marketplace", label: "land" },
  { href: "/nearby-shops", label: "shops" },
  { href: "/fertilizer-shops", label: "fertilizer_shops" },
  { href: "/biofertilizer-guide", label: "biofertilizer" },
];

export default function Navbar({ lang, setLang, t }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-green-800 text-lg leading-none block">KrishiCopilot</span>
              <span className="text-xs text-green-600 leading-none">AI Assistant</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location === l.href ? "bg-green-100 text-green-800" : "text-gray-600 hover:text-green-700 hover:bg-green-50"}`}>
                {t(l.label)}
              </Link>
            ))}
            {/* More dropdown */}
            <div className="relative">
              <button onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors">
                More <ChevronDown className="w-3 h-3" />
              </button>
              {moreOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-green-100 rounded-xl shadow-xl z-50 py-1" onMouseLeave={() => setMoreOpen(false)}>
                  {MORE_LINKS.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                      {t(l.label)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-green-200 rounded-lg text-sm text-green-700 hover:bg-green-50 transition-colors">
                🌐 {LANGUAGES[lang].split(" ")[0]}
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-green-100 rounded-xl shadow-xl z-50 py-1" onMouseLeave={() => setLangOpen(false)}>
                  {(Object.entries(LANGUAGES) as [Language, string][]).map(([code, name]) => (
                    <button key={code} onClick={() => { setLang(code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang === code ? "bg-green-50 text-green-700 font-medium" : "text-gray-700 hover:bg-green-50"}`}>
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Mobile menu btn */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-green-100">
            {[...NAV_LINKS, ...MORE_LINKS].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg mb-0.5 transition-colors ${location === l.href ? "bg-green-100 text-green-800" : "text-gray-700 hover:bg-green-50"}`}>
                {t(l.label)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
