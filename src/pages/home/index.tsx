
import { apiRequest } from '@/utils/utils';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { App, Button, Card, Divider, Badge, Typography } from 'antd';
import { useRef, useState } from 'react';
import EditAppDrawer from './components/edit-app-drawer';
import { Link } from '@umijs/max';
import style from './index.less';
import { AppstoreOutlined, DeleteOutlined, EditOutlined, MenuOutlined, SettingOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
import ConfirmRemoveModal from './components/confirm-remove';
const HomePage: React.FC = () => {
    const { message } = App.useApp();
    const actRef = useRef();
    const [state, setState] = useState({
        editData: null,
        editDrawerVisible: false,
        removeModalVisible: false,
    })
    const onEdit = (item: any) => {
        setState(prev => ({
            ...prev,
            editData: item,
            editDrawerVisible: true,
        }))
    }
    const onOpenChange = (open: boolean) => {
        setState(prev => ({
            ...prev,
            editDrawerVisible: open,
        }))
    }
    const onSaveApp = async (values: Record<string, any>) => {
        let response;
        if (!state.editData?.id)
            response = await apiRequest('acc.app.create', values);
        else {
            response = await apiRequest('acc.app.update', {
                ...values,
                id: state.editData.id,
            });
        }
        if (response.success) {
            setState(prev => ({
                ...prev,
                editDrawerVisible: false,
            }));
            message.success('保存成功');
            actRef.current?.reload();
        } else {
            message.error(response.message || '保存失败');
        }
    }
    const onToggleConfirmRemoveModal = (visible: boolean) => {
        setState(prev => ({
            ...prev,
            removeModalVisible: visible,
        }))
    }
    const onDelete = (item: any) => {
        setState(prev => ({
            ...prev,
            editData: item,
            removeModalVisible: true,
        }))
    }
    const onConfirmDelete = async (values: any) => {
        const response = await apiRequest('acc.app.delete', {
            ...values,
            id: state.editData.id,
        });
        if (response.success) {
            setState(prev => ({
                ...prev,
                removeModalVisible: false,
            }));
            message.success('删除成功');
            actRef.current?.reload();
        } else {
            message.error(response.message || '删除失败');
        }
    }
    return (
        <PageContainer >
            <ConfirmRemoveModal onConfirm={onConfirmDelete} open={state.removeModalVisible} onOpenChange={onToggleConfirmRemoveModal} />
            <EditAppDrawer onFinish={onSaveApp} dataSource={state.editData} open={state.editDrawerVisible} onOpenChange={onOpenChange} />
            <Card extra={<Button type='primary' onClick={() => onEdit(null)}>新建应用</Button>}>
                <ProList
                    actionRef={actRef}
                    rowKey="id"
                    grid={{ gutter: 10, column: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                    itemCardProps={{
                        bodyStyle: {
                            padding: 5,
                        }
                    }}
                    request={async (params) => {
                        const response = await apiRequest('acc.app.list', {
                            ...params,
                            pageSize: 100,
                            pageNo: params.current || 1,
                        });
                        if (response.success) {
                            return {
                                data: response.data.list?.map(item => {
                                    return {

                                        ...item,
                                        avatar: item.allowAutoCreateUser === 'y' ? <Badge color='red' text={' '} /> : <Badge color='cyan' text={' '} />,
                                        name: <>  {item.name}</>,
                                        actions: [
                                            <a key='edit' title="修改" onClick={() => onEdit(item)}><EditOutlined /></a>,
                                            <Divider key="d" type="vertical" />,
                                            <a key='delete' title="删除" onClick={() => onDelete(item)}><DeleteOutlined /></a>
                                        ],
                                        content: (

                                            <Card size='small' title={<Typography.Text copyable={{ text: item.secret }}>secret: {item.secret}</Typography.Text>} style={{ width: '100%' }}>
                                                <Card.Grid className={style.grid}><Link to={`/users?appId=${item.id}&appName=${encodeURIComponent(item.name)}`}><UserOutlined /> 用户管理</Link></Card.Grid>
                                                <Card.Grid className={style.grid}><Link to={`/roles?appId=${item.id}&appName=${encodeURIComponent(item.name)}`}><UsergroupAddOutlined /> 角色管理</Link></Card.Grid>
                                                <Card.Grid className={style.grid}><Link to={`/menus?appId=${item.id}&appName=${encodeURIComponent(item.name)}`}><MenuOutlined /> 菜单管理</Link></Card.Grid>
                                                <Card.Grid className={style.grid}><Link to={`/configuration?appId=${item.id}&appName=${encodeURIComponent(item.name)}`}><SettingOutlined /> 配置管理</Link></Card.Grid>
                                            </Card>
                                        )
                                    }
                                }),
                                total: response.total,
                                success: true,
                            };
                        }

                        return {
                            data: [],
                            success: true,
                        };
                    }}
                    metas={{
                        avatar: {
                            dataIndex: 'avatar',
                        },
                        title: {
                            dataIndex: 'name',
                        },
                        subTitle: {
                            dataIndex: 'id',
                        },
                        actions: {
                            dataIndex: 'actions',
                        },
                        content: {
                            dataIndex: 'content',
                        },
                        description: {
                            dataIndex: 'secret',
                        }
                    }}
                /></Card>
        </PageContainer>
    );
};

export default HomePage;
