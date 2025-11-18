'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      router.push('/dashboard');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Take Control of Your Money
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8">
            Smart money management app to track income, expenses, and budgets.
            Get insights into your spending habits and achieve your financial goals.
          </p>
          <div className="flex gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-medium border border-blue-600"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Transactions</h3>
            <p className="text-gray-600">
              Easily record and categorize all your income and expenses in one place.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual Insights</h3>
            <p className="text-gray-600">
              Get clear reports and analytics to understand your spending patterns.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Budget Goals</h3>
            <p className="text-gray-600">
              Set and manage budgets to control your spending and reach financial goals.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
