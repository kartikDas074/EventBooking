'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import DashboardSidebar from '../../../components/layout/DashboardSidebar';
import { Badge, statusVariant } from '../../../components/ui/Badge';
import { getAllUsers, updateUserAdmin, deleteUser } from '../../../lib/users';
import { getCurrentUser, isAuthenticated } from '../../../lib/auth';
import type { User, UserRole, UserStatus } from '../../../types';

export default function AdminUsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const u = getCurrentUser();
    if (!u || u.role !== 'ADMIN') {
      alert('Access restricted to System Administrators.');
      router.push('/dashboard');
      return;
    }
    setCurrentUser(u);

    fetchUsers();
  }, [router]);

  const fetchUsers = async (searchTerm = search) => {
    setLoading(true);
    try {
      const res = await getAllUsers(1, 50, searchTerm);
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      const res = await updateUserAdmin(userId, { role: newRole });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      } else {
        alert(res.message || 'Failed to update role');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: UserStatus) => {
    const nextStatus: UserStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setUpdatingId(userId);
    try {
      const res = await updateUserAdmin(userId, { status: nextStatus });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u)));
      } else {
        alert(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      alert(err.message || 'Error updating user status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    setUpdatingId(userId);
    try {
      const res = await deleteUser(userId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert(res.message || 'Failed to delete user');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting user');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <span className="text-sm font-semibold text-zinc-400 animate-pulse">Loading administration panel...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <div className="hidden md:block">
          <DashboardSidebar role={currentUser.role} userName={currentUser.name} userEmail={currentUser.email} />
        </div>

        <main className="flex-1 space-y-8">
          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
            <h1 className="text-2xl font-extrabold tracking-tight">Admin: User Accounts Management</h1>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Manage system users, grant ORGANIZER/ADMIN roles, or block suspicious accounts.
            </p>
          </div>

          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-colors"
              >
                Search
              </button>
            </form>

            {loading ? (
              <div className="text-center py-12 text-xs font-semibold text-zinc-400 animate-pulse">
                Fetching user database...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500 font-semibold">
                No user accounts found matching query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">User Name</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Registered</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-medium">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40">
                        <td className="py-3.5 px-3 font-bold text-zinc-900 dark:text-zinc-100">
                          {u.name}
                          {u.id === currentUser.id && (
                            <span className="ml-2 text-[10px] text-indigo-600 font-extrabold">(You)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-zinc-500 dark:text-zinc-400">{u.email}</td>
                        <td className="py-3.5 px-3">
                          <select
                            disabled={updatingId === u.id || u.id === currentUser.id}
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none"
                          >
                            <option value="USER">USER</option>
                            <option value="ORGANIZER">ORGANIZER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-3">
                          <Badge variant={statusVariant(u.status)}>{u.status}</Badge>
                        </td>
                        <td className="py-3.5 px-3 text-zinc-400">
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-2">
                          {u.id !== currentUser.id && (
                            <>
                              <button
                                disabled={updatingId === u.id}
                                onClick={() => handleStatusToggle(u.id, u.status)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                                  u.status === 'ACTIVE'
                                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 hover:bg-amber-100'
                                    : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 hover:bg-emerald-100'
                                }`}
                              >
                                {u.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                              </button>
                              <button
                                disabled={updatingId === u.id}
                                onClick={() => handleDeleteUser(u.id)}
                                className="px-2.5 py-1 rounded-md text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
