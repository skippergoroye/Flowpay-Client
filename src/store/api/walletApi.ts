// src/store/api/walletApi.ts
import { api } from './apiSlice';

export const walletApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query<{ balance: number; currency: string }, void>({
      query: () => '/wallet/balance',
      providesTags: ['Wallet'],
    }),
    transfer: builder.mutation({
      query: (data: { recipientEmail: string; amount: number }) => ({
        url: '/wallet/transfer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet', 'Transactions'],
    }),
  }),
});

export const { useGetBalanceQuery, useTransferMutation } = walletApi;