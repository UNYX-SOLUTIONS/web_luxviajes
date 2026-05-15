// KommoChat.tsx
import { useEffect } from 'react';

type KommoPlugin = {
  id: string;
  hash: string;
  locale: string;
  params?: Record<string, unknown>[];
  setMeta: (p: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    crm_plugin?: KommoPlugin;
    crmPlugin?: {
      q?: unknown[];
    } & ((...args: unknown[]) => void);
  }
}

export default function KommoChat() {
  useEffect(() => {
    if (document.getElementById('crm_plugin_script')) return;

    window.crm_plugin = {
      id: '1073611',
      hash: 'a854219fee0548c732e3640e482e6742696e175500e3be60835f2d6c6f99fedc',
      locale: 'es',
      setMeta(p: Record<string, unknown>) {
        this.params = (this.params || []).concat([p]);
      },
    };

    window.crmPlugin =
      window.crmPlugin ||
      ((...args: unknown[]) => {
        window.crmPlugin!.q = window.crmPlugin!.q || [];
        window.crmPlugin!.q!.push(args);
      });

    const script = document.createElement('script');
    script.async = true;
    script.id = 'crm_plugin_script';
    script.src = 'https://gso.kommo.com/js/button.js';

    document.head.appendChild(script);
  }, []);

  return null;
}