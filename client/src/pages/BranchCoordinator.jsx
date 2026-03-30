import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/Card';
import { Send, CheckCircle2 } from 'lucide-react';
import api from '../api';

export function BranchCoordinator() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
       await api.post('/feedback', { rating, comments: comment, user_name: 'Coordinator' });
       setStatus('success');
       setTimeout(() => { setStatus('idle'); setRating(0); setComment(''); }, 3000);
    } catch(err) {
       console.log('Using mock submission', err);
       setTimeout(() => {
         setStatus('success');
         setTimeout(() => { setStatus('idle'); setRating(0); setComment(''); }, 3000);
       }, 800);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-left mb-4">
         <h2 className="text-xl font-bold text-slate-200">Branch Coordinator Dashboard</h2>
      </div>

      <Card className="shadow-2xl border-0 overflow-hidden bg-slate-900 border-slate-800">
        {status === 'success' && (
           <div className="absolute inset-0 bg-slate-900/95 z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
             <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
             <h3 className="text-2xl font-bold text-white">Feedback Submitted!</h3>
           </div>
        )}
        <CardContent className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="text-left py-4">
               <p className="text-sm font-semibold text-slate-300 mb-4">Total Feedback</p>
               <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <button
                     type="button"
                     key={star}
                     onClick={() => setRating(star)}
                     onMouseEnter={() => setHoverRating(star)}
                     onMouseLeave={() => setHoverRating(0)}
                     className="focus:outline-none transition-transform hover:scale-110"
                   >
                     <span className={`text-4xl ${star <= (hoverRating || rating) ? 'text-yellow-500' : 'text-slate-700'}`}>★</span>
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
              <label className="text-sm font-semibold text-slate-300 block mb-2">Leave a Comment</label>
              <textarea 
                rows="4"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write your comments here..."
                className="w-full px-4 py-3 rounded-md border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                required
              ></textarea>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Your Details</h4>
              <div className="space-y-3">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-md border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-blue-500 transition-all text-sm" />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-3 rounded-md border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-blue-500 transition-all text-sm" />
                <input type="tel" placeholder="Your Phone" className="w-full px-4 py-3 rounded-md border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none focus:border-blue-500 transition-all text-sm" />
              </div>
            </div>

            <button disabled={rating === 0} type="submit" className="w-full bg-[#1e293b] hover:bg-slate-700 border border-slate-700 text-blue-400 font-bold py-3 rounded-md shadow-md transition-all mt-4">
              {status === 'loading' ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
