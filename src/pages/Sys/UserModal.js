import { Form, Input, Modal } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Row, Col } from "antd";

const FormItem = Form.Item;
const userModal = ({
    editUser = {},
    appList = [],
    onOk = {},
    form: { getFieldDecorator, validateFields, getFieldsValue },
    ...modalProps
}) => {
    const submitForm = () => {
        validateFields(err => {
            if (!err) {
                onOk({ ...getFieldsValue() });
            }
        });
    };
    const modalOpts = {
        onOk: submitForm,
        ...modalProps
    };
    let appChkList = [];
    //当前应用不可以解绑,disabled:modalOpts.currentAppId==app.id 
    appList.map(app => {
        appChkList.push({ label: app.name, value: parseInt(app.id,10)});
    });
    if(!editUser.uid && !editUser.appIds){
      editUser.appIds = [];
      editUser.appIds.push(parseInt(modalOpts.currentAppId));
    }
    return (
        <Modal {...modalOpts}>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="用户名"
            >
                {getFieldDecorator("username", {
                    initialValue: editUser.username,
                    rules: [
                        {
                            required: true,
                            message: "请输入用户名"
                        }
                    ]
                })(<Input placeholder="请输入" maxLength={50} />)}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="密  码"
            >
                {getFieldDecorator("password", {
                    rules: [
                        {
                            required: !editUser.uid,
                            message: "请输入密码"
                        },
                        {
                            min: 6,
                            message: "密码最少6位"
                        }
                    ]
                })(<Input type="text" maxLength={20} placeholder="请输入" />)}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="手机号"
            >
                {getFieldDecorator("mobile", {
                    initialValue: editUser.mobile,
                    rules: [
                        {
                            required: true,
                            message: "请输入手机号码"
                        },
                        {
                            pattern: /^(13|15|17|18|19)([0-9]{9})$/,
                            message: "请输入正确手机号码"
                        }
                    ]
                })(<Input placeholder="请输入" maxLength={11} />)}
            </FormItem>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="邮箱"
            >
                {getFieldDecorator("email", {
                    initialValue: editUser.email,
                    rules: [
                        {
                            required: false,
                            message: "请输入Email"
                        },
                        {
                            type: "email",
                            message: "请输入正确邮箱地址"
                        }
                    ]
                })(<Input placeholder="请输入" maxLength={50} />)}
            </FormItem>

            <Row>
                <Col span={5}>
                    <FormItem labelCol={{ span: 23 }} label="验证" />
                </Col>
                <Col span={7}>
                    <FormItem>
                        {getFieldDecorator("mobileVerified", {
                            initialValue: editUser.mobileVerified,
                            valuePropName: "checked"
                        })(
                            <Checkbox name="mobileVerified" value={1}>
                                手机验证
                            </Checkbox>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem>
                        {getFieldDecorator("emailVerified", {
                            initialValue: editUser.emailVerified,
                            valuePropName: "checked"
                        })(
                            <Checkbox name="emailVerified" value={1}>
                                Email验证
                            </Checkbox>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="应用"
            >
                {getFieldDecorator("appIds", {
                    initialValue: editUser.appIds,
                    rules:[
                      {
                        type:"array",
                        required:true,
                        min:1,
                        message: '至少选择1个应用'
                      },
                    ]
                })(<Checkbox.Group options={appChkList} />)}
            </FormItem>
        </Modal>
    );
};
userModal.propTypes = {
    form: PropTypes.object.isRequired,
    confirmLoading: PropTypes.bool,
    editUser: PropTypes.object,
    appList: PropTypes.array,
    onOk: PropTypes.func
};
export default Form.create()(userModal);
