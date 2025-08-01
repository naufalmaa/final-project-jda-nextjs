// File: components/dashboard/UserManagementClient.tsx
// CORRECTED: New client component for the user management page

'use client';

import React, { useMemo } from 'react';
import { useAppSelector } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, School, ShieldCheck } from 'lucide-react';
import UserTable from './UserTable';
import { School as SchoolType } from '@prisma/client';

interface UserManagementClientProps {
    schools: SchoolType[];
}

export default function UserManagementClient({ schools }: UserManagementClientProps) {
    const { users, loading, error } = useAppSelector((state) => state.user);
    
    const userCounts = useMemo(() => {
        const schoolAdmins = users.filter(u => u.role === 'SCHOOL_ADMIN').length;
        const regularUsers = users.filter(u => u.role === 'USER').length;
        return { schoolAdmins, regularUsers };
    }, [users]);
    
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">School Admins</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : userCounts.schoolAdmins}</div>
                        <p className="text-xs text-muted-foreground">Accounts assigned to schools</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : userCounts.regularUsers}</div>
                        <p className="text-xs text-muted-foreground">Parent and student accounts</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>User Account List</CardTitle>
                    <CardDescription>
                        View, create, and manage user accounts in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 p-4 bg-red-50 rounded-md">Error: {error}</p>}
                    <UserTable users={users} loading={loading} schools={schools} />
                </CardContent>
            </Card>
        </div>
    );
}