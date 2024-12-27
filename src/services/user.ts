import { request } from 'umi';
import { API_CONFIG } from '@/constants/index';
export async function login(payload: any) {
    return request(`${API_CONFIG.API_HOST}/acc.user.login`, {
        method: 'POST',
        data: payload
    });
}