import { baseApi } from "@/redux/baseApi";
import type { IMeta, IUser } from "@/types";


// API Response shape
interface IUserResponse {
  data: IUser[];
  meta: IMeta;
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
  }),
});

export const { useGetAllUsersQuery, useBlockUserMutation, useUnblockUserMutation } = userApi;
