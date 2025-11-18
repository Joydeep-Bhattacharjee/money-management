'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: string;
  date: string;
  category: { name: string; color: string } | null;
}

export default function TransactionList() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (session?.user?.id) {
      fetchTransactions();
    }
  }, [session, currentMonth, currentYear]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/transactions?month=${currentMonth}&year=${currentYear}`
      );
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev === 1 ? 12 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 12 ? 1 : prev + 1));
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Previous
          </button>
          <span className="text-lg font-medium">
            {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm">{transaction.description || '-'}</td>
                  <td className="px-6 py-3 text-sm">
                    {transaction.category ? (
                      <span
                        className="px-2 py-1 rounded-full text-white text-xs"
                        style={{ backgroundColor: transaction.category.color }}
                      >
                        {transaction.category.name}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm capitalize">{transaction.type}</td>
                  <td
                    className={`px-6 py-3 text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
