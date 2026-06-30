import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { tagTypesList } from '../tag-types';
import { envConfig } from '@/lib/helpers/envConfig';
import { getAuthToken } from '@/utils/helper/get_auth_token';
import { getAppKind, getBrandKey } from '@/lib/brand-config';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: envConfig.baseApi,
        prepareHeaders: (headers) => {
            const token = getAuthToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('X-App-Kind', getAppKind());
            headers.set('X-Brand-Key', getBrandKey());
            return headers;
        }
    }),
    endpoints: () => ({}),
    tagTypes: tagTypesList
});
