/**
 * 角色添加修改窗口
 * @author Donny
 *
 */
import { Input, Modal, Checkbox, InputNumber, Radio, Form } from 'antd';
import { useEffect } from 'react';
import { } from 'umi';
import PropTypes from 'prop-types';
import DICT from '@/dict';

export default ({
    item = {},
    onOk,
    ...modalProps
}) => {
    const FormItem = Form.Item;
    const [form] = Form.useForm();
    const submitForm = () => {
        form.validateFields().then(values => {
            onOk({ ...values });
        }).catch(err => { })
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
            id: DICT.ROLE_ASSIGN_POLICY_NOAUTO,
            name: '不自动分配',
        },
        {
            id: DICT.ROLE_ASSIGN_POLICY_TO_LOGINED,
            name: '自动分配给已登陆用户',
        },
        {
            id: DICT.ROLE_ASSIGN_POLICY_TO_UNLOGINED,
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
            <Form form={form}>
                <FormItem name='name' initialValue={item.name} rules={[
                    {
                        required: true,
                        message: '请输入角色名称',
                    },
                ]} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名称">
                    <Input placeholder="请输入" maxLength={50} />
                </FormItem>
                <FormItem name='roleType' rules={[
                    {
                        required: true,
                        message: '请选择好类型',
                    },
                ]} initialValue={parseInt(item.roleType)} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">

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

                </FormItem>
                <FormItem rules={[
                    {
                        required: true,
                        message: '请选择好策略',
                    },
                ]} name='assignPolicy' initialValue={parseInt(item.assignPolicy)} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分配策略">

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
                </FormItem>

                <FormItem rules={[
                    {
                        required: true,
                        message: '请输入优先级，正整数',
                    },
                ]} name='priority' initialValue={item.priority ? item.priority : 0} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="优先级">
                    <InputNumber min={0} max={99999} placeholder="请输入" maxLength={5} />
                </FormItem>
                <FormItem name='defaultAllow' initialValue={item.defaultAllow} valuePropName='checked' labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="默认权限">

                    <Checkbox name="defaultAllow" value={1}>
                        允许
                    </Checkbox>
                </FormItem>
            </Form>
        </Modal >
    );
};
