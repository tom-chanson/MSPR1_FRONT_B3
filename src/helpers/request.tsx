import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../constants';
import { RequestMethod, RequestHeader } from '../interface';


export function RequestHelperAuth<T>(method: RequestMethod, route: string, auth: string, data?: any): Promise<AxiosResponse<T>> {
    return RequestAuthHelper<T>(method, route, auth, data, false);
}

export function RequestHelper<T>(method: RequestMethod, route: string, data?: any): Promise<AxiosResponse<T>> {
    return RequestAuthHelper<T>(method, route, null, data, false);
}

export function RequestHelperAuthImage<T>(method: RequestMethod, route: string, auth: string, data: any): Promise<AxiosResponse<T>> {
    return RequestAuthHelper<T>(method, route, auth, data, true);
}

function RequestAuthHelper<T>(method: RequestMethod, route: string, auth: string | null, data: any, image?: boolean): Promise<AxiosResponse<T>> {
    if (data && !image) {
        data = JSON.stringify(data);
    }
    const contentType = image ? 'multipart/form-data' : 'application/json';
    const accept = image ? 'application/hal+json' : '';
    const headers: RequestHeader = {
        'Content-Type': contentType,
        Utilisateur_id: '',
    };
    if (accept) {
        headers.Accept = accept;
    }
    if (auth) {
        console.log('auth', auth);
        headers.Authorization = auth;
        headers.Utilisateur_id = auth;
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
    console.log(config);
    return axios.request<T>(config);
}