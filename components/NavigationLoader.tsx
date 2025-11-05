"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import GlobalLoader from './GlobalLoader';

export default function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const mountedRef = useRef(false);

    // Show loader when pathname or search params changes (client navigation).
    // We hide the loader after a short delay so it doesn't flash for very fast navigations.
    useEffect(() => {
        // On the very first render, don't show the loader (initial mount).
        if (!mountedRef.current) {
            mountedRef.current = true;
            return;
        }

        // Navigation completed — hide loader immediately.
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams?.toString()]);

    // Start loading immediately when the user clicks a link or when history API is used.
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const anchor = target.closest('a') as HTMLAnchorElement | null;
            if (!anchor) return;
            // only handle same-origin navigations that are likely app navigations
            try {
                const url = new URL(anchor.href);
                if (url.origin !== location.origin) return;
                if (anchor.target === '_blank' || anchor.hasAttribute('download') || anchor.getAttribute('rel') === 'external') return;
                // if it's a different pathname/search, consider it a navigation
                if (url.pathname !== location.pathname || url.search !== location.search) {
                    setIsLoading(true);
                }
            } catch (err) {
                // malformed URL, ignore
            }
        };

        const origPush = (history as any).pushState;
        const origReplace = (history as any).replaceState;

        (history as any).pushState = function (...args: any[]) {
            origPush.apply(this, args);
            setIsLoading(true);
            return;
        };

        (history as any).replaceState = function (...args: any[]) {
            origReplace.apply(this, args);
            setIsLoading(true);
            return;
        };

        const onPop = () => setIsLoading(true);

        document.addEventListener('click', onDocClick, true);
        window.addEventListener('popstate', onPop);

        return () => {
            document.removeEventListener('click', onDocClick, true);
            window.removeEventListener('popstate', onPop);
            // restore history methods
            (history as any).pushState = origPush;
            (history as any).replaceState = origReplace;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // lock scrolling while loading
    useEffect(() => {
        if (isLoading) document.documentElement.style.overflow = 'hidden';
        else document.documentElement.style.overflow = '';
        return () => {
            document.documentElement.style.overflow = '';
        };
    }, [isLoading]);

    if (!isLoading) return null;

    return <GlobalLoader />;
}
