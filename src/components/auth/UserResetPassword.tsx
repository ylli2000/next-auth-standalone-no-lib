'use client';

import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { UserPasswordUpdateFormValues, userPasswordUpdateResolver } from '@/lib/validation/authSchema';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface UserResetPasswordProps {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    onEditStart: () => void;
}

export default function UserResetPassword({ isEditing, setIsEditing, onEditStart }: UserResetPasswordProps) {
    const { updateProfile, isLoading } = useAuthStore();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<UserPasswordUpdateFormValues>({
        resolver: userPasswordUpdateResolver,
        mode: 'onChange'
    });

    const onSubmit = async (data: UserPasswordUpdateFormValues) => {
        try {
            await updateProfile({ password: data.password });
            toast.success('Password updated successfully');
            setIsEditing(false);
            reset();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update password');
        }
    };

    const handleEditStart = () => {
        onEditStart();
        setIsEditing(true);
    };

    if (!isEditing) {
        return (
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-[rgb(var(--color-foreground))]">Password</h3>
                <Button variant="primary" onClick={handleEditStart} disabled={isLoading}>
                    Change Password
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-[rgb(var(--color-foreground))]">Change Password</h3>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        setIsEditing(false);
                        reset();
                    }}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground)/0.7)] mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent transition-colors"
                            disabled={isLoading}
                            maxLength={100}
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-foreground)/0.7)] mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            {...register('confirmPassword')}
                            className="w-full bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-md px-3 py-2 text-[rgb(var(--color-foreground))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)/0.5)] focus:border-transparent transition-colors"
                            disabled={isLoading}
                            maxLength={100}
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-[rgb(var(--color-border))]">
                    <Button type="submit" variant="primary" disabled={isLoading || !isValid}>
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
