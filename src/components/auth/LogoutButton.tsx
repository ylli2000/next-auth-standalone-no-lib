'use client';

import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    return (
        <Button
            variant="primary"
            onClick={async () => {
                const { logout } = useAuthStore.getState();
                await logout();
                router.push('/');
            }}
        >
            Log Out
        </Button>
    );
}
