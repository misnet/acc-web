import { useState } from 'react';
import { Link, useSelector, useDispatch } from 'umi';
import { Input, Alert, Button, Row, Col, Form } from 'antd';
import { ArrowLeftOutlined, GooglePlusOutlined, WechatOutlined } from '@ant-design/icons';
import styles from './Login.less';
import systemConfig from '../../config';
import { generateUUID, setGlobalSetting, getGlobalSetting } from '../../utils/utils';

import logo from '@/assets/logo.svg';
import LoginForm from './components/LoginForm';
export default () => {
    const loadingEffect = useSelector(state => state.loading);
    const loginStore = useSelector(state => state.login);
    const submitting = loadingEffect.effects['login/login'];
    const dispatch = useDispatch();
    const apiConfig = systemConfig.getOption();
    const handleSubmit = (values) => {
        dispatch({
            type: 'login/login',
            payload: {
                ...values
            },
        });
    };
    const [state, setState] = useState({
        visible: false
    });
    const updateState = (d) => {
        setState(prev => {
            return {
                ...prev,
                ...d
            }
        })
    }

    const onConnect = client => {

        const security_token = generateUUID();
        const stateData = {
            url: window.location.origin + '/user/oauth?client=' + client + '&url=/',
            security_token,
            appkey: apiConfig.appKey
        }
        setGlobalSetting({
            [client + '_' + security_token]: security_token
        });
        let state = 'url=' + encodeURIComponent(stateData.url) + '&security_token=' + encodeURIComponent(security_token);
        state += '&appkey=' + stateData.appkey;
        //console.log('state', encodeURIComponent(state));
        const left = (window.screen.availWidth - 600) / 2;
        const baseUrl = `${apiConfig.gateway.split('//')[0]}//${apiConfig.gateway.split('//')[1].split('/')[0]}`;
        const oauthUrl = baseUrl + '/oauth/client?client=' + client + '&state=' + encodeURIComponent(state);
        //updateState({ visible: true, oauthUrl });
        const connectWindow = window.open(oauthUrl, 'connectWindow', 'top=20,left=' + left + ',height=610,width=600,menubar=no,status=no,location=no,toolbar=no');
        connectWindow.addEventListener('beforeunload', () => {
            console.log('test');
        });
    }

    return (
        <>
            <div className={styles.top}>
                <div className={styles.header}>
                    <Link to="/">
                        <img alt="logo" className={styles.logo} src={logo} />
                        <span className={styles.title}>{systemConfig.SYS_NAME}</span>
                    </Link>
                </div>
            </div>
            <div className={styles.main} >
                {!state.visible && <LoginForm
                    handleSubmit={handleSubmit}
                    loginStatus={loginStore.loginStatus}
                    submitting={submitting}
                    onConnect={onConnect}
                />}
                {state.visible && <div>
                    <iframe border={0} src={state.oauthUrl} width='100%' height={400} />
                    <Button onClick={() => updateState({ visible: false })}>使用账号登陆</Button>
                </div>}
            </div></>
    );
}