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
  }),
});

export const { useSendMoneyMutation } = transactionApi;