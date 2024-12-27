import { apiRequest, getCacheData, setCacheData } from "@/utils/utils";
import { DEFAULT_AVATAR } from '@/constants/index';
const seconds: number = 300;
const fetchAccessToken = (sec: number) => {
    setTimeout(() => {
        const userInfo = getCacheData('userInfo', { type: 'local' });
        const payload = {
            refreshToken: userInfo?.refreshToken
        }
        userInfo?.accessTokenExpiredIn && apiRequest('acc.user.refresh.token', payload).then(res => {
            const data = res.data;
            console.log('res------', res);
            const option = {
                type: 'local',
                lifetime: data.accessTokenExpiredIn && data.accessTokenExpiredIn > 0 ? data.accessTokenExpiredIn : 3600
            }
            const info = {
                ...res.data,
                avatar: DEFAULT_AVATAR,
                name: res.data.fullname
            };
            setCacheData('userInfo', info, option);
            if (option.lifetime >= 20) {
                fetchAccessToken(option.lifetime - 20);
            }
        });
    }, sec * 1000);
}
fetchAccessToken(seconds);