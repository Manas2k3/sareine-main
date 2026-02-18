"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface SiteSettingsContextValue {
    preorderEnabled: boolean;
    announcementText: string;
    loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
    preorderEnabled: false,
    announcementText: "",
    loading: true,
});

/** How often we re-fetch settings from the server (ms). */
const POLL_INTERVAL = 30_000; // 30 seconds

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettingsContextValue>({
        preorderEnabled: process.env.NEXT_PUBLIC_ENABLE_PREORDER === "true",
        announcementText: "",
        loading: true,
    });

    const fetchSettings = useCallback(async () => {
        try {
            const res = await fetch("/api/site-settings", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setSettings({
                    preorderEnabled: data.settings?.preorderEnabled ?? false,
                    announcementText: data.settings?.announcementText ?? "",
                    loading: false,
                });
            }
        } catch (err) {
            console.error("Failed to fetch site settings:", err);
            // Keep the env variable fallback
            setSettings((prev) => ({ ...prev, loading: false }));
        }
    }, []);

    useEffect(() => {
        // Initial fetch
        fetchSettings();

        // Poll for changes so dashboard toggle updates propagate
        const interval = setInterval(fetchSettings, POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchSettings]);

    return (
        <SiteSettingsContext.Provider value={settings}>
            {children}
        </SiteSettingsContext.Provider>
    );
}

export function useSiteSettings() {
    return useContext(SiteSettingsContext);
}
