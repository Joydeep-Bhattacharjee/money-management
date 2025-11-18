'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="font-bold text-xl">
            Money Manager
          </Link>

          {session?.user && (
            <div className="flex items-center gap-6">
              <span className="text-sm">{session.user.email}</span>
              <Link
                href="/dashboard"
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/transactions"
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Transactions
              </Link>
              <Link
                href="/categories"
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Categories
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
