import type { ComponentType } from "react";

export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export type TRole = "ADMIN" | "AGENT" | "USER";


export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export type IsActive = "ACTIVE" | "INACTIVE" | "BLOCKED";


export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  role: TRole;
  isActive: IsActive;
  isDeleted: boolean;
  isVerified: boolean;
  agentApprovalStatus?: "PENDING" | "APPROVED" | "SUSPENDED";
  createdAt?: string;
  updatedAt?: string;
  wallet: {
    balance: number;
    isBlocked: boolean;
  };
  auths?: {
    provider: string;
    providerId: string;
  }[];
}
