'use client';

import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { redirect } from 'next/navigation';
export default function LogoutButton() {
    return (
        <Button
            variant="primary"
            onClick={async () => {
                const { logout } = useAuthStore.getState();
                await logout();
                redirect('/login');
            }}
        >
            Log Out
        </Button>
    );
}
