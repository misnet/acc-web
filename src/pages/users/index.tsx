import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Divider, Input, Popconfirm, Tag, App, Space, Button } from "antd";
import { apiRequest, getLocalSetting, setLocalSetting } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import EditDrawer from "./components/edit-drawer";
import AssignRolesDrawer from "./components/assign-roles-drawer";
import md5 from 'crypto-js/md5';
import { PlusOutlined } from "@ant-design/icons";
import { SYS_CONFIG } from "@/constants";
import { useSearchParams } from "@umijs/max";
const Page: React.FC = () => {
    const { message } = App.useApp();
    const actionRef = useRef();
    const rolesList = useRef();
    const [state, setState] = useState({
        editData: null,
        editDrawerVisible: false,
        assignDrawerVisible: false
    });
    const [searchParams] = useSearchParams();
    const appId = searchParams.get('appId');
    const appName = searchParams.get('appName');

    useEffect(() => {
        apiRequest('acc.role.list', { pageSize: 1000, appId }).then(response => {

            if (response.success) {
                rolesList.current = response.data.list;
            } else {
                rolesList.current = [];
            }
        });
    }, [])
    const onCloseAssignDrawer = () => {
        setState(prev => ({
            ...prev,
            assignDrawerVisible: false
        }));
    }
    const onEditDrawerOpenChange = (open: boolean) => {
        setState(prev => ({
            ...prev,
            editDrawerVisible: open
        }));
    }
    const onEditUser = (record: any) => {
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
            uid: state.editData?.uid
        }
        if (payload.password && SYS_CONFIG.passwordHashByMd5) {

            payload.password = md5(payload.password).toString();

        }
        if (payload.uid) {
            // 更新
            const response = await apiRequest('acc.user.update', payload);
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
            const response = await apiRequest('acc.user.create', payload);
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
    const onDeleteUser = async (record: any) => {
        console.log('record', record);
        const response = await apiRequest('acc.user.delete', { uid: record.uid });
        if (response.success) {
            message.success('删除成功');
            actionRef.current?.reload();
        } else {
            message.error(response.message || '删除失败');
        }
    }
    const onAssign = async (record: any) => {
        setState(prev => ({
            ...prev,
            editData: record,
            assignDrawerVisible: true
        }));
    }
    const onSaveAssignRoles = async (roleIds: Array<string>) => {
        const response = await apiRequest('acc.user.assignrole', {
            uid: state.editData?.uid,
            rids: roleIds,
            appId
        });
        if (response.success) {
            message.success('保存成功');
            actionRef.current?.reload();
            setState(prev => ({
                ...prev,
                editData: null,
                assignDrawerVisible: false
            }));
        } else {
            message.error(response.message || '保存失败');
        }
    }
    const columns = [
        {
            title: '关键字',
            dataIndex: 'q',
            hideInTable: true,
            valueType: 'text',
            renderFormItem: (item, { type, defaultRender, ...rest }) => {
                return <Input placeholder="姓名/用户名/手机号/Email关键字" allowClear />
            }
        },
        {
            title: '用户ID',
            dataIndex: 'uid',
            key: 'uid',
            hideInSearch: true,
        }, {
            title: '姓名',
            dataIndex: 'fullname',
            key: 'fullname',
            hideInSearch: true,
        }, {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            hideInSearch: true,
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
            hideInSearch: true,
        }, {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            hideInSearch: true,
        }, {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
            hideInSearch: true,
        }, {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            hideInSearch: true,
            render: (text, record) => {
                return record?.roles?.map(item => <Tag color="cyan" key={item.roleId}>{item.roleName}</Tag>)
            }
        }, {
            title: '操作',
            dataIndex: 'action',
            hideInSearch: true,
            key: 'action',
            width: 140,
            fixed: 'right',
            render: (text, record) => (
                <span>
                    <a onClick={() => onEditUser(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title='确定要删除这个用户?'
                        placement="left"
                        onConfirm={() => onDeleteUser(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                    {appId && <>
                        <Divider type="vertical" />
                        <a onClick={() => onAssign(record)}>角色</a></>}
                </span>
            ),
        }];
    return <PageContainer title={appId ? `应用[${appName}]——用户管理` : '用户管理'}>
        <EditDrawer onFinish={onSaveData} dataSource={state.editData} open={state.editDrawerVisible} onOpenChange={onEditDrawerOpenChange} />
        <AssignRolesDrawer onSave={onSaveAssignRoles} rolesList={rolesList.current} open={state.assignDrawerVisible} onClose={onCloseAssignDrawer} user={state.editData} />
        <ProTable
            actionRef={actionRef}
            columns={columns}
            rowKey="uid"
            scroll={{ x: 'max-content' }}
            search={{
                optionRender: (searchConfig, formProps, dom) => {
                    return <Space>{dom}
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => onEditUser(null)}>新增</Button>
                    </Space>
                }
            }}
            pagination={{
                defaultPageSize: getLocalSetting('pageSize', 10),
                showQuickJumper: true,
                showSizeChanger: true
            }}
            request={async (params) => {
                const payload = {
                    ...params
                }
                setLocalSetting('pageSize', params.pageSize || 10);
                let actionName = 'acc.user.alllist';
                if (appId) {
                    payload.appId = appId;
                    actionName = 'acc.user.list';
                }
                const response = await apiRequest(actionName, payload);
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