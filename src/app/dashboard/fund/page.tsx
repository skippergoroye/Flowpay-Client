'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitializePaymentMutation } from '@/store/api/paystackApi';
import { formatCurrency } from '@/lib/utils';
import { Loader2, CreditCard } from 'lucide-react';

export default function FundWalletPage() {
  const [initializePayment, { isLoading }] = useInitializePaymentMutation();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const quickAmounts = [1000, 5000, 10000, 20000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountValue = parseFloat(amount);
    if (amountValue < 100) {
      setError('Minimum amount is ₦100');
      return;
    }

    try {
      const result = await initializePayment({ amount: amountValue }).unwrap();
      // Redirect to Paystack payment page
      window.location.href = result.authorizationUrl;
    } catch (err: any) {
      setError(err.data?.message || 'Failed to initialize payment');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fund Wallet</h1>
        <p className="text-muted-foreground">
          Add money to your FlowPay wallet via card payment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enter Amount</CardTitle>
          <CardDescription>
            Choose a quick amount or enter your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant={amount === quickAmount.toString() ? 'default' : 'outline'}
                  onClick={() => setAmount(quickAmount.toString())}
                >
                  {formatCurrency(quickAmount)}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Custom Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                min="100"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Minimum amount: ₦100
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Secure payment powered by Paystack</li>
            <li>• Instant wallet credit upon successful payment</li>
            <li>• Support for all major cards (Visa, Mastercard, Verve)</li>
            <li>• Transaction fees may apply</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}