import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/Card';
import { Star, ShieldCheck, Mail, AlertCircle, CheckCircle2, User, Phone } from 'lucide-react';
import api from '../api';

export function CustomerScan() {
  const { qrUrl } = useParams();
  const [branchInfo, setBranchInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [comments, setComments] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    // Generate device hash if missing
    if (!localStorage.getItem('device_hash')) {
       localStorage.setItem('device_hash', 'DEV-' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36));
    }
    
    // Use a default slug if none provided
    const targetUrl = qrUrl || 'branch-wollo-main';

    // Dynamically fetch branch info from the backend
    api.get(`/feedback/qr/${targetUrl}`)
      .then((res) => {
        setBranchInfo({
          name: res.data.branch_name || 'System Branch',
          location: res.data.location || 'Local Site'
        });
        setLoading(false);
      })
      .catch((err) => {
         console.error(err);
         // Fallback rendering
         setBranchInfo({ name: 'System Kiosk', location: 'Unknown' });
         setLoading(false);
      });
  }, [qrUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating before submitting.');
      return;
    }
    setError('');
    
    // Safety slug for submitting!
    const targetUrl = qrUrl || 'branch-wollo-main';
    const deviceHash = localStorage.getItem('device_hash');

    // Post directly to the PostgreSQL database!
    api.post(`/feedback/submit/${targetUrl}`, { rating, comments, contactInfo, deviceHash })
      .then((res) => {
        setSubmitted(true);
      })
      .catch((err) => {
        setError('Server failed to record feedback. Try again.');
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-900/20 border border-green-800 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Thank you!</h2>
        <p className="text-slate-400 mb-8 max-w-sm">Your feedback helps us continuously improve our services at {branchInfo.name}.</p>
        <button onClick={() => window.close()} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg font-medium transition-colors">Close Window</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full mx-auto mt-4 sm:mt-12">
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900/30 border border-blue-800 text-blue-500 mb-4 shadow-lg shadow-blue-900/20">
             <ShieldCheck className="w-6 h-6" />
           </div>
           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{branchInfo.name}</h1>
           <p className="text-slate-400 text-sm">{branchInfo.location} • Customer Survey</p>
        </div>

        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating System */}
              <div className="space-y-3 pb-6 border-b border-slate-800">
                <label className="block text-sm font-semibold text-center text-slate-300">How was your experience today?</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setRating(star)} 
                      className={`p-2 transition-transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-yellow-500' : 'text-slate-700'}`}
                    >
                      <Star className="w-10 h-10 fill-current" />
                    </button>
                  ))}
                </div>
                {error && <p className="text-red-400 text-xs text-center flex items-center justify-center gap-1 mt-2"><AlertCircle className="w-3 h-3"/> {error}</p>}
              </div>

              {/* Text Feedback */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Additional Comments <span className="text-slate-600">(Optional)</span></label>
                <textarea 
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Tell us exactly what you loved or what we can do better..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none h-32"
                />
              </div>

              {/* Contact Info (Required) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact Detail <span className="text-red-500">*</span></label>
                
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="email" 
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Enter email for follow-up" 
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                Submit Secure Feedback
              </button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-xs text-slate-600 mt-8">Protected by Enterprise QR Feedback</p>
      </div>
    </div>
  );
}
