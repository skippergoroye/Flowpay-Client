'use client';

import { BalanceCard } from '@/components/dashboard/balance-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceCard />
        </div>
        <QuickActions />
      </div>

      <RecentTransactions />
    </div>
  );
}
