import { Link, useLocation } from "wouter";
import { 
  Leaf, Menu, Home, LayoutDashboard, Sprout, BarChart3, 
  MessageSquare, Mic, Bug, Store, Map, Newspaper, X
} from "lucide-react";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crops", label: "Crops", icon: Sprout },
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/pest-camera", label: "Pest Cam", icon: Bug },
  { href: "/farmer-market", label: "Buy/Sell", icon: Store },
  { href: "/voice-assistant", label: "Voice", icon: Mic },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Krishi<span className="text-primary">Copilot</span> AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.slice(0, 5).map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  location === item.href 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-32">
              <Select defaultValue="en">
                <SelectTrigger className="h-9 border-border/50 bg-muted/30">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-background z-50 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-display font-bold text-xl">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-4 rounded-xl flex items-center gap-3 font-medium transition-colors ${
                      location === item.href 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'bg-muted/30 text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {children}
      </main>

      <FloatingChatbot />
    </div>
  );
}
