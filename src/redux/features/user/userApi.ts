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
  }),
});

export const { useGetAllUsersQuery } = userApi;
