/**
 * 系统管理--用户列表界面
 * @author Donny
 *
 */
import React, { useEffect } from 'react'
import { MailOutlined, MobileOutlined, PlusOutlined } from '@ant-design/icons';
import { Table, Form, Card, Popconfirm, Button, Divider, Affix } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import UserModal from './UserModal';
import styles from '../common.less'
import { useDispatch, useSelector, useIntl } from 'umi';
import { getCachedApp, getGlobalSetting, setGlobalSetting } from '@/utils/utils';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',')

export default (props) => {
    const {
        app,
        user
    } = useSelector(state => state);
    const dispatch = useDispatch();
    const loadingEffect = useSelector(state => state.loading);
    const intl = useIntl();
    const loading = loadingEffect.effects['user/allUserList'];
    const updateLoading = loadingEffect.effects['user/update'];
    const createLoading = loadingEffect.effects['user/create'];
    useEffect(() => {
        console.log('porps', props);
        const { query } = props.location;
        fetchUserList();
        dispatch({
            type: 'app/appList'
        });
    }, []);

    const fetchUserList = (page = 1) => {
        dispatch({
            type: 'user/allUserList',
            payload: {
                limit: getGlobalSetting('pageSize'),
                page,
            },
        });
    }
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

    const handleTableChange = (pagination, filtersArg, sorter) => {
        setGlobalSetting({ pageSize: pagination.pageSize });
        dispatch({
            type: 'user/allUserList',
            payload: {
                limit: pagination.pageSize,
                page: pagination.current,
            },
        })
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
        appList: app.data.list
    };
    return (
        <PageHeaderWrapper title={"用户列表"}>
            <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>
                        <div className={styles.navToolbar}>
                            <Button icon={<PlusOutlined />} type="primary" onClick={onCreateUser}>
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
            </Card>
            {modalVisible && <UserModal {...ModalProps} />}
        </PageHeaderWrapper>
    );
}