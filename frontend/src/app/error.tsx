'use client';

import { useEffect } from 'react';
import { Button } from '@/components/common';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">¡Oops!</h1>
        <p className="text-lg text-slate-600 mb-6">
          Algo salió mal. Por favor, intenta de nuevo.
        </p>
        {error.message && (
          <p className="text-sm text-slate-500 mb-8 bg-slate-100 p-4 rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
            Intentar de nuevo
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            className="bg-slate-300 hover:bg-slate-400"
          >
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
