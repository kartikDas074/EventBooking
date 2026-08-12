'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import DashboardSidebar from '../../../components/layout/DashboardSidebar';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../lib/categories';
import { getCurrentUser, isAuthenticated } from '../../../lib/auth';
import type { User, Category } from '../../../types';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const u = getCurrentUser();
    if (!u || u.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    setCurrentUser(u);

    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    try {
      if (editingCat) {
        const res = await updateCategory(editingCat.id, { name, description });
        if (res.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          setModalError(res.message || 'Failed to update category');
        }
      } else {
        const res = await createCategory({ name, description });
        if (res.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          setModalError(res.message || 'Failed to create category');
        }
      }
    } catch (err: any) {
      setModalError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.message || 'Failed to delete category');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting category');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <span className="text-sm font-semibold text-zinc-400 animate-pulse">Loading category manager...</span>
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
          <div className="flex justify-between items-center bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Admin: Event Categories</h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Organize events into clear taxonomies for discovery.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-colors"
            >
              + Add Category
            </button>
          </div>

          <div className="bg-white border border-zinc-200/80 p-6 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 space-y-6">
            {loading ? (
              <div className="text-center py-12 text-xs font-semibold text-zinc-400 animate-pulse">
                Fetching category registry...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500 font-semibold">
                No categories configured. Click "+ Add Category" to start.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{cat.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                        {cat.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {cat.eventCount ?? 0} event(s)
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold text-zinc-700 bg-zinc-200/70 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-3xl dark:bg-zinc-950 dark:border-zinc-800 max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <h3 className="text-lg font-extrabold">{editingCat ? 'Edit Category' : 'Create New Category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 font-bold">
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-zinc-500 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none"
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none"
                  placeholder="Brief taxonomy overview..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
