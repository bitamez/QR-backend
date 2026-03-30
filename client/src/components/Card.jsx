import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-slate-900 rounded-lg shadow-sm border border-slate-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, className = '' }) {
  return (
    <div className={`p-5 border-b border-slate-800 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}
