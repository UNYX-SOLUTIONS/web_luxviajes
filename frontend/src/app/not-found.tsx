import Link from 'next/link';
import { Button } from '@/components/common';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-lg text-slate-600 mb-2">Página no encontrada</p>
        <p className="text-slate-500 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
