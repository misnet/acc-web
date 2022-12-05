import { useEffect } from 'react';
import { useLocation, useDispatch, useSelector } from 'umi';
import { generateUUID, setGlobalSetting, getGlobalSetting } from '@/utils/utils';
import { Modal } from 'antd';
const Oauth = props => {
    const curLocation = useLocation();
    const dispatch = useDispatch();
    const loginInfo = useSelector(state => state.login);
    const { autologin, url, client, code, security_token, avatar, oauthId, name } = curLocation.query;
    useEffect(() => {

        if (!security_token || !client) {
            console.log('error request');
            return;
        }
        const savedToken = getGlobalSetting(client + '_' + security_token);
        if (!savedToken || savedToken !== security_token) {
            //token不对
            Modal.error({
                content: '验证失败' + client + '_' + security_token
            })
        } else {
            //根据code取token
            const bindUrl = '/user/oauth-bind?avatar=' + encodeURIComponent(avatar) + '&client=' + encodeURIComponent(client) + '&name=' + encodeURIComponent(name) + '&oauthId=' + encodeURIComponent(oauthId);
            console.log(bindUrl);
            const win = window.opener ? window.opener : window;
            if (!code) {
                if (window.opener) {
                    window.opener.location.href = bindUrl;
                    window.close();
                } else {
                    location.href = bindUrl;
                }
            } else {
                if (autologin == 1) {
                    dispatch({
                        type: 'login/loginByCode',
                        payload: {
                            code
                        }
                    });
                } else {
                    let tourl = url;
                    if (url.indexOf('?') === -1) {
                        tourl += '?code=' + code;
                    } else {
                        tourl += '&code=' + code;
                    }
                    if (window.opener) {
                        window.opener.location.href = tourl;
                        window.close();
                    } else {
                        location.href = tourl;
                    }
                }
            }

        }
    }, []);
    useEffect(() => {
        // console.log('loginInfo', loginInfo);
        if (loginInfo.uid && window.opener) {
            console.log('jump to url:', url);
            window.opener.location.href = url ? url : '/';
            window.close();
        }
    }, [loginInfo.uid]);
    return null;
}
export default Oauth;