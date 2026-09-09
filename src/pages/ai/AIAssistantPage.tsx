import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button, PageHeader } from '../../components/shared';
import type { ConversationMessage } from '../../types';
import { clsx } from 'clsx';

// ============================================================
// AI / IVR ASSISTANT PAGE
// ============================================================
export const AIAssistantPage: React.FC = () => {
  const { goBack } = useAppStore();
  const [screen, setScreen] = useState<'call' | 'language' | 'chat' | 'done'>('call');
  const [language, setLanguage] = useState('');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [tokenSent, setTokenSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined conversation flow
  const conversationFlow = [
    { assistant: 'Namaste! I am Krishi Setu AI assistant. What crop are you taking for procurement today?' },
    { user: 'Paddy', assistant: 'How many bags of paddy do you have?' },
    { user: '60 bags', assistant: 'Your nearest open centre is Centre A — Hanamkonda, 7.2 km away. Current wait time is approximately 45 minutes. There is also Centre C — Narsampet, 15.6 km away with only 18 farmers waiting (30–40 min). Which centre would you like to visit?' },
    { user: 'Centre A', assistant: 'Great! Available slots at Centre A today:\n• 10:00 AM–11:00 AM (12 available)\n• 11:00 AM–12:00 PM (8 available)\n• 12:00 PM–1:00 PM (16 available)\n\nShall I book the 11:00 AM slot for you?' },
    { user: 'Yes', assistant: 'Your token is A104 for Centre A on 28 May 2024, slot 11:00 AM–12:00 PM. Estimated wait: 35–50 minutes.\n\nShall I send your token via SMS or WhatsApp?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const addMessage = (role: 'assistant' | 'user', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      text,
      timestamp: new Date(),
    }]);
  };

  const startConversation = (lang: string) => {
    setLanguage(lang);
    setScreen('chat');
    setTimeout(() => {
      addMessage('assistant', conversationFlow[0].assistant);
      setStep(0);
    }, 500);
  };

  const handleSend = async (text?: string) => {
    const input = text || userInput.trim();
    if (!input) return;

    setUserInput('');
    addMessage('user', input);
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200));
    setIsTyping(false);

    const nextStep = step + 1;
    if (nextStep < conversationFlow.length) {
      const flow = conversationFlow[nextStep];
      addMessage('assistant', flow.assistant);
      setStep(nextStep);
    } else if (nextStep === conversationFlow.length) {
      // Final step - token confirmation
      if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('sms') || input.toLowerCase().includes('whatsapp')) {
        addMessage('assistant', '✅ Token A104 has been sent to your mobile number +91 98765 43210 via SMS. You can also view it in the app under "Track" tab.\n\nIs there anything else I can help you with?');
        setTokenSent(true);
      } else {
        addMessage('assistant', 'No problem! You can view your token anytime in the Krishi Setu app. Is there anything else?');
      }
      setStep(nextStep);
    } else {
      addMessage('assistant', 'Thank you for using Krishi Setu AI Assistant! You can also call 1800-XXX-XXXX for voice support in Telugu, Hindi, or English. Have a successful procurement! 🌾');
    }
  };

  // ---- Call Screen ----
  if (screen === 'call') {
    return (
      <div className="flex flex-col bg-white min-h-screen">
        <PageHeader title="AI / IVR Assistant" onBack={goBack} />

        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* Phone animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div className="absolute inset-0 bg-[#22863A]/20 rounded-full animate-ping" />
          </div>

          <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">AI / IVR Access</h2>
          <p className="text-gray-500 text-sm mb-2">Voice & Chat Assistant for Farmers</p>

          <div className="bg-[#E8F5E9] rounded-2xl px-6 py-3 mb-8">
            <p className="text-xs text-gray-500 mb-1">Call us free at</p>
            <p className="text-2xl font-extrabold text-[#22863A]">1800-XXX-XXXX</p>
            <p className="text-xs text-gray-400">Available 24/7 · Free for all farmers</p>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Or use our AI Chat Assistant below for instant help
          </p>

          <Button onClick={() => setScreen('language')} size="lg">
            Start AI Chat
          </Button>
        </div>
      </div>
    );
  }

  // ---- Language Screen ----
  if (screen === 'language') {
    const languages = [
      { code: 'te', label: 'Telugu', native: 'తెలుగు' },
      { code: 'hi', label: 'Hindi', native: 'हिंदी' },
      { code: 'en', label: 'English', native: 'English' },
      { code: 'other', label: 'Other', native: 'अन्य / ఇతర' },
    ];

    return (
      <div className="flex flex-col bg-white min-h-screen">
        <PageHeader title="Select Language" onBack={() => setScreen('call')} />

        <div className="flex-1 flex flex-col px-6 py-8">
          <p className="text-xl font-bold text-[#1B5E20] mb-1">Choose Your Language</p>
          <p className="text-gray-500 text-sm mb-8">మీ భాషను ఎంచుకోండి / अपनी भाषा चुनें</p>

          <div className="grid grid-cols-2 gap-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => startConversation(lang.label)}
                className={clsx(
                  'rounded-2xl p-4 border-2 text-center transition-all active:scale-[0.98]',
                  'border-gray-200 hover:border-[#22863A] hover:bg-[#E8F5E9]'
                )}
              >
                <p className="font-bold text-gray-800 text-lg">{lang.native}</p>
                <p className="text-xs text-gray-500 mt-1">{lang.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---- Chat Screen ----
  const quickReplies = step < conversationFlow.length
    ? getQuickReplies(step)
    : ['Thank you!', 'Book another slot'];

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <PageHeader
        title="AI Assistant"
        subtitle={`Language: ${language}`}
        onBack={() => setScreen('language')}
        rightAction={
          <div className="flex items-center gap-1.5 bg-[#E8F5E9] px-2 py-1 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-[#22863A] font-medium">Live</span>
          </div>
        }
      />

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-[#22863A] rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
            )}
            <div className={clsx(
              'max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line',
              msg.role === 'user'
                ? 'bg-[#22863A] text-white rounded-tr-sm'
                : 'bg-gray-100 text-gray-800 rounded-tl-sm'
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#22863A] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {tokenSent && (
          <div className="bg-[#E8F5E9] border border-[#C8E6C9] rounded-2xl p-3 mx-2">
            <p className="text-xs font-semibold text-[#1B5E20] mb-1">Token Sent via SMS ✓</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#22863A] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A104</span>
              </div>
              <div>
                <p className="text-xs text-gray-600">Centre A · 11:00 AM–12:00 PM</p>
                <p className="text-xs text-gray-600">28 May 2024</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {messages.length > 0 && !isTyping && quickReplies.length > 0 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {quickReplies.map(reply => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="flex-shrink-0 bg-[#E8F5E9] text-[#22863A] text-xs font-medium px-3 py-2 rounded-full border border-[#C8E6C9]"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#22863A]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!userInput.trim() && !isTyping}
          className="w-10 h-10 bg-[#22863A] rounded-xl flex items-center justify-center disabled:opacity-50 flex-shrink-0"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

function getQuickReplies(step: number): string[] {
  const replies: Record<number, string[]> = {
    0: ['Paddy', 'Wheat', 'Cotton'],
    1: ['60 bags', '100 bags', '30 bags'],
    2: ['Centre A', 'Centre C'],
    3: ['Yes, book 11 AM', 'Show all slots', '12 PM slot'],
    4: ['Yes', 'Send via SMS', 'Send via WhatsApp'],
  };
  return replies[step] ?? [];
}
