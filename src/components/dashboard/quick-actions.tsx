'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, CreditCard, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Send Money',
      description: 'Transfer to FlowPay users',
      icon: ArrowUpRight,
      href: '/dashboard/transfer',
      variant: 'default' as const,
    },
    {
      title: 'Fund Wallet',
      description: 'Add money via card',
      icon: Plus,
      href: '/dashboard/fund',
      variant: 'secondary' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="h-auto justify-start p-4"
            onClick={() => router.push(action.href)}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold">{action.title}</div>
                <div className="text-sm text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}