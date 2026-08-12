import React from 'react';
import { Category } from '../../lib/api';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
  isActive?: boolean;
}

export default function CategoryCard({ category, onClick, isActive }: CategoryCardProps) {
  // Generate random gradient or custom styles depending on the category name
  const getGradient = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('tech')) return 'from-blue-500 to-cyan-500';
    if (lowercase.includes('business')) return 'from-emerald-500 to-teal-500';
    if (lowercase.includes('music')) return 'from-purple-500 to-pink-500';
    if (lowercase.includes('sports')) return 'from-orange-500 to-amber-500';
    return 'from-indigo-500 to-purple-500';
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-6 border transition-all duration-300 ${
        isActive
          ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/10 dark:border-indigo-500 dark:bg-indigo-950/10'
          : 'border-zinc-200/80 bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          {/* Icon Placeholder Color Strip */}
          <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${getGradient(category.name)}`} />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {category.description || 'Discover amazing events in this category.'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between text-xs font-semibold text-zinc-400 dark:text-zinc-500">
        <span>Active Events</span>
        <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full text-[11px] font-bold dark:bg-zinc-900 dark:text-zinc-400">
          {category.eventCount ?? 0}
        </span>
      </div>
    </div>
  );
}
