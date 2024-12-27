import { login } from '@/services/user';
import { setCacheData, getCacheData } from '@/utils/utils';
import { useRequest, useModel } from 'umi';
import { DEFAULT_AVATAR, DEFAULT_USERINFO, SYS_CONFIG } from '@/constants/index';
import { useState } from 'react';
import md5 from 'crypto-js/md5';
const useUser = () => {
    const [userInfo, setUserInfo] = useState<Kuga.UserInfo>(DEFAULT_USERINFO);
    const { setInitialState } = useModel('@@initialState');
    const onLoginRequest = useRequest(login, {
        manual: true,
    });
    const loadingEffects = {
        onLogin: onLoginRequest.loading,
    };
    const onLogout = () => {
        setCacheData('userInfo', DEFAULT_USERINFO, { type: 'local' });
        setInitialState(DEFAULT_USERINFO);
        setUserInfo(DEFAULT_USERINFO);
    }
    const getUserInfo = () => {
        const info = getCacheData('userInfo', { type: 'local' });
        if (info) {
            setInitialState(info);
        }
    }
    const updateUserInfo = (updatedData: any) => {
        const option = {
            type: 'local',
            lifetime: 3600
        }
        const info = getCacheData('userInfo', { type: 'local' });
        const newInfo = {
            ...info,
            ...updatedData
        }
        setCacheData('userInfo', newInfo, option);
        setInitialState(newInfo);
        setUserInfo(newInfo);
    }

    const onLogin = (payload: Xpod.LoginInfo) => {
        const value = { ...payload };
        if (value.password && SYS_CONFIG.passwordHashByMd5) {
            value.password = md5(value.password).toString();
        }
        return onLoginRequest.run(value).then(async (res: any) => {
            if (res.success) {
                const option = {
                    type: 'local',
                    lifetime: 3600
                }
                const info: Kuga.UserInfo = {
                    ...res.data,
                    avatar: DEFAULT_AVATAR,
                    name: res.data.fullname
                };
                await setInitialState(info);
                setCacheData('userInfo', info, option);
                setUserInfo(info);
            }
            return res;
        });
    };
    return {
        getUserInfo,
        updateUserInfo,
        userInfo,
        onLogout,
        onLogin,
        loadingEffects,
    };
};

export default useUser;
