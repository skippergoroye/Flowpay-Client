import { api } from './apiSlice';

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'success' | 'failed';
  description?: string;
  recipientEmail?: string;
  recipientName?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  createdAt: string;
}

export const transactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], number | void>({
      query: (limit = 50) => `/transactions?limit=${limit}`,
      providesTags: ['Transactions'],
    }),
    getTransactionStats: builder.query<
      { totalCredit: number; totalDebit: number; transactionCount: number },
      void
    >({
      query: () => '/transactions/stats',
      providesTags: ['Transactions'],
    }),
    getTransaction: builder.query<Transaction, string>({
      query: (id) => `/transactions/${id}`,
      providesTags: ['Transactions'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionStatsQuery,
  useGetTransactionQuery,
} = transactionApi;