import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../constants';
import { RequestMethod, RequestHeader } from '../interface';


export function RequestHelperAuth<T>(method: RequestMethod, route: string, auth: string, data?: any): Promise<AxiosResponse<T>> {
    return RequestAuthHelper<T>(method, route, auth, data);
}

export function RequestHelper<T>(method: RequestMethod, route: string, data?: any): Promise<AxiosResponse<T>> {
    return RequestAuthHelper<T>(method, route, null, data);
}

function RequestAuthHelper<T>(method: RequestMethod, route: string, auth: string | null, data: any): Promise<AxiosResponse<T>> {
    if (data) {
        data = JSON.stringify(data);
    }
    const headers: RequestHeader = {
        'Content-Type': 'application/json',
    };
    if (auth) {
        headers.Authorization = auth;
    }
    const config: AxiosRequestConfig = {
        method: method,
        url: route,
        headers: {
            ...headers,
        },
        data: data,
        baseURL: API_URL,
        timeout: 90000,
    };
    return axios.request<T>(config);
}