export interface IUserData {
    name: string;
   };

export declare type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export declare type RequestContentType = 'application/json';

export interface IRequestHeader {
    'Authorization'?: string;
    'Content-Type': RequestContentType;
}

export interface IAuthResponse {
    token: string;
}
