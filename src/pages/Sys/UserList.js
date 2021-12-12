/**
 * 系统管理--用户列表界面
 * @author Donny
 *
 */
import React, { useState, useEffect } from 'react'
import { history, useSelector, useDispatch, useIntl } from 'umi';
import { MailOutlined, MobileOutlined, PlusOutlined } from '@ant-design/icons';

import { Table, Card, Popconfirm, Button, Divider, Affix, Form, Tag, message } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import UserModal from './UserModal';
import PrivilegeModal from './PrivilegeModal';
import styles from '../common.less'
import { getCachedApp, getGlobalSetting, setGlobalSetting } from '@/utils/utils';


const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',')


export default (props) => {
    const intl = useIntl();
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['user/userList'];
    const updateLoading = loadingEffect.effects['user/update'];
    const createLoading = loadingEffect.effects['user/create'];
    const app = useSelector(state => state.app);
    const user = useSelector(state => state.user);
    const { query } = props.location;
    const [state, setState] = useState({
        appId: query.appId,
        appName: query.appName,
        roleList: [],
        userId: 0,
        privilegeModalVisible: false
    });
    const updateState = (d => {
        setState(prevState => {
            return {
                ...prevState,
                ...d
            }
        })
    })
    const dispatch = useDispatch();
    useEffect(() => {

        if (!query.appId) {
            history.push('/exception/404');
            return;
        }
        const currentApp = getCachedApp(query);
        if (!currentApp) {
            history.push("/exception/404");
            return;
        } else {
            dispatch({
                type: 'app/setCurrentApp',
                payload: currentApp
            });
        }
        fetchUserList();
        dispatch({
            type: 'app/appList'
        });
    }, []);
    /**
     * 关闭弹窗
     */
    const onCancelModal = () => {
        dispatch({
            type: 'user/hideModal',
        })
    }
    /**
     * 点新建时
     */
    const onCreateUser = () => {
        dispatch({
            type: 'user/showModal',
            payload: {
                modalType: 'create',
                editUser: {},
            },
        });
    }
    /**
     * 点编辑用户时
     */
    const onEditUser = (record) => {
        dispatch({
            type: 'user/showModal',
            payload: {
                modalType: 'update',
                editUser: record,
            },
        })
    }
    /**
     * 获取用户列表
     * @param {*} page 
     */
    const fetchUserList = (page = 1) => {
        dispatch({
            type: 'user/userList',
            payload: {
                appId: query.appId,
                limit: getGlobalSetting('pageSize'),
                page,
            },
        });
    }
    /**
     * 删除用户
     * @param record
     */
    const onDeleteUser = (record) => {
        dispatch({
            type: 'user/deleteUser',
            payload: {
                uid: record.uid,
            },
            callback: () => {
                fetchUserList();
            }
        })
    }
    /**
     * 点提交新建/编辑用户表单的OK键
     * @param values
     */
    const onSubmitUserForm = (values) => {
        dispatch({
            type: `user/${user.modalType}`,
            payload: values,
            callback: result => {
                result && fetchUserList();
            }
        })
    }
    /**
     * 授权
     * @param {*} record 
     */
    const onAssignPrivileges = record => {
        updateState({
            userId: record.uid,
            roleList: record.roles,
            privilegeModalVisible: true
        })
    }
    /**
     * 更新用户的角色列表
     * @param {*} rolesList 
     */
    const onUpdateUserRoles = rolesList => {
        const rids = rolesList.map(item => item.roleId);
        dispatch({
            type: 'assignUsers/updateUserRoles',
            payload: {
                uid: state.userId,
                appId: state.appId,
                rids: rids
            },
            callback: result => {
                if (result) {
                    message.success('用户授权成功');
                    fetchUserList(user.data.page);
                    onTogglePrivilegeModal();
                }
            }
        })
    }
    /**
     * 关闭权限弹窗
     */
    const onTogglePrivilegeModal = () => {
        updateState({
            privilegeModalVisible: !state.privilegeModalVisible
        })
    }
    const handleTableChange = (pagination, filtersArg, sorter) => {
        setGlobalSetting({ pageSize: pagination.pageSize });
        fetchUserList(pagination.current);

    }
    const { data, modalVisible, modalType, editUser } = user;


    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
        showTotal(total) {
            return `共 ${total} 条记录`
        },
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: data.limit,
        current: data.page,
        total: data.total,
    }

    // 表列定义
    const columns = [
        {
            title: '用户ID',
            dataIndex: 'uid',
            key: 'uid',
        }, {
            title: '姓名',
            dataIndex: 'fullname',
            key: 'fullname',
        }, {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile',
        }, {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: '角色',
            dataIndex: 'roles',
            key: 'roles',
            render: (text, record) => {
                return record.roles.map(item => <Tag color="cyan" key={item.roleId}>{item.roleName}</Tag>)
            }
        }, {
            title: '验证',
            dataIndex: 'mobileEmailVerified',
            key: 'mobileEmailVerified',
            render: (text, record) => <>
                {record.mobileVerified ? <MobileOutlined /> : null}
                {record.emailVerified ? <MailOutlined /> : null}
            </>
        }, {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => onEditUser(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title='该用户删除后，将在所有系统中都无法登陆，确定要删除这个用户?'
                        placement="left"
                        onConfirm={() => onDeleteUser(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a onClick={() => onAssignPrivileges(record)}>权限</a>
                </span>
            ),
        }]

    const ModalProps = {
        title: modalType === 'create' ? '新建用户' : '编辑用户',
        visible: modalVisible,
        onOk: onSubmitUserForm,
        confirmLoading: modalType === 'create' ? createLoading : updateLoading,
        onCancel: onCancelModal,
        editUser,
        currentAppId: props.location.query.appId,
        appList: app.data.list
    };
    return (
        <PageHeaderWrapper title={state.appName + "用户列表"}>
            <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>
                        <div className={styles.navToolbar}>
                            <Button icon={<PlusOutlined />} type="primary" onClick={() => onCreateUser()}>
                                {intl.formatMessage({ id: 'form.new' })}
                            </Button>
                        </div>
                        <Divider />
                    </div>
                </Affix>
                <div className={styles.tableList}>

                    <Table
                        rowKey={record => record.uid}

                        loading={loading}
                        dataSource={data.list}
                        columns={columns}
                        onChange={handleTableChange}
                        pagination={paginationProps}
                    />
                </div>
                <PrivilegeModal
                    visible={state.privilegeModalVisible}
                    appId={state.appId}
                    roleList={state.roleList}
                    onClose={onTogglePrivilegeModal}
                    onOk={onUpdateUserRoles}
                />
            </Card>
            {modalVisible && <UserModal {...ModalProps} />}
        </PageHeaderWrapper>
    );
}