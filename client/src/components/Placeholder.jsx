import React from 'react';
import { Card, CardContent } from './Card';
import { Construction } from 'lucide-react';

export function Placeholder({ moduleName }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <Card className="bg-slate-900 border-slate-800 shadow-2xl p-10 max-w-md w-full">
        <CardContent className="flex flex-col items-center">
          <Construction className="w-16 h-16 text-blue-500 mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-slate-200 mb-2">{moduleName} Module</h2>
          <p className="text-slate-400">This module is currently under development. The backend APIs exist but the UI component is coming in the next iteration!</p>
        </CardContent>
      </Card>
    </div>
  );
}
