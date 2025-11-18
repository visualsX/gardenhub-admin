/// <reference types="zustand" />
'use client';

import { create } from 'zustand';

const buildState = (pageSize) => ({
  page: 1,
  pageSize,
  first: pageSize,
  after: null,
  last: null,
  before: null,
});

const usePagination = create((set) => ({
  paginations: {},

  init: (key, { pageSize = 10 } = {}) =>
    set((state) =>
      !key || state.paginations[key]
        ? state
        : {
            paginations: {
              ...state.paginations,
              [key]: buildState(pageSize),
            },
          }
    ),

  setPageSize: (key, pageSize) =>
    set((state) => {
      if (!key || !pageSize) return state;
      return {
        paginations: {
          ...state.paginations,
          [key]: buildState(pageSize),
        },
      };
    }),

  goNext: (key, pageInfo) =>
    set((state) => {
      const current = state.paginations[key];
      if (!current || !pageInfo?.hasNextPage) return state;
      return {
        paginations: {
          ...state.paginations,
          [key]: {
            ...current,
            page: current.page + 1,
            first: current.pageSize,
            after: pageInfo?.endCursor ?? null,
            last: null,
            before: null,
          },
        },
      };
    }),

  goPrev: (key, pageInfo) =>
    set((state) => {
      const current = state.paginations[key];
      if (!current || current.page <= 1 || !pageInfo?.hasPreviousPage) return state;
      return {
        paginations: {
          ...state.paginations,
          [key]: {
            ...current,
            page: current.page - 1,
            first: null,
            after: null,
            last: current.pageSize,
            before: pageInfo?.startCursor ?? null,
          },
        },
      };
    }),

  reset: (key) =>
    set((state) => {
      if (!state.paginations[key]) return state;
      const pageSize = state.paginations[key].pageSize;
      return {
        paginations: {
          ...state.paginations,
          [key]: buildState(pageSize),
        },
      };
    }),
}));

export default usePagination;
