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
interface ICashOutPayload {
  agentId: string;
  amount: number;
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
  }),
});

export const {
  useSendMoneyMutation,
  useCashOutMutation
} = transactionApi;