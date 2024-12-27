import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Divider, Popconfirm, Tag, App, Space, Button, Dropdown } from "antd";
import type { MenuProps } from 'antd';
import { apiRequest, getLocalSetting, setLocalSetting } from "@/utils/utils";
import { useRef, useState } from "react";
import EditDrawer from "./components/edit-drawer";
import AssignUsersDrawer from "./components/assign-users-drawer";
import { getRoleAssignPolicyText } from "@/constants/format";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { history, useSearchParams } from '@umijs/max';
const Page: React.FC = () => {
    const { message } = App.useApp();
    const actionRef = useRef();
    const [searchParams] = useSearchParams();
    const appId = searchParams.get('appId');
    const appName = searchParams.get('appName');
    const [state, setState] = useState({
        editData: null,
        editDrawerVisible: false,
        assignUserDrawerVisible: false
    });
    const onCloseAssignUserDrawer = () => {
        setState(prev => ({
            ...prev,
            assignUserDrawerVisible: false
        }))
    }
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
        const payload = {
            ...values,
            appId,
            defaultAllow: values.defaultAllow ? 'y' : 'n',
            id: state.editData?.id
        }
        if (payload.id) {
            // 更新
            const response = await apiRequest('acc.role.update', payload);
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
            const response = await apiRequest('acc.role.create', payload);
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
        const response = await apiRequest('acc.role.delete', { id: record.id });
        if (response.success) {
            message.success('删除成功');
            actionRef.current?.reload();
        } else {
            message.error(response.message || '删除失败');
        }
    }
    const items: MenuProps['items'] = [
        { key: "assignMenu", label: "分配菜单" },
        { key: "assignResource", label: "分配资源" }
    ];
    const onKeyClick = (key: string, record: any) => {
        if (key === 'assignMenu') {
            history.push(`/roles/assign-menus?rid=${record.id}&appId=${appId}&appName=${appName ? encodeURIComponent(appName) : ''}`);
        } else if (key === 'assignResource') {
            history.push(`/roles/resources?rid=${record.id}&appId=${appId}&appName=${appName ? encodeURIComponent(appName) : ''}`);
        }

    }
    const onAssignUsers = (record: any) => {
        setState(prev => ({
            ...prev,
            editData: record,
            assignUserDrawerVisible: true
        }));
    }
    const onSaveAssignUsers = async (uids: Array<string>) => {
        const response = await apiRequest('acc.role.assignuser', {
            rid: state.editData.id,
            uid: uids,
            appId
        });
        if (response.success) {
            message.success('保存成功');
            actionRef.current?.reload();
            setState(prev => ({
                ...prev,
                editData: null,
                assignUserDrawerVisible: false
            }));
        } else {
            message.error(response.message || '保存失败');
        }
    }
    const columns = [
        {
            title: "ID",
            key: "id",
            dataIndex: "id",
            hideInSearch: true
        },
        {
            title: "优先级",
            key: "priority",
            dataIndex: "priority",
            hideInSearch: true
        },
        {
            title: "角色名称",
            key: "name",
            dataIndex: "name",
            hideInSearch: true
        },
        {
            title: "用户数量",
            key: "cntUser",
            dataIndex: "cntUser",
            hideInSearch: true,
            align: 'center',
            render: (text, record) => (
                <a onClick={() => onAssignUsers(record)}>
                    {record.cntUser}
                </a>
            )
        },
        {
            title: "类型",
            key: "roleType",
            dataIndex: "roleType",
            hideInSearch: true,
            render: (text, record) =>
                record.roleType == 1 ? "普通" : "超级管理员"
        },
        {
            title: "默认权限",
            key: "defaultAllow",
            dataIndex: "defaultAllow",
            hideInSearch: true,
            render: (text, record) =>
                record.defaultAllow === 'y' ? <Tag color="success">允许</Tag> : <Tag color="error">拒绝</Tag>
        },
        {
            title: "分配策略",
            key: "assignPolicy",
            dataIndex: "assignPolicy",
            hideInSearch: true,
            render: (text, record) => getRoleAssignPolicyText(record.assignPolicy)
        },
        {
            title: "操作",
            key: "action",
            fixed: 'right',
            width: 150,
            hideInSearch: true,
            render: (text, record) => (
                <span>
                    <a onClick={() => onEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title='确定要删除这个角色?'
                        onConfirm={() => onDelete(record)}>
                        <a >删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Dropdown
                        menu={{
                            items,
                            onClick: ({ key }) => onKeyClick(key, record)
                        }}
                    ><a>更多<DownOutlined /></a></Dropdown>
                </span>
            )
        }
    ];

    return <PageContainer title={appId ? `应用[${appName}]——角色管理` : '角色管理'}>
        <AssignUsersDrawer onSave={onSaveAssignUsers} open={state.assignUserDrawerVisible} role={state.editData} onClose={onCloseAssignUserDrawer} />
        <EditDrawer onFinish={onSaveData} dataSource={state.editData} open={state.editDrawerVisible} onOpenChange={onEditDrawerOpenChange} />
        <ProTable
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            search={false}
            toolBarRender={() => [
                <Button type="primary" key="add" icon={<PlusOutlined />} onClick={() => onEdit(null)}>新增</Button>
            ]}
            pagination={{
                defaultPageSize: getLocalSetting('pageSize', 10),
                showQuickJumper: true,
                showSizeChanger: true
            }}
            request={async (params) => {
                const payload = {
                    ...params,
                    appId
                }
                setLocalSetting('pageSize', params.pageSize || 10);
                const response = await apiRequest('acc.role.list', payload);
                if (response.success) {
                    return {
                        data: response.data.list,
                        total: response.data.total,
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