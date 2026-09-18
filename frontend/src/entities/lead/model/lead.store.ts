import { defineStore } from 'pinia';
import {
    leadsApi,
    type Lead,
    type LeadsQuery,
    type LeadStatus,
    type LeadSource,
} from '@shared/api/leads.api';

interface State {
    items: Lead[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    loading: boolean;
    error: string | null;

    search: string;
    status: LeadStatus | null;
    source: LeadSource | null;
    manager: string | null;
    industry: string | null;
    sortBy: string;
    order: 'asc' | 'desc';

    managers: string[];
    industries: string[];

    selectedId: number | null;
}

export const useLeadStore = defineStore('lead', {
    state: (): State => ({
        items: [],
        total: 0,
        page: 1,
        limit: 25,
        totalPages: 0,
        loading: false,
        error: null,

        search: '',
        status: null,
        source: null,
        manager: null,
        industry: null,
        sortBy: 'createdAt',
        order: 'desc',

        managers: [],
        industries: [],

        selectedId: null,
    }),

    getters: {
        query(state): LeadsQuery {
            return {
                search: state.search || undefined,
                status: state.status ?? undefined,
                source: state.source ?? undefined,
                manager: state.manager ?? undefined,
                industry: state.industry ?? undefined,
                sortBy: state.sortBy,
                order: state.order,
                page: state.page,
                limit: state.limit,
            };
        },

        hasActiveFilters(state): boolean {
            return !!(state.search || state.status || state.source || state.manager || state.industry);
        },

        selectedLead(state): Lead | null {
            return state.items.find((l) => l.id === state.selectedId) ?? null;
        },
    },

    actions: {
        async fetchLeads() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await leadsApi.getAll(this.query);
                this.items = data.items;
                this.total = data.total;
                this.totalPages = data.totalPages;
            } catch (e) {
                this.error = 'Не удалось загрузить лиды';
                console.error(e);
            } finally {
                this.loading = false;
            }
        },

        async fetchFilters() {
            try {
                const { data } = await leadsApi.getFilters();
                this.managers = data.managers;
                this.industries = data.industries;
            } catch (e) {
                console.error(e);
            }
        },

        setSearch(value: string) {
            this.search = value;
            this.page = 1;
        },

        setStatus(value: LeadStatus | null) {
            this.status = value;
            this.page = 1;
        },

        setSource(value: LeadSource | null) {
            this.source = value;
            this.page = 1;
        },

        setManager(value: string | null) {
            this.manager = value;
            this.page = 1;
        },

        setIndustry(value: string | null) {
            this.industry = value;
            this.page = 1;
        },

        setSort(field: string) {
            if (this.sortBy === field) {
                this.order = this.order === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortBy = field;
                this.order = 'asc';
            }
            this.page = 1;
        },

        setPage(page: number) {
            this.page = page;
        },

        setLimit(limit: number) {
            this.limit = limit;
            this.page = 1;
        },

        resetFilters() {
            this.search = '';
            this.status = null;
            this.source = null;
            this.manager = null;
            this.industry = null;
            this.page = 1;
        },

        openLead(id: number) {
            this.selectedId = id;
        },

        closeLead() {
            this.selectedId = null;
        },
    },
});