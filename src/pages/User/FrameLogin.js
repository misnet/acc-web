import { useState } from 'react';
import { Link, useSelector, useDispatch, useLocation } from 'umi';
import { Input, Alert, Button, Row, Col, Form } from 'antd';
import { ArrowLeftOutlined, GooglePlusOutlined, WechatOutlined } from '@ant-design/icons';
import styles from './Login.less';
import systemConfig from '../../config';
import { generateUUID, setGlobalSetting, getGlobalSetting } from '../../utils/utils';

import logo from '@/assets/logo.svg';
import LoginForm from './components/XLoginForm';
export default () => {
    const loadingEffect = useSelector(state => state.loading);
    const loginStore = useSelector(state => state.login);
    const submitting = loadingEffect.effects['login/login'];
    const dispatch = useDispatch();
    const apiConfig = systemConfig.getOption();
    const curLocation = useLocation();
    const { url, autologin = 0 } = curLocation.query;
    const handleSubmit = (values) => {
        dispatch({
            type: 'login/login',
            payload: {
                ...values
            },
            callback: (result) => {
                if (autologin !== 1) {
                    let tourl = url;
                    if (url.indexOf('?') === -1) {
                        tourl += '?code=' + result.code;
                    } else {
                        tourl += '&code=' + result.code;
                    }
                    if (window.opener) {
                        window.opener.location.href = tourl;
                        window.close();
                    } else {
                        location.href = tourl;
                    }
                }
            }
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
                />}
                {state.visible && <div>
                    <iframe border={0} src={state.oauthUrl} width='100%' height={400} />
                    <Button onClick={() => updateState({ visible: false })}>使用账号登陆</Button>
                </div>}
            </div></>
    );
}