import { baseApi } from "@/redux/baseApi";
import type { IMeta, IUser } from "@/types";


// API Response shape
interface IUserResponse {
  data: IUser[];
  meta: IMeta;
}

interface ISingleUserResponse {
  data: IUser;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<IUserResponse, Record<string, string | number | undefined>>({
      query: (queryParams) => ({
        url: "/user/all-users",
        params: queryParams,
      }),
      providesTags: ["USER"],
    }),

    getUserById: builder.query<ISingleUserResponse, string>({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    blockUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `/admin/wallets/block/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
    unblockUser: builder.mutation<IUser, string>({
      query: (userId) => ({
        url: `/admin/wallets/unblock/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
    approveAgent: builder.mutation<IUser, string>({
      query: (agentId) => ({
        url: `/admin/agents/approve/${agentId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
    suspendAgent: builder.mutation<IUser, string>({
      query: (agentId) => ({
        url: `/admin/agents/suspend/${agentId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const { 
  useGetAllUsersQuery, 
  useGetUserByIdQuery, 
  useBlockUserMutation, 
  useUnblockUserMutation, 
  useApproveAgentMutation, 
  useSuspendAgentMutation 
} = userApi;
