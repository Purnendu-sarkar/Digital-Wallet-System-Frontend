import { baseApi } from "@/redux/baseApi";

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface ITransaction {
  _id: string;
  senderId: string;
  receiverId: string;
  agentId?: string;
  sender?: IUser;
  receiver?: IUser;
  agent?: IUser;
  amount: number;
  fee?: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: string;
  updatedAt: string;
}

interface ISendMoneyPayload {
  receiverId: string;
  amount: number;
}

interface ICashOutPayload {
  agentId: string;
  amount: number;
}

interface ICashInPayload {
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
    cashOut: builder.mutation<ITransaction, ICashOutPayload>({
      query: (payload) => ({
        url: "/transaction/cash-out",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["TRANSACTION", "USER"],
    }),

    cashIn: builder.mutation<ITransaction, ICashInPayload>({
      query: (payload) => ({
        url: "/transaction/cash-in",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["TRANSACTION", "USER"],
    }),
    getAllTransactions: builder.query<ITransactionResponse, Record<string, string | number | undefined>>({
  query: (queryParams) => ({
    url: "/transaction/history",
    method: "GET",
    params: queryParams,
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