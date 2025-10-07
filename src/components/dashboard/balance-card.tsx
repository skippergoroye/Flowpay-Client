'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetBalanceQuery } from '@/store/api/walletApi';
import { formatCurrency } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useGetTransactionStatsQuery } from '@/store/api/transactionApi';

export function BalanceCard() {
  const { data: balance, isLoading: balanceLoading } = useGetBalanceQuery();
  const { data: stats, isLoading: statsLoading } = useGetTransactionStatsQuery();

  return (
    <Card className="bg-gradient-to-br from-primary to-blue-600 text-white border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Wallet className="h-5 w-5" />
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {balanceLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold mb-6">
              {formatCurrency(balance?.balance || 0)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Income</span>
                </div>
                <div className="text-xl font-semibold">
                  {statsLoading ? '...' : formatCurrency(stats?.totalCredit || 0)}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span>Expenses</span>
                </div>
                <div className="text-xl font-semibold">
                  {statsLoading ? '...' : formatCurrency(stats?.totalDebit || 0)}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}