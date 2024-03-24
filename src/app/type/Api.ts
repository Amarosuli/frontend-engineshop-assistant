import { z } from 'zod';

export type ApiResponse<T> = {
  body: {
    data: T;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    lastPage: boolean;
  };
  message: string;
  meta: string;
  time: string;
};

export type Params = {
  totalItemsPerPage?: number;
  currentPage?: number | 0;
};

export function ZodApiResponse<T extends z.ZodTypeAny>(data: T) {
  return z.object({
    body: z.object({
      data: z.array(data),
      currentPage: z.number(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
      lastPage: z.boolean(),
    }),
    message: z.string(),
    meta: z.string(),
    time: z.string(),
  });
}
