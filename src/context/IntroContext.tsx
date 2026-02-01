"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface IntroContextType {
    hasShownIntro: boolean;
    setHasShownIntro: (shown: boolean) => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: ReactNode }) {
    const [hasShownIntro, setHasShownIntro] = useState(false);

    return (
        <IntroContext.Provider value={{ hasShownIntro, setHasShownIntro }}>
            {children}
        </IntroContext.Provider>
    );
}

export function useIntro() {
    const context = useContext(IntroContext);
    if (!context) {
        throw new Error('useIntro must be used within an IntroProvider');
    }
    return context;
}
