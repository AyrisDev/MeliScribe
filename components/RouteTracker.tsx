'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    plausible?: {
      (...args: unknown[]): void;
      q?: unknown[];
    };
  }
}

const RouteTracker = () => {
    const pathname = usePathname();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            window.plausible = window.plausible || function(...args: unknown[]) {
                (window.plausible!.q = window.plausible!.q || []).push(args);
            };
            initialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (initialized.current && window.plausible) {
            window.plausible('pageview', {
                url: window.location.href
            });
        }
    }, [pathname]);

    return null;
};

export default RouteTracker;
