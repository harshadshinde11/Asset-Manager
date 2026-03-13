import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Language, translate } from "@/lib/translations";
import { api } from "@/lib/api";

import Navbar from "@/components/Navbar";
import FloatingChat from "@/components/FloatingChat";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CropsPage from "@/pages/Crops";
import SimulatePage from "@/pages/Simulate";
import MarketPage from "@/pages/Market";
import ChatbotPage from "@/pages/Chatbot";
import VoiceAssistantPage from "@/pages/VoiceAssistant";
import PestCameraPage from "@/pages/PestCamera";
import FarmerMarketPage from "@/pages/FarmerMarket";
import LandMarketplacePage from "@/pages/LandMarketplace";
import NearbyShopsPage from "@/pages/NearbyShops";
import FertilizerShopsPage from "@/pages/FertilizerShops";
import BiofertilizerGuidePage from "@/pages/BiofertilizerGuide";
import AgriNewsPage from "@/pages/AgriNews";

const queryClient = new QueryClient();

function Router({ t }: { t: (k: string) => string }) {
  return (
    <Switch>
      <Route path="/" component={() => <Landing t={t} />} />
      <Route path="/dashboard" component={() => <Dashboard t={t} />} />
      <Route path="/crops" component={() => <CropsPage t={t} />} />
      <Route path="/simulate" component={() => <SimulatePage t={t} />} />
      <Route path="/market" component={() => <MarketPage t={t} />} />
      <Route path="/chatbot" component={() => <ChatbotPage t={t} />} />
      <Route path="/voice-assistant" component={() => <VoiceAssistantPage t={t} />} />
      <Route path="/pest-camera" component={() => <PestCameraPage t={t} />} />
      <Route path="/farmer-market" component={() => <FarmerMarketPage t={t} />} />
      <Route path="/land-marketplace" component={() => <LandMarketplacePage t={t} />} />
      <Route path="/nearby-shops" component={() => <NearbyShopsPage t={t} />} />
      <Route path="/fertilizer-shops" component={() => <FertilizerShopsPage t={t} />} />
      <Route path="/biofertilizer-guide" component={() => <BiofertilizerGuidePage t={t} />} />
      <Route path="/agri-news" component={() => <AgriNewsPage t={t} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [lang, setLang] = useState<Language>("en");
  const t = (k: string) => translate(k, lang);

  useEffect(() => {
    api.get<{ language: Language }>("/language/preference").then((r) => { if (r.language) setLang(r.language); }).catch(() => {});
  }, []);

  function handleSetLang(l: Language) {
    setLang(l);
    api.post("/language/preference", { language: l }).catch(() => {});
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Navbar lang={lang} setLang={handleSetLang} t={t} />
          <Router t={t} />
          <FloatingChat t={t} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
