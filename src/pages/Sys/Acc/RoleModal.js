/**
 * 角色添加修改窗口
 * @author Donny
 *
 */
import { Form, Input, Modal, Checkbox, InputNumber, Radio } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const roleModal = ({
    item = {},
    onOk,
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
        ...modalProps,
    };
    const roleTypeList = [
        {
            id: 1,
            name: '普通角色',
        },
        {
            id: 0,
            name: '超级管理员',
        },
    ];
    const assignPolicyList = [
        {
            id: 0,
            name: '不自动分配',
        },
        {
            id: 1,
            name: '自动分配给已登陆用户',
        },
        {
            id: 2,
            name: '自动分配给未登陆用户',
        },
    ];
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    return (
        <Modal {...modalOpts}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
                {getFieldDecorator('name', {
                    initialValue: item.name,
                    rules: [
                        {
                            required: true,
                            message: '请输入角色名称',
                        },
                    ],
                })(<Input placeholder="请输入" maxLength={50} />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
                {getFieldDecorator('roleType', {
                    initialValue: parseInt(item.roleType),
                    rules: [
                        {
                            required: true,
                            message: '请选择好类型',
                        },
                    ],
                })(
                    <Radio.Group placeholder="请选择类型" style={{ width: '100%' }}>
                        {roleTypeList.map((opt, e) => {
                            const optionComponent = [];
                            optionComponent.push(
                                <Radio key={opt.id} value={opt.id}>
                                    {opt.name}
                                </Radio>
                            );

                            return optionComponent;
                        })}
                    </Radio.Group>
                )}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分配策略">
                {getFieldDecorator('assignPolicy', {
                    initialValue: parseInt(item.assignPolicy),
                    rules: [
                        {
                            required: true,
                            message: '请选择好策略',
                        },
                    ],
                })(
                    <Radio.Group style={{ width: '100%' }}>
                        {assignPolicyList.map((opt, e) => {
                            const optionComponent = [];
                            optionComponent.push(
                                <Radio style={radioStyle} key={opt.id} value={opt.id}>
                                    {opt.name}
                                </Radio>
                            );

                            return optionComponent;
                        })}
                    </Radio.Group>
                )}
            </FormItem>

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="优先级">
                {getFieldDecorator('priority', {
                    initialValue: item.priority ? item.priority : 0,
                    rules: [
                        {
                            required: true,
                            message: '请输入优先级，正整数',
                        },
                    ],
                })(<InputNumber min={0} max={99999} placeholder="请输入" maxLength={5} />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="默认权限">
                {getFieldDecorator('defaultAllow', {
                    initialValue:item.defaultAllow,
                    valuePropName: 'checked',
                })(
                    <Checkbox name="defaultAllow"  value={1}>
                        允许
                    </Checkbox>
                )}
            </FormItem>
        </Modal>
    );
};
roleModal.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
};
export default Form.create()(roleModal);
