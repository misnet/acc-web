import { Link, useSelector, useLocation, useDispatch } from 'umi';
import { Input, Alert, Button, Row, Col, Divider, Form, Tabs, message } from 'antd';
import { GooglePlusOutlined } from '@ant-design/icons';
import styles from './Login.less';
import systemConfig from '../../config';
import { useEffect, useState, useRef, createRef } from 'react';
import { generateUUID, setGlobalSetting, getGlobalSetting } from '../../utils/utils';

export default () => {
    const location = useLocation();
    const query = location.query;
    console.log('query', query);
    const MAXCOUNT = 60;
    let counterTimer = { email: null, mobile: null };
    const [state, setState] = useState({
        countType: 'mobile',
        seed: '',
        mobileCount: MAXCOUNT,
        emailCount: MAXCOUNT,
    });
    const counter = useRef({
        email: MAXCOUNT,
        mobile: MAXCOUNT
    });
    const updateState = d => {
        setState(prev => {
            return {
                ...prev,
                ...d
            }
        })
    }
    const [form] = Form.useForm();
    const loadingEffect = useSelector(state => state.loading);
    const loginStore = useSelector(state => state.login);
    const submitting = loadingEffect.effects['login/login'];
    const dispatch = useDispatch();
    const apiConfig = systemConfig.getOption();
    const handleSubmit = (values) => {
        const postData = {
            app: query.client,
            oauthId: query.oauthId,
            seed: state.seed
        }
        if (state.countType === 'mobile') {
            postData.receive = form.getFieldValue('mobile');
            postData.verifyCode = form.getFieldValue('mobileVerifyCode');
        } else {
            postData.receive = form.getFieldValue('email');
            postData.verifyCode = form.getFieldValue('emailVerifyCode');
        }
        dispatch({
            type: 'login/bindLogin',
            payload: postData,
            callback: (result) => {
                console.log('result', result);
                if (result.uid) {

                }
            }
        });
    };

    const renderMessage = content => {
        return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
    };
    const onCount = type => {
        const code = state.countType === 'mobile' ? form.getFieldValue('mobile') : form.getFieldValue('email');
        if (!code) {
            message.error(`请填写${state.countType === 'mobile' ? '手机号' : '邮箱'}`);
            return;
        }
        form.validateFields([state.countType]).then(() => {
            sendVerifyCode();
        }).catch(err => {
            console.log('err', err);
        })

    }
    const sendVerifyCode = () => {
        if (state[state.countType + 'Count'] === MAXCOUNT) {
            counterTimer[state.countType] = setInterval(() => {
                counter.current[state.countType]--;
                if (counter.current[state.countType] === 0) {
                    counter.current[state.countType] = MAXCOUNT;
                }
                updateState({
                    [state.countType + 'Count']: counter.current[state.countType]
                });
                if (counter.current[state.countType] === MAXCOUNT) {
                    clearInterval(counterTimer[state.countType]);
                }
            }, 1000);
            const code = form.getFieldValue(state.countType);
            console.log('code', code);
            dispatch({
                type: 'global/sendSms',
                payload: {
                    receive: code
                },
                callback: (seed) => {
                    updateState({ seed })
                }
            });
        }
    }
    const onTabChange = k => {
        updateState({
            countType: k
        });
    }
    return (
        <div className={styles.main} >
            <Form onFinish={handleSubmit} form={form}>
                <div style={{ padding: '10px', border: '1px solid #dfdfdf' }}>
                    <Row>
                        <Col xs={{ span: 4 }}>
                            <img src={query.avatar} width={50} />
                        </Col>
                        <Col xs={{ span: 20 }}>
                            <h2 style={{ margin: 0 }}>绑定账号</h2>
                            <div>{query.client}</div>
                        </Col>
                    </Row>
                </div>
                <Row >
                    <Col xs={{ span: 24 }}>
                        <Tabs defaultActiveKey='mobile' onChange={onTabChange}>
                            <Tabs.TabPane tab='手机账号' key='mobile'>
                                <Form.Item name='mobile' rules={[{
                                    required: true,
                                    message: '请输入手机号'
                                }, () => ({
                                    validator(_, value) {
                                        if (!value || /^(18|19|17|13|15)(\d{9})$/.test(value)) {
                                            return Promise.resolve();
                                        } else {
                                            return Promise.reject(new Error('手机号不正确'))
                                        }
                                    }
                                })]}>
                                    <Input placeholder={"手机号"} size="large" />
                                </Form.Item>

                                <Input.Group compact>
                                    <Form.Item name='mobileVerifyCode' rules={[{
                                        required: true,
                                        message: '请输入验证码'
                                    }]}>
                                        <Input size="large" placeholder={"请输入验证码"} />
                                    </Form.Item>
                                    <Button type="primary" disabled={state.mobileCount < MAXCOUNT} size='large' style={{ width: '60px' }} onClick={() => onCount('mobile')}>{state.mobileCount >= MAXCOUNT ? '发送' : state.mobileCount}</Button>
                                </Input.Group>


                            </Tabs.TabPane>
                            <Tabs.TabPane tab='邮箱账号' key='email'>
                                <Form.Item name='email' rules={[{
                                    required: true,
                                    message: '请输入邮箱地址'
                                }, {
                                    type: 'email',
                                    message: '请填写正确邮箱地址'
                                }]}>
                                    <Input placeholder={"邮箱地址"} size="large" />
                                </Form.Item>
                                <Form.Item name='emailVerifyCode' rules={[{
                                    required: true,
                                    message: '请输入验证码'
                                }]}>
                                    <Input.Group compact>
                                        <Input size="large" style={{ width: 'calc(100% - 60px)' }} placeholder={"请输入验证码"} />
                                        <Button type="primary" disabled={state.emailCount < MAXCOUNT} style={{ width: '60px' }} size='large' onClick={() => onCount('email')}>{state.emailCount >= MAXCOUNT ? '发送' : state.emailCount}</Button>
                                    </Input.Group>
                                </Form.Item>
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>
                </Row>
                {loginStore.loginStatus === 'error' &&
                    !submitting &&
                    renderMessage('账户或密码错误')}

                <Form.Item>
                    <Button size="large" className={styles.submit} type="primary" htmlType="submit">绑定</Button>
                </Form.Item>
            </Form>
        </div >
    );
}