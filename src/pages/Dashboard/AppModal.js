import { Form, Input, Modal } from "antd";
import React from "react";
import PropTypes from "prop-types";
import { Checkbox, Row, Col } from "antd";

const FormItem = Form.Item;
const appModal = ({
    editData = {},
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
    return (
        <Modal {...modalOpts}>
            {editData.id?<FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="应用ID"
            >
                {getFieldDecorator("id", {
                    initialValue: editData.id,
                    rules: [
                        
                    ]
                })(<Input disabled/>)}
            </FormItem>:null}

            {editData.id?<FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="应用Secret"
            >
                {getFieldDecorator("secret", {
                    initialValue: editData.secret,
                    rules: [
                        
                    ]
                })(<Input.TextArea placeholder="请输入" rows={3} disabled/>)}
            </FormItem>:null}

            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="应用名称"
            >
                {getFieldDecorator("name", {
                    initialValue: editData.name,
                    rules: [
                        {
                            required: true,
                            message: "请输入应用名称"
                        }
                    ]
                })(<Input placeholder="请输入" maxLength={20} />)}
            </FormItem>
            
            <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="应用描述"
            >
                {getFieldDecorator("shortDesc", {
                    initialValue: editData.shortDesc,
                    rules: [
                        
                    ]
                })(<Input.TextArea placeholder="请输入" maxLength={300} />)}
            </FormItem>
            <Row>
                <Col span={5}>
                    <FormItem labelCol={{ span: 23 }} label="选项" />
                </Col>
                {editData.id?
                <Col span={10}>
                    <FormItem>
                        {getFieldDecorator("autoCreateSecret", {
                            initialValue: 0,
                            valuePropName: "checked"
                        })(
                            <Checkbox name="autoCreateSecret" value={1}>
                                重新生成appSecret
                            </Checkbox>
                        )}
                    </FormItem>
                </Col>:null}
                <Col span={9}>
                    <FormItem>
                        {getFieldDecorator("disabled", {
                            initialValue: editData.disabled,
                            valuePropName: "checked"
                        })(
                            <Checkbox name="disabled" value={1}>
                                禁用
                            </Checkbox>
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Modal>
    );
};
appModal.propTypes = {
    form: PropTypes.object.isRequired,
    confirmLoading: PropTypes.bool,
    editData: PropTypes.object,
    onOk: PropTypes.func
};
export default Form.create()(appModal);
