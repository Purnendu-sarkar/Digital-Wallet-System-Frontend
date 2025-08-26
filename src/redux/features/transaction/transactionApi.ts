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
  type: "SEND_MONEY" | "TOP_UP" | "CASH_IN" | "CASH_OUT" | "WITHDRAW";
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

interface IAdminStats {
  totalUsers: number;
  totalAgents: number;
  transactionCount: number;
  totalTransactionVolume: number;
}

export interface IStatsQueryParams {
  filterType?: "lifetime" | "last7days" | "last30days" | "custom" | "specificDate";
  startDate?: string;
  endDate?: string;
}

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<IAdminStats, IStatsQueryParams | void>({
      query: (params) => ({
        url: "/admin/stats",
        method: "GET",
        params,
      }),
      transformResponse: (response: { data: IAdminStats }) => response.data,
      providesTags: ["ADMIN_STATS"],
      // onQueryStarted: async (arg, { queryFulfilled }) => {
      //   try {
      //     const { data: stats } = await queryFulfilled;
      //     console.log("Admin Stats Loaded:", stats);
      //   } catch (error) {
      //     console.error("Error loading admin stats:", error);
      //   }
      // },
    }),
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
  useGetAdminStatsQuery,
  useSendMoneyMutation,
  useCashOutMutation,
  useCashInMutation,
  useGetAllTransactionsQuery,
} = transactionApi;