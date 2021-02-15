/**
 * 个人资料页面
 */
import React, { useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Divider, Button, Form, Spin, Card, Input, Affix, Row, Col, message } from 'antd';
import { history, useIntl, useDispatch } from 'umi';
import styles from '../common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import _ from 'lodash';
import md5 from 'md5';
export default () => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const dispatch = useDispatch();
    const [confirmDirty, setConfirmDirty] = useState(false);
    const onSave = (values) => {
        console.log('values', values);
        form.validateFields().then(values => {
            dispatch({
                type: 'user/changePassword',
                payload: {
                    password: values.password//remove md5
                },
                callback: () => {
                    message.success('密码修改成功');
                }
            })
        }).catch(err => {

        })

    };
    const handleConfirmBlur = (e) => {
        const value = e.target.value;
        setConfirmDirty(prevState => {
            confirmDirty: !prevState
        });
    }
    const compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致');
        } else {
            callback();
        }
    }

    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            form.validateFields(['repassword'], { force: true });
        }
        callback();
    }
    return (
        <PageHeaderWrapper title={'个人中心'}>
            <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>
                        <Button icon={<SaveOutlined />} type="primary" onClick={onSave}>
                            {intl.formatMessage({ id: 'form.save' })}
                        </Button>
                        <Divider />
                    </div>
                </Affix>
                <div className={styles.tableList}>
                    <Form form={form}>
                        <Row>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                                <FormItem
                                    name='password'
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                                    label="新密码"
                                    initialValue=''
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入新密码',
                                        },
                                        {
                                            min: 6,
                                            message: '密码长度不少于6位'
                                        },
                                        {
                                            validator: validateToNextPassword,
                                        }
                                    ]}
                                >
                                    <Input type="password" placeholder="请输入新密码" maxLength={20} />
                                </FormItem>
                            </Col>
                            <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                                <FormItem
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                                    label="确认新密码"
                                    name='repassword'
                                    initialValue=''
                                    dependencies={['password']}
                                    rules={[
                                        {
                                            required: true,
                                            message: '再输一次新密码',
                                        },
                                        {
                                            min: 6,
                                            message: '密码长度不少于6位'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('两次输入的密码不匹配');
                                            },
                                        })
                                    ]}
                                >
                                    <Input type="password" placeholder="请再输入一次新密码" maxLength={20} onBlur={handleConfirmBlur} />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Card>
        </PageHeaderWrapper>
    );
};
