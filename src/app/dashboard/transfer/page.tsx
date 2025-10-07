'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransferMutation } from '@/store/api/walletApi';
import { useGetBalanceQuery } from '@/store/api/walletApi';
import { formatCurrency } from '@/lib/utils';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function TransferPage() {
  const [transfer, { isLoading }] = useTransferMutation();
  const { data: balance } = useGetBalanceQuery();
  
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
  });
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    try {
      await transfer({
        recipientEmail: formData.recipientEmail,
        amount: parseFloat(formData.amount),
      }).unwrap();

      setResult({
        success: true,
        message: 'Transfer successful!',
      });
      setFormData({ recipientEmail: '', amount: '' });
    } catch (err: any) {
      setResult({
        success: false,
        message: err.data?.message || 'Transfer failed. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mt-4">
          <h1 className="text-3xl font-bold">Send Money</h1> <span className='text-blue-500 text-3xl font-bold'>Flow Pay To Flow Pay</span>

        </div>
        
        <p className="text-muted-foreground">
          Transfer money to other FlowPay users instantly
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
          <CardDescription className="text-2xl font-bold text-primary">
            {formatCurrency(balance?.balance || 0)}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>
            Enter the recipient's email and amount to transfer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {result && (
              <div
                className={`p-4 rounded-lg border flex items-center gap-3 ${
                  result.success
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recipient@example.com"
                value={formData.recipientEmail}
                onChange={(e) =>
                  setFormData({ ...formData, recipientEmail: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Money
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}