import { baseApi } from './api/baseApi';


import authReducer from './features/slice/authSlice';
export const rootReducer = {
    [baseApi.reducerPath]: baseApi.reducer,
 
    
    auth: authReducer
};
