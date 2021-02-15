
import { Input, Modal, Form } from "antd";
import React from "react";
import { Checkbox, Row, Col } from "antd";


export default ({
    editData = {},
    onOk = {},
    ...modalProps
}) => {
    const [form] = Form.useForm();
    const FormItem = Form.Item;
    const submitForm = () => {
        form.validateFields().then(values => {
            onOk({ ...values });
        }).catch(err => { })
    };
    const modalOpts = {
        onOk: submitForm,
        ...modalProps
    };
    return (
        <Modal {...modalOpts}>
            <Form form={form}>
                {editData.id ? <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="应用ID"
                    name='id'
                    initialValue={editData.id}

                ><Input disabled />
                </FormItem> : null}

                {editData.id ? <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="应用Secret"
                    name='secret'
                    initialValue={editData.secret}
                >
                    <Input.TextArea placeholder="请输入" rows={3} disabled />
                </FormItem> : null}

                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="应用名称"
                    name='name'
                    initialValue={editData.name}
                    rules={[
                        {
                            required: true,
                            message: "请输入应用名称"
                        }
                    ]}
                >
                    <Input placeholder="请输入" maxLength={20} />
                </FormItem>

                <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="应用描述"
                    name='shortDesc'
                    initialValue={editData.shortDesc}
                >
                    <Input.TextArea placeholder="请输入" maxLength={300} />
                </FormItem>
                <Row>
                    <Col span={5}>
                        <FormItem labelCol={{ span: 23 }} label="选项" />
                    </Col>
                    {editData.id ?
                        <Col span={10}>
                            <FormItem initialValue={false} valuePropName='checked' name='autoCreateSecret' >

                                <Checkbox name="autoCreateSecret" value={true}>
                                    重新生成appSecret
                            </Checkbox>

                            </FormItem>
                        </Col> : null}
                    <Col span={9}>
                        <FormItem name='disabled' valuePropName='checked' initialValue={editData.disabled}>
                            <Checkbox name="disabled" value={1}>
                                禁用
                            </Checkbox>
                        </FormItem>
                    </Col>
                </Row></Form>
        </Modal>
    );
};

