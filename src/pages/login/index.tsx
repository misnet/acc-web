import { Form, Input, Button, App } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { history, useModel } from '@umijs/max';
import styles from './style.less';
import { useEffect } from 'react';
import Package from '../../../package.json';
const Login: React.FC = () => {
    const userModel = useModel('user');
    interface FormValueType extends Partial<Xpod.LoginInfo> {
        user: string;
        password: string;
    }
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const onLogin = (values: FormValueType) => {
        console.log('values', values);
        userModel.onLogin(values).then((res: any) => {
            if (res.success) {
                // history.push('/home');
            } else if (res.message) {
                message.error(res.message);
            } else {
                message.error('登陆失败');
            }
        });
    };
    useEffect(() => {
        if (userModel.userInfo.uid > 0) {
            history.push('/home');
        }
    }, [userModel.userInfo.uid]);
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={classnames(styles.loginForm, styles.loginColumn)}>
                    <div className={styles.top}>
                        <div className={styles.header}>
                            <img className={styles.logo} src="/static/logo3.svg"></img>
                            <div className={styles.appName}>
                                <span className={styles.title}>{Package.alias}</span>
                                <span>
                                    {Package.name}
                                    <label>V{Package.version}</label>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.main}>
                        <Form onFinish={onLogin} form={form}>
                            <Form.Item
                                name="user"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名',
                                    },
                                ]}
                            >
                                <Input placeholder={'用户名'} size="large" prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            >
                                <Input type="password" size="large" placeholder={'请输入密码'} prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item>
                                <Button size="large" className={styles.submit} type="primary" htmlType="submit">
                                    登陆
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className={classnames(styles.loginColumn, styles.loginBg, styles['bg0'])}></div>
            </div>
        </div>
    );
};
export default Login;
