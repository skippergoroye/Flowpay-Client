// src/store/api/paystackApi.ts
import { api } from './apiSlice';

export const paystackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    initializePayment: builder.mutation({
      query: (data: { amount: number }) => ({
        url: '/paystack/initialize',
        method: 'POST',
        body: data,
      }),
    }),
    verifyPayment: builder.query({
      query: (reference: string) => `/paystack/verify?reference=${reference}`,
      providesTags: ['Wallet'],
    }),
    getBanks: builder.query({
      query: () => '/paystack/banks',
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
  useGetBanksQuery,
} = paystackApi;