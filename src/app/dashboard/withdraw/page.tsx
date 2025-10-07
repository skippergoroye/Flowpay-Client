
  // src/app/dashboard/withdraw/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetBalanceQuery } from '@/store/api/walletApi';
import { useGetBanksQuery, useResolveAccountMutation, useWithdrawMutation } from '@/store/api/paystackApi';
import { formatCurrency } from '@/lib/utils';
import { Loader2, Building2, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function WithdrawPage() {
  const { data: balance } = useGetBalanceQuery();
  const { data: banks, isLoading: banksLoading } = useGetBanksQuery();
  const [resolveAccount, { isLoading: resolving }] = useResolveAccountMutation();
  const [withdraw, { isLoading: withdrawing }] = useWithdrawMutation();

  const [formData, setFormData] = useState({
    bankCode: '',
    accountNumber: '',
    amount: '',
  });
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Auto-resolve account when bank and account number are filled
  useEffect(() => {
    const resolveAccountName = async () => {
      if (formData.bankCode && formData.accountNumber.length === 10) {
        setAccountName('');
        setError('');
        
        try {
          const result = await resolveAccount({
            accountNumber: formData.accountNumber,
            bankCode: formData.bankCode,
          }).unwrap();

          setAccountName(result.account_name);
        } catch (err: any) {
          setError('Could not verify account. Please check details.');
          setAccountName('');
        }
      }
    };

    resolveAccountName();
  }, [formData.bankCode, formData.accountNumber, resolveAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const amountValue = parseFloat(formData.amount);

    if (amountValue < 100) {
      setError('Minimum withdrawal amount is ₦100');
      return;
    }

    if (amountValue > (balance?.balance || 0)) {
      setError('Insufficient balance');
      return;
    }

    if (!accountName) {
      setError('Please verify your account details first');
      return;
    }

    try {
      await withdraw({
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode,
        amount: amountValue,
        accountName,
      }).unwrap();

      setResult({
        success: true,
        message: 'Withdrawal initiated successfully!',
      });
      setFormData({ bankCode: '', accountNumber: '', amount: '' });
      setAccountName('');
    } catch (err: any) {
      setResult({
        success: false,
        message: err.data?.message || 'Withdrawal failed. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Withdraw to Bank</h1>
        <p className="text-muted-foreground">
          Transfer money from your FlowPay wallet to your bank account
        </p>
      </div>

      {/* Test Mode Warning */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800 font-semibold">Test Mode - Limited Account Resolution</AlertTitle>
        <AlertDescription className="text-yellow-700 text-sm">
          <p className="mb-2">
            You're using a <strong>test API key</strong> with a daily limit of 3 account resolutions. 
          </p>
          <p className="mb-2">
            <strong>For Testing:</strong> Use test bank codes:
          </p>
          <ul className="list-disc list-inside mb-2 space-y-1">
            <li><strong>Access Bank (Code: 001)</strong> - Any 10-digit account number</li>
            <li><strong>Access Bank (Code: 044)</strong> - Any 10-digit account number</li>
          </ul>
          <p>
            These test banks will return mock account names. Withdrawals will be <strong>simulated only</strong>.
            <a 
              href="https://dashboard.paystack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline ml-1 font-medium"
            >
              Upgrade to live mode →
            </a>
          </p>
        </AlertDescription>
      </Alert>

      {/* Available Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
          <CardDescription className="text-2xl font-bold text-primary">
            {formatCurrency(balance?.balance || 0)}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Details</CardTitle>
          <CardDescription>
            Enter your bank details and amount to withdraw
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Result Message */}
            {result && (
              <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {result.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                  {result.success && (
                    <div className="mt-2 text-xs">
                      <strong>Note:</strong> This is a test transaction. No actual funds were transferred.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Bank Selection */}
            <div className="space-y-2">
              <Label htmlFor="bank">Select Bank</Label>
              <p className="text-xs text-muted-foreground mb-2">
                💡 <strong>For testing:</strong> Select "Access Bank" (codes 001 or 044) to avoid rate limits
              </p>
              {banksLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading banks...
                </div>
              ) : (
                <Select
                  value={formData.bankCode}
                  onValueChange={(value) => {
                    setFormData({ ...formData, bankCode: value });
                    setAccountName('');
                  }}
                >
                  <SelectTrigger id="bank">
                    <SelectValue placeholder="Choose your bank" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px] overflow-y-auto">
                    <SelectItem value="001" className="bg-green-50">
                      <span className="font-medium">✓ Access Bank (Test) - Code: 001</span>
                    </SelectItem>
                    <SelectItem value="044" className="bg-green-50">
                      <span className="font-medium">✓ Access Bank (Test) - Code: 044</span>
                    </SelectItem>
                    <div className="px-2 py-1 text-xs text-muted-foreground border-t mt-1">
                      Other banks (may hit rate limit):
                    </div>
                    {banks?.map((bank: any) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="0123456789"
                maxLength={10}
                value={formData.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, accountNumber: value });
                }}
                required
              />
              {resolving && formData.accountNumber.length === 10 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying account...
                </div>
              )}
            </div>

            {/* Account Name Display */}
            {accountName && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Account Verified</span>
                </div>
                <p className="text-sm text-green-700">
                  <strong>Account Name:</strong> {accountName}
                </p>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="100"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground">
                Minimum: ₦100 • Available: {formatCurrency(balance?.balance || 0)}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12"
              size="lg"
              disabled={withdrawing || !accountName || !formData.amount}
            >
              {withdrawing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Withdrawal...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-5 w-5" />
                  Withdraw {formData.amount ? formatCurrency(parseFloat(formData.amount)) : 'Money'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Information</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Withdrawals are processed instantly in live mode</li>
                  <li>• Minimum withdrawal amount is ₦100</li>
                  <li>• Bank transfer fees may apply</li>
                  <li>• Ensure your account details are correct</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Building2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">Supported Banks</h3>
                <p className="text-sm text-purple-800">
                  All Nigerian banks are supported for withdrawals. Make sure to select the correct bank 
                  and enter your account number accurately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Enable Live Withdrawals</h3>
                <p className="text-sm text-amber-800 mb-3">
                  To enable real bank withdrawals, you need to:
                </p>
                <ul className="space-y-1 text-sm text-amber-800 mb-3">
                  <li>1. Verify your Paystack business account</li>
                  <li>2. Upload required business documents (CAC, ID, etc.)</li>
                  <li>3. Switch from test keys to live API keys</li>
                  <li>4. Wait for approval (1-5 business days)</li>
                </ul>
                <a
                  href="https://dashboard.paystack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-900 underline hover:text-amber-700"
                >
                  Upgrade your Paystack account →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}