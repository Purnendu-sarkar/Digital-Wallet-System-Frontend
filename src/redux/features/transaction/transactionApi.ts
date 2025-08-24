import { baseApi } from "@/redux/baseApi";

export interface ITransaction {
  _id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

interface ISendMoneyPayload {
  receiverId: string;
  amount: number;
}

interface ICashInOutPayload {
  userId: string;
  amount: number;
}

interface ITransactionResponse {
  data: ITransaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    totalTransactions: number;
    totalCommission?: number;
  };
}

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMoney: builder.mutation<ITransaction, ISendMoneyPayload>({
      query: (payload) => ({
        url: "/transaction/send-money",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["TRANSACTION", "USER"],
    }),
    cashOut: builder.mutation<ITransaction, ICashInOutPayload>({
      query: (payload) => ({
        url: "/transaction/cash-out",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["TRANSACTION", "USER"],
    }),

    cashIn: builder.mutation<ITransaction, ICashInOutPayload>({
      query: (payload) => ({
        url: "/transaction/cash-in",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["TRANSACTION", "USER"],
    }),
    getAllTransactions: builder.query<ITransactionResponse, Record<string, string | number | undefined>>({
      query: (payload) => ({
        url: "/transaction/history",
        method: "GET",
        data: payload,
      }),
      providesTags: ["TRANSACTION"],
    }),
  }),
});

export const {
  useSendMoneyMutation,
  useCashOutMutation,
  useCashInMutation,
  useGetAllTransactionsQuery,
} = transactionApi;