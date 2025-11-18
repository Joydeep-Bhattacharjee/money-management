'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const response = await fetch(
        `/api/transactions?month=${currentMonth}&year=${currentYear}`
      );

      if (response.ok) {
        const transactions = await response.json();

        const totalIncome = transactions
          .filter((t: any) => t.type === 'income')
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const totalExpense = transactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        setStats({
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          transactionCount: transactions.length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Income</p>
            <p className="text-3xl font-bold text-green-600">
              ${stats.totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">
              ${stats.totalExpense.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Balance</p>
            <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.balance.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Transactions</p>
            <p className="text-3xl font-bold text-blue-600">{stats.transactionCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span className="text-gray-700">
                  <a href="/categories" className="text-blue-600 hover:text-blue-700 font-medium">
                    Create categories
                  </a>
                  {' '}to organize your transactions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span className="text-gray-700">
                  <a href="/transactions" className="text-blue-600 hover:text-blue-700 font-medium">
                    Add transactions
                  </a>
                  {' '}to track your money
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span className="text-gray-700">Set budgets to manage your spending</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3">✓</span>
                <span className="text-gray-700">View detailed reports and insights</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h2>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>• Track all your income and expenses for better financial awareness</li>
              <li>• Categorize transactions to understand where your money goes</li>
              <li>• Set monthly budgets to control spending</li>
              <li>• Review your transactions regularly to identify patterns</li>
              <li>• Use the dashboard to monitor your financial health</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
