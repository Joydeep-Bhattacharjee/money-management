'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  color: string;
  type: string;
}

export default function CategoriesList({ refreshKey }: { refreshKey: number }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  if (isLoading) {
    return <p className="text-gray-500">Loading categories...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
        {expenseCategories.length === 0 ? (
          <p className="text-gray-500">No expense categories yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">Expense</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Income Categories</h3>
        {incomeCategories.length === 0 ? (
          <p className="text-gray-500">No income categories yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {incomeCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">Income</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
