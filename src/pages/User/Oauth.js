import { useEffect } from 'react';
import { useLocation, useDispatch, useSelector } from 'umi';
import { generateUUID, setGlobalSetting, getGlobalSetting } from '@/utils/utils';
const Oauth = props => {
    const curLocation = useLocation();
    const dispatch = useDispatch();
    const loginInfo = useSelector(state => state.login);
    const { url, client, code, security_token } = curLocation.query;
    useEffect(() => {

        if (!security_token || !client || !code) {
            console.log('error request');
            return;
        }
        const savedToken = getGlobalSetting(client + '_' + security_token);
        if (!savedToken || savedToken !== security_token) {
            //token不对
            console.log('error token')
        } else {
            //根据code取token
            dispatch({
                type: 'login/loginByCode',
                payload: {
                    code
                }
            });
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