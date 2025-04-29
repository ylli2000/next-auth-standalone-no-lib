'use client';

import { ReactNode } from 'react';

// This component doesn't actually do anything besides marking the tree as client-side
// The auth store is already hydrated from localStorage by zustand/persist
export function Providers({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
