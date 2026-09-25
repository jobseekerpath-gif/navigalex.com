import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, Shield, User, Bot, 
  ChevronDown, RefreshCw, ArrowRight, CheckCircle2, Lock 
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: {
    label: string;
    actionType: 'scanner' | 'cibil' | 'assessment';
    param?: string;
  };
}

interface LiveAdvisoryBotProps {
  onOpenAssessment: (concern?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export default function LiveAdvisoryBot({ onOpenAssessment, onNavigateTab }: LiveAdvisoryBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Namaste! I am the Navigalex Live Advisory Assistant. I help Indian business owners, promoters, and directors navigate hidden financial, contract, and banking risks. How can I assist your business today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/bot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history
        })
      });

      const data = await res.json();
      const botReply = data.reply || "I am here to guide you on financial controls, contracts, and banking credit readiness. Feel free to ask any specific business question.";

      // Determine contextual action button if relevant
      let action: Message['action'];
      const lower = textToSend.toLowerCase();
      if (lower.includes('contract') || lower.includes('clause') || lower.includes('agreement')) {
        action = { label: 'Test Live Contract Scanner', actionType: 'scanner' };
      } else if (lower.includes('bank') || lower.includes('loan') || lower.includes('dscr') || lower.includes('cibil')) {
        action = { label: 'Calculate Bank DSCR Now', actionType: 'cibil' };
      } else if (lower.includes('cfo') || lower.includes('sprint') || lower.includes('hire') || lower.includes('assessment')) {
        action = { label: 'Request Confidential Assessment', actionType: 'assessment', param: 'ControlCFO™ 30-Day Sprint' };
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Bot chat error:', err);
      const errorMessage: Message = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "Navigalex advisory desks protect businesses against contract liability, delayed receivables, and bank limit rejections. Would you like to request an assessment or try our free live scanners?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: { label: 'Request Confidential Assessment', actionType: 'assessment' }
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    if (action.actionType === 'scanner') {
      onNavigateTab('live-tools');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.actionType === 'cibil') {
      onNavigateTab('live-tools');
      setIsOpen(false);
      window.scrollTo({ top: 600, behavior: 'smooth' });
    } else if (action.actionType === 'assessment') {
      onOpenAssessment(action.param || 'Advisory Inquiry via Live Bot');
      setIsOpen(false);
    }
  };

  const quickPrompts = [
    "How does ControlCFO™ Sprint work?",
    "Why do banks reject CC limit renewals?",
    "How to screen customer contract traps?",
    "Prevent export LC payment disputes"
  ];

  // Clean Markdown & Bullet Formatter
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-0.5" />;
          
          const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
          const cleanLine = isBullet ? trimmed.replace(/^[\*\-•]\s*/, '') : trimmed;

          // Parse bold segments **word**
          const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
          const formatted = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5 my-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                <span className="text-slate-800">{formatted}</span>
              </div>
            );
          }

          return <p key={idx} className="text-slate-800">{formatted}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-['Inter']">
      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer border border-white/20 group"
          aria-label="Open Live Advisory Bot"
        >
          <div className="relative">
            <Shield className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold block leading-none">Live Advisory Bot</span>
            <span className="text-[10px] text-blue-100 block leading-tight mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online • Confidential
            </span>
          </div>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wide">NAVIGALEX LIVE BOT</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <span className="text-[10px] text-slate-300 block">Executive Advisory • AI & Senior Review</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] px-3 py-1 rounded-full bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-700 text-slate-700 font-medium transition-colors shrink-0 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 space-y-2 ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
                  }`}
                >
                  {m.sender === 'user' ? (
                    <p className="leading-relaxed whitespace-pre-line text-white font-medium">{m.text}</p>
                  ) : (
                    renderFormattedText(m.text)
                  )}
                  
                  {m.action && (
                    <div className="pt-1.5 border-t border-slate-100">
                      <button
                        onClick={() => handleActionClick(m.action)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer w-full justify-center"
                      >
                        <span>{m.action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] text-right ${
                      m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white rounded-2xl px-3.5 py-2.5 border border-slate-200 shadow-2xs flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Privacy Note */}
          <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-center gap-1.5 shrink-0">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Encrypted & Confidential under DPDP standards.</span>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about contracts, loans, CFO sprint..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition-colors disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
