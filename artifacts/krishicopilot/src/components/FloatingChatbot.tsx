import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatSession } from "@/hooks/use-chat-session";
import { AnimatePresence, motion } from "framer-motion";

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, isSending, send } = useChatSession("floating-widget");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    send(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 origin-bottom-right"
          >
            <Card className="w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden shadow-2xl border-primary/20">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-primary-foreground flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold">Krishi AI Assistant</h3>
                    <p className="text-xs text-primary-foreground/80">Always here to help</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <ScrollArea className="flex-1 p-4 bg-muted/30" viewportRef={scrollRef}>
                <div className="space-y-4 pb-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground p-6 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm">Hi! Ask me anything about crops, weather, or market prices.</p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-card border shadow-sm rounded-tl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-card border shadow-sm p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-3 bg-background border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..." 
                    className="rounded-full bg-muted/50 border-transparent focus-visible:ring-primary/20"
                    disabled={isSending}
                  />
                  <Button type="submit" size="icon" className="rounded-full shrink-0 shadow-md" disabled={!input.trim() || isSending}>
                    <Send className="w-4 h-4 ml-0.5" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="w-14 h-14 rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>
    </div>
  );
}
