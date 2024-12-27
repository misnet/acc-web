import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Divider, Popconfirm, Tag, App, Space, Button, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import { apiRequest, getLocalSetting, setLocalSetting } from "@/utils/utils";
import { useRef, useState } from "react";
import EditDrawer from "./components/edit-drawer";
import { Link, useSearchParams } from "@umijs/max";
import { getRoleAssignPolicyText } from "@/constants/format";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
const Page: React.FC = () => {
    const { message } = App.useApp();
    const actionRef = useRef();
    const [searchParams] = useSearchParams();
    const appId = searchParams.get('appId');
    const appName = searchParams.get('appName');
    const [state, setState] = useState({
        editData: null,
        editDrawerVisible: false
    });
    const onEditDrawerOpenChange = (open: boolean) => {
        setState(prev => ({
            ...prev,
            editDrawerVisible: open
        }));
    }
    const onEdit = (record: any) => {
        setState(prev => ({
            ...prev,
            editData: record,
            editDrawerVisible: true
        }));
    }
    const onSaveData = async (values: any) => {
        console.log('values', values);
        if (Array.isArray(values.parentId) && values.parentId.length > 0) {
            values.parentId = values.parentId[values.parentId.length - 1];
        } else {
            values.parentId = 0;
        }
        const payload = {
            ...values,
            appId,
            id: state.editData?.id
        }
        if (payload.id) {
            // 更新
            const response = await apiRequest('acc.menu.update', payload);
            if (response.success) {
                message.success('更新成功');
                actionRef.current?.reload();
                setState(prev => ({
                    ...prev,
                    editData: null,
                    editDrawerVisible: false
                }));
            } else {
                message.error(response.message || '更新失败');
            }
        } else {
            // 新增
            const response = await apiRequest('acc.menu.create', payload);
            if (response.success) {
                message.success('新增成功');
                actionRef.current?.reload();
                setState(prev => ({
                    ...prev,
                    editData: null,
                    editDrawerVisible: false
                }));
            } else {
                message.error(response.message || '新增失败');
            }
        }
    }
    const onDelete = async (record: any) => {
        console.log('record', record);
        const response = await apiRequest('acc.menu.delete', { id: record.id });
        if (response.success) {
            message.success('删除成功');
            actionRef.current?.reload();
        } else {
            message.error(response.message || '删除失败');
        }
    }
    const columns = [
        {
            title: "菜单名",
            dataIndex: "name",
            key: "name",
            hideInSearch: true,
            render: (text, record) => record.name
        },
        {
            title: "ID",
            dataIndex: "id",
            hideInSearch: true,
            key: "id"
        },
        {
            title: "链接",
            key: "link",
            hideInSearch: true,
            render: (text, record) => record.url
        },
        {
            title: "显示",
            dataIndex: "display",
            key: "display",
            hideInSearch: true,
            render: (text, record) => record.display === 'y' ? <Tag color='success'>显示</Tag> : <Tag color='error'>隐藏</Tag>
        },
        {
            title: "排序权重",
            key: "sortByWeight",
            hideInSearch: true,
            render: (text, record) => record.sortByWeight
        },
        {
            title: "操作",
            key: "action",
            hideInSearch: true,
            width: 100,
            fixed: 'right',
            render: (text, record) => (
                <span>
                    <a onClick={() => onEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="菜单删除时，子菜单也会被一起删除，确定要删除这个菜单?"
                        placement="left"
                        onConfirm={() => onDelete(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </span>
            )
        }
    ];

    return <PageContainer title={appId ? `应用[${appName}]——菜单管理` : '菜单管理'}>
        <EditDrawer appId={appId} onFinish={onSaveData} dataSource={state.editData} open={state.editDrawerVisible} onOpenChange={onEditDrawerOpenChange} />
        <ProTable
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            search={false}
            toolBarRender={() => [
                <Button type="primary" key="add" icon={<PlusOutlined />} onClick={() => onEdit(null)}>新增</Button>
            ]}
            pagination={false}
            request={async (params) => {
                const payload = {
                    ...params,
                    appId
                }
                setLocalSetting('pageSize', params.pageSize || 10);
                const response = await apiRequest('acc.menu.list', payload);
                if (response.success) {
                    return {
                        data: response.data,
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
    </PageContainer>
}
export default Page;