
import { Input, Modal, Form } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Row, Col } from "antd";
export default ({ editUser = {},
    appList = [],
    onOk = {},
    ...modalProps }) => {
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const submitForm = () => {
        form.validateFields().then(values => {
            onOk({ ...values });
        }).catch(errInfo => {

        });
    };
    const modalOpts = {
        onOk: submitForm,
        ...modalProps
    };
    let appChkList = [];
    //当前应用不可以解绑,disabled:modalOpts.currentAppId==app.id 
    appList.map(app => {
        appChkList.push({ label: app.name, value: parseInt(app.id, 10) });
    });
    console.log('appChkList', appChkList);
    if (!editUser.uid && !editUser.appIds) {
        editUser.appIds = [];
        editUser.appIds.push(parseInt(modalOpts.currentAppId));
    }

    return (
        <Modal {...modalOpts}>
            <Form form={form}>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="用户名"
                    name='username'
                    initialValue={editUser.username}
                    rules={[
                        {
                            required: true,
                            message: "请输入用户名"
                        }
                    ]}
                >
                    <Input placeholder="请输入" maxLength={50} />
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="密  码"
                    name='password'
                    rules={[
                        {
                            required: !editUser.uid,
                            message: "请输入密码"
                        },
                        {
                            min: 6,
                            message: "密码最少6位"
                        }
                    ]}
                >
                    <Input type="text" maxLength={20} placeholder="请输入" />
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="手机号"
                    initialValue={editUser.mobile}
                    name='mobile'
                    rules={[
                        {
                            required: true,
                            message: "请输入手机号码"
                        },
                        {
                            pattern: /^(13|15|17|18|19)([0-9]{9})$/,
                            message: "请输入正确手机号码"
                        }
                    ]}
                ><Input placeholder="请输入" maxLength={11} />
                </FormItem>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="邮箱"
                    name='email'
                    rules={[
                        {
                            required: false,
                            message: "请输入Email"
                        },
                        {
                            type: "email",
                            message: "请输入正确邮箱地址"
                        }
                    ]}
                    initialValue={editUser.email}
                >
                    <Input placeholder="请输入" maxLength={50} />
                </FormItem>

                <Row>
                    <Col span={5}>
                        <FormItem labelCol={{ span: 23 }} label="验证" />
                    </Col>
                    <Col span={7}>
                        <FormItem name='mobileVerified' initialValue={editUser.mobileVerified > 0 ? true : false} valuePropName='checked'>
                            <Checkbox name="mobileVerified" >
                                手机验证
                            </Checkbox>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem name='emailVerified' initialValue={editUser.emailVerified > 0 ? true : false} valuePropName='checked'>
                            <Checkbox name="emailVerified">
                                Email验证
                            </Checkbox>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="应用"
                    name='appIds'
                    initialValue={editUser.appIds}
                    rules={[
                        {
                            type: "array",
                            required: true,
                            min: 1,
                            message: '至少选择1个应用'
                        },
                    ]}
                >
                    <Checkbox.Group options={appChkList} />
                </FormItem>
            </Form>
        </Modal>
    );
};