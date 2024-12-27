import { PageContainer, ProForm, ProFormRadio, ProTable } from "@ant-design/pro-components";
import { Divider, Popconfirm, Tag, App, Space, Button, Dropdown, Input, Radio, Form } from "antd";
import { apiRequest } from "@/utils/utils";
import { useRef, useState } from "react";
import { Link, useSearchParams, history } from "@umijs/max";
import { ArrowLeftOutlined, ArrowUpOutlined, DownOutlined, SaveOutlined } from "@ant-design/icons";
import type { ProFormInstance } from '@ant-design/pro-components';
const Page: React.FC = () => {
    const [formRef] = Form.useForm();
    const [searchParams] = useSearchParams();
    const rid = searchParams.get('rid');
    const res = searchParams.get('rescode');
    const dataId = searchParams.get('dataId');

    const appId = searchParams.get('appId');
    const appName = searchParams.get('appName');
    const { message, modal } = App.useApp();
    const actionRef = useRef();
    const onSelectAll = (e) => {
        const items = formRef.getFieldsValue();
        const fieldNameList = Object.keys(items).filter(key => key.startsWith('assign_'));
        const payload = {};
        console.log('e.target.value', e.target.value);
        fieldNameList.forEach(fieldName => {
            payload[fieldName] = e.target.value;
        });
        formRef.setFieldsValue(payload);

        // let newData = [];
        // if (e.target.value === 1) {
        //     newData = data.op.map(record => {
        //         form.setFieldsValue({
        //             ['assign_' + record.code]: 1
        //         });
        //         return {
        //             ...record,
        //             allow: 1
        //         }
        //     });
        // } else if (e.target.value === 0) {
        //     newData = data.op.map(record => {
        //         form.setFieldsValue({
        //             ['assign_' + record.code]: 0
        //         });
        //         return {
        //             ...record,
        //             allow: 0
        //         }
        //     });


        // } else {
        //     newData = data.op.map(record => {
        //         form.setFieldsValue({
        //             ['assign_' + record.code]: -1
        //         });
        //         return {
        //             ...record,
        //             allow: -1
        //         }
        //     });
        // }
        // dispatch({
        //     type: 'operations/save',
        //     payload: {
        //         ...data,
        //         op: newData
        //     }
        // })
    }

    const columns = [
        {
            title: '操作名称',
            key: 'text',
            dataIndex: 'text',
            hideInSearch: true,
        },
        {
            title: '操作代码',
            key: 'code',
            hideInSearch: true,
            dataIndex: 'code',
        },
        {
            title: '当前权限结果',
            key: 'allow',
            dataIndex: 'allow',
            hideInSearch: true,
            render: (text, record) => <span>{record.allow === 'y' ? <Tag color='success'>允许</Tag> : (record.allow === 'n') ? <Tag color='error'>拒绝</Tag> : <Tag>不设置</Tag>}</span>,
        },
        {
            title: (
                <Radio.Group
                    size="small"
                    buttonStyle="solid"
                    onChange={onSelectAll}
                >
                    <Radio.Button value={'y'}>允许</Radio.Button>
                    <Radio.Button value={'n'}>拒绝</Radio.Button>
                    <Radio.Button value={''}>不设置</Radio.Button>

                </Radio.Group>
            ),
            key: 'assign',
            width: 300,
            fixed: 'right',
            dataIndex: 'assign',
            render: (text, record) => {
                return <Form.Item name={'assign_' + record.code} style={{ marginBottom: '0' }}><Radio.Group
                    size="small"
                    buttonStyle="solid"

                >
                    <Radio.Button value={'y'}>允许</Radio.Button>
                    <Radio.Button value={'n'}>拒绝</Radio.Button>
                    <Radio.Button value={''}>不设置</Radio.Button>
                </Radio.Group></Form.Item>

            }
        },
    ];
    const onSave = async () => {
        const values = formRef.getFieldsValue();
        const payload = {
            rid,
            res,
            appId,
            dataId,
            opcodes: []
        }
        Object.keys(values).forEach(key => {
            if (key.startsWith('assign_')) {
                payload.opcodes.push({
                    code: key.replace('assign_', ''),
                    allow: values[key]
                })
            }
        });
        const response = await apiRequest('acc.role.save.operations', payload);
        if (response.success) {
            message.success('保存成功');
            history.back();
        } else {
            message.error(response.message || '保存失败');
        }
    }
    const onBack = () => {
        location.href = '/roles?appId=' + appId + '&appName=' + (appName ? encodeURIComponent(appName) : '');
    }
    return <PageContainer title={appName ? `应用[${appName}]——分配资源` : '分配资源'}>
        <Form form={formRef}>
            <ProTable
                actionRef={actionRef}
                columns={columns}
                rowKey="code"
                scroll={{ x: 'max-content' }}
                search={false}
                toolBarRender={() => [
                    <Button type="default" key='return' icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>,
                    <Button type="primary" key='save' icon={<SaveOutlined />} onClick={onSave}>保存</Button>,
                ]}
                pagination={false}
                request={async () => {
                    const payload = {
                        rid,
                        res,
                        dataId,
                        appId
                    }
                    const response = await apiRequest('acc.role.listops', payload);
                    if (response.success) {
                        setTimeout(() => {

                            const data = {};
                            response.data.op.map(record => {
                                data['assign_' + record.code] = record.allow;
                            });
                            console.log('data', data);
                            formRef.setFieldsValue(data);
                        }, 200)
                        return {
                            data: response.data.op,
                            total: response.data.length,
                            success: true,
                        }
                    } else {
                        return {
                            data: [],
                            total: 0,
                            success: true,
                        }
                    }
                    console.log('response', response);

                }}
            />
        </Form>
    </PageContainer>
}
export default Page;