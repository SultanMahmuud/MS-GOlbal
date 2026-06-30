import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { normalizeTags } from "@/utils/helper/generite-tag";
interface ExecuteCommonApiParams<T = any> {
  payload?: T;
  url: string;
  tags?: tagTypes | tagTypes[];
  params?: Record<string, any>;
}

export const commonApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Create Resource
    createResource: build.mutation({
      query: ({ payload, url, params }: ExecuteCommonApiParams) => {
        return {
          url,
          method: "POST",
          body: payload,
          params,
        };
      },
      invalidatesTags: (_result, _error, { tags }: ExecuteCommonApiParams) => {
        return normalizeTags(tags);
      },
    }),

    // Update Resource
    updateResource: build.mutation({
      query: ({ payload, url, params }: ExecuteCommonApiParams) => ({
        url,
        method: "PATCH",
        body: payload,
        params,
      }),
      invalidatesTags: (_result, _error, { tags }: ExecuteCommonApiParams) => {
        return normalizeTags(tags);
      },
    }),
    // Update Resource
    updatePutResource: build.mutation({
      query: ({ payload, url, params }: ExecuteCommonApiParams) => ({
        url,
        method: "PUT",
        body: payload,
        params,
      }),
      invalidatesTags: (_result, _error, { tags }: ExecuteCommonApiParams) => {
        return normalizeTags(tags);
      },
    }),

    // Delete Resource
    deleteResource: build.mutation({
      query: ({ url, params, payload }: ExecuteCommonApiParams) => ({
        url,
        method: "DELETE",
        body: payload,
        params,
      }),
      invalidatesTags: (_result, _error, { tags }: ExecuteCommonApiParams) => {
        return normalizeTags(tags);
      },
    }),

    // Fetch Resource
    fetchResource: build.query({
      query: ({ url, params }: ExecuteCommonApiParams) => ({
        url,
        method: "GET",
        params,
      }),
      providesTags: (_result, _error, { tags }: ExecuteCommonApiParams) => {
        return normalizeTags(tags);
      },
    }),
  }),
});

export const {
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useDeleteResourceMutation,
  useFetchResourceQuery,
  useUpdatePutResourceMutation
} = commonApi;
