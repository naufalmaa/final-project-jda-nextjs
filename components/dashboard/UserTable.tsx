// File: components/dashboard/UserTable.tsx
// CORRECTED: New component for displaying and managing users in a table

'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserWithSchool } from '@/redux/userSlice';
import { School as SchoolType } from '@prisma/client';
import { PlusCircle } from 'lucide-react';
import UserForm from './UserForm';
import DeleteUserConfirmation from './DeleteUserConfirmation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface UserTableProps {
  users: UserWithSchool[];
  loading: boolean;
  schools: SchoolType[];
}

export default function UserTable({ users, loading, schools }: UserTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithSchool | null>(null);

  const handleEdit = (user: UserWithSchool) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: UserWithSchool) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };
  
  const closeForm = () => setIsFormOpen(false);
  const closeDeleteDialog = () => setIsDeleteOpen(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assigned School</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-24">Loading users...</TableCell></TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant={user.role === 'SUPERADMIN' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                  <TableCell>{user.assignedSchool?.name || 'N/A'}</TableCell>
                  <TableCell>{format(new Date(user.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-right">
                      {user.role !== 'SUPERADMIN' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(user)} className="mr-2">Edit</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(user)}>Delete</Button>
                          </>
                      )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="text-center h-24">No users found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogDescription>
                    {selectedUser ? "Update the user's details. Leave password blank to keep it unchanged." : 'Create a new user account and assign a role.'}
                </DialogDescription>
            </DialogHeader>
            <UserForm currentUser={selectedUser} schools={schools} onFinished={closeForm} />
        </DialogContent>
      </Dialog>
      
       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <DeleteUserConfirmation user={selectedUser} onCancel={closeDeleteDialog} onFinished={closeDeleteDialog}/>
        </DialogContent>
      </Dialog>
    </>
  );
}