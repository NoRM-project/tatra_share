import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Adjust if needed
});

// Types
export interface User {
  id: number;
  full_name: string;
  iban: string;
}

export interface GroupDto {
  id: number;
  name: string;
  members_count: number;
  user_balance: number;
}

export interface CreateGroupRequest {
  name: string;
  memberIds: number[];
}

export interface TransactionDto {
  id: number;
  name: string;
  description: string;
  created_at: string;
  paid_by: User;
  amount: number;
  beneficiaries: User[];
}

export interface CreateTransactionRequest {
  name: string;
  description: string;
  amount: number;
  beneficiary_ids: number[];
}

export interface AddGroupMemberRequest {
  fullName: string;
  iban: string;
}

export interface TransactionUserDto {
  id: number;
  full_name: string;
  iban: string;
}

export interface GroupReportDto {
  liability: number;
  receivable: number;
  difference: number;
  balances: {
    amount: number;
    member: User;
  }[];
}

// User API
export const userApi = {
  getAllUsers: () => api.get<User[]>('/api/users'),
  createUser: (data: { full_name: string; iban: string }) => api.post<User>('/api/users', data),
};

// Group API
export const groupApi = {
  getGroups: () => api.get<GroupDto[]>('/api/groups'),
  createGroup: (data: CreateGroupRequest) => api.post<GroupDto>('/api/groups', data),
};

// Transaction API
export const transactionApi = {
  getTransactions: (groupId: number) => api.get<TransactionDto[]>(`/api/groups/${groupId}/transactions`),
  createTransaction: (groupId: number, data: CreateTransactionRequest) => api.post<TransactionDto>(`/api/groups/${groupId}/transactions`, data),
  getTransaction: (groupId: number, transactionId: number) => api.get<TransactionDto>(`/api/groups/${groupId}/transactions/${transactionId}`),
};

// Group Member API
export const groupMemberApi = {
  getMembers: (groupId: number) => api.get<TransactionUserDto[]>(`/api/groups/${groupId}/members`),
  addMember: (groupId: number, data: AddGroupMemberRequest) => api.post<TransactionUserDto>(`/api/groups/${groupId}/members`, data),
};

// Report API
export const reportApi = {
  getReport: (groupId: number) => api.get<GroupReportDto>(`/api/groups/${groupId}/report`),
};
