import { Link, useSelector, useLocation, history, useDispatch } from 'umi';
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
    const handleSubmit = () => {
        const postData = {
            app: query.client,
            oauthId: query.oauthId,
            seed: state.seed
        }
        const fields = [
            state.countType,
            state.countType + 'VerifyCode'
        ];
        form.validateFields(fields).then(values => {
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
                        history.push('/');
                    } else {
                        message.error('绑定失败');
                    }
                }
            });
        })
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
    useEffect(() => {
        return () => {
            if (counterTimer['mobile']) {
                clearInterval(counterTimer['mobile'])
            }
            if (counterTimer['email']) {
                clearInterval(counterTimer['email'])
            }
        }
    }, []);
    return (
        <div className={styles.main} >
            <h1 style={{ margin: 0 }}>绑定账号</h1>
            <Divider style={{ margin: '10px 0' }} />
            <Form form={form}>
                <div >
                    <Row>
                        <Col xs={{ span: 5 }}>
                            <img src={query.avatar} width={50} style={{ borderRadius: '25px', marginTop: '40px' }} />
                        </Col>
                        <Col xs={{ span: 19 }}>
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

                                    <Input.Group compact >
                                        <Form.Item name='mobileVerifyCode' rules={[{
                                            required: true,
                                            message: '请输入验证码'
                                        }]}
                                            style={{ width: 'calc(100% - 60px)' }}
                                        >
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
                                    <Input.Group compact>
                                        <Form.Item name='emailVerifyCode' rules={[{
                                            required: true,
                                            message: '请输入验证码'
                                        }]}
                                            style={{ width: 'calc(100% - 60px)' }}
                                        >

                                            <Input size="large" placeholder={"请输入验证码"} />
                                        </Form.Item>
                                        <Button type="primary" disabled={state.emailCount < MAXCOUNT} style={{ width: '60px' }} size='large' onClick={() => onCount('email')}>{state.emailCount >= MAXCOUNT ? '发送' : state.emailCount}</Button>
                                    </Input.Group>

                                </Tabs.TabPane>
                            </Tabs>
                        </Col>

                        <Col xs={{ span: 19 }} push={5}>

                            {loginStore.loginStatus === 'error' &&
                                !submitting &&
                                renderMessage('账户或密码错误')}

                            <Form.Item>
                                <Button size="large" onClick={handleSubmit} className={styles.submit} type="primary" htmlType="submit">绑定</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
                <Row >
                    <Col xs={{ span: 24 }}>

                    </Col>
                </Row>

            </Form>
        </div >
    );
}