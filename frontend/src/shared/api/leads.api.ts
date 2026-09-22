import { apiClient } from './client';

export type LeadSource =
    | 'website'
    | 'referral'
    | 'cold_call'
    | 'email'
    | 'social'
    | 'event'
    | 'partner';

export type LeadStatus =
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'proposal'
    | 'negotiation'
    | 'won'
    | 'lost';

export interface Lead {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    company: string;
    position: string;
    source: LeadSource;
    status: LeadStatus;
    manager: string;
    dealAmount: number;
    currency: string;
    city: string;
    industry: string;
    notes: string | null;
    createdById: number | null;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

export interface LeadPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company: string;
    position: string;
    source: LeadSource;
    status: LeadStatus;
    manager: string;
    dealAmount?: number;
    city: string;
    industry: string;
    notes?: string;
}

export interface LeadsQuery {
    search?: string;
    status?: LeadStatus;
    source?: LeadSource;
    manager?: string;
    industry?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface LeadsResponse {
    items: Lead[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface LeadsFilters {
    managers: string[];
    industries: string[];
}

export const leadsApi = {
    getAll: (query: LeadsQuery = {}) => apiClient.get<LeadsResponse>('/leads', { params: query }),

    getOne: (id: number) => apiClient.get<Lead>(`/leads/${id}`),

    getFilters: () => apiClient.get<LeadsFilters>('/leads/filters'),

    create: (data: LeadPayload) => apiClient.post<Lead>('/leads', data),

    update: (id: number, data: Partial<LeadPayload>) => apiClient.patch<Lead>(`/leads/${id}`, data),

    delete: (id: number) => apiClient.delete<{ message: string }>(`/leads/${id}`),

    reset: () => apiClient.post<{ count: number }>('/leads/reset'),
};
