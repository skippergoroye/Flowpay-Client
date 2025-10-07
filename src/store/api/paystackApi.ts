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
    getBanks: builder.query<any, void>({
       query: () => ({
        url: "/paystack/banks",
        method: "GET",
      }),
    }),
    resolveAccount: builder.mutation({
      query: (data: { accountNumber: string; bankCode: string }) => ({
        url: '/paystack/resolve-account',
        method: 'POST',
        body: data,
      }),
    }),
    withdraw: builder.mutation({
      query: (data: {
        accountNumber: string;
        bankCode: string;
        amount: number;
        accountName: string;
      }) => ({
        url: '/paystack/withdraw',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wallet', 'Transactions'],
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
  useGetBanksQuery,
  useResolveAccountMutation,
  useWithdrawMutation,
} = paystackApi;