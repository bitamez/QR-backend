import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export function InstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [iosDismissed, setIosDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    
    // Detect iOS Safari
    const ua = navigator.userAgent;
    const ios = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
    setIsIOS(ios);
    if (ios) {
      setVisible(true);
      return;
    }

    // Android / Chrome install prompt
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
  };

  if (!visible || iosDismissed) return null;

  if (isIOS) {
    return (
      <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-800 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100">Install QR Feedback</p>
            <p className="text-xs text-slate-400 mt-0.5">Tap <strong className="text-slate-300">Share</strong> then <strong className="text-slate-300">Add to Home Screen</strong> to install this app.</p>
          </div>
          <button onClick={() => setIosDismissed(true)} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="bg-slate-800 border border-blue-900/50 rounded-2xl p-4 shadow-2xl shadow-blue-900/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-900/30 border border-blue-800 flex items-center justify-center shrink-0">
          <Download className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100">Install as App</p>
          <p className="text-xs text-slate-400">Works offline. Add to home screen.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setVisible(false)} className="text-slate-500 hover:text-slate-300 p-1">
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={handleInstall}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
