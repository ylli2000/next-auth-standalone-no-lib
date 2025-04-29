'use client';

import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import UserResetPassword from './UserResetPassword';

export default function UserProfile() {
    const { user, isLoading, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [isPasswordEditing, setIsPasswordEditing] = useState(false);

    useEffect(() => {
        if (isEditing && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isEditing]);

    if (!user) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-400">Please log in to view your profile.</p>
            </div>
        );
    }

    const handleUpdateProfile = async () => {
        if (name === user.name) {
            setIsEditing(false);
            return;
        }

        setIsUpdating(true);
        try {
            await updateProfile({ name });
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        setName(user.name);
        setIsEditing(false);
    };

    const handleEditProfile = () => {
        setIsPasswordEditing(false);
        setIsEditing(true);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Profile Information Card */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    {!isEditing && !isPasswordEditing && (
                        <Button variant="primary" onClick={handleEditProfile} disabled={isLoading}>
                            Edit Profile
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                            {isEditing ? (
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    disabled={isUpdating}
                                    maxLength={50}
                                />
                            ) : (
                                <p className="text-white">{user.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <p className="text-gray-500 italic text-sm mb-1">Not editable</p>
                            <p className="text-white">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                            <p className="text-gray-500 italic text-sm mb-1">Not editable</p>
                            <p className="text-white capitalize">{user.role}</p>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex space-x-4 pt-4 border-t border-gray-700">
                            <Button
                                variant="primary"
                                onClick={handleUpdateProfile}
                                disabled={isUpdating || name === user.name}
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} disabled={isUpdating}>
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Password Reset Card */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <UserResetPassword
                    isEditing={isPasswordEditing}
                    setIsEditing={setIsPasswordEditing}
                    onEditStart={() => setIsEditing(false)}
                />
            </div>
        </div>
    );
}
