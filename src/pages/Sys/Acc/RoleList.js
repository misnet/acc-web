/**
 * 角色管理--角色列表界面
 * @author Donny
 *
 */
import React, { PureComponent } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Table, Card, Button, Divider, Modal, Affix } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { Link } from "dva/router";
import PageHeaderWrapper from "../../../components/PageHeaderWrapper";
import RoleModal from "./RoleModal";
import styles from "../../common.less";
import DICT from "../../../dict";
import DropdownMenu from "./RoleDropdownMenu";
import {getCachedApp} from '@/utils/utils';
const { confirm } = Modal;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(",");
@connect(({ app,role, loading }) => ({
    app,
    role,
    loading: loading.effects["role/list"],
    createLoading: loading.effects["role/create"],
    updateLoading: loading.effects["role/update"]
}))
class RoleList extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            appId:'',
            appName:''
        }
      }
    componentDidMount() {
        const {
            dispatch,
            location: { query }
        } = this.props;
        //将当前的网址上的appId和appName缓存起来，如果网址没有这两参数，自动从缓存读取
        const currentApp = getCachedApp(query);
        if (!currentApp) {
            routerRedux.push("/exception/404");
            return;
        }else{
            dispatch({
                type:'app/setCurrentApp',
                payload:currentApp
            });
        }
        dispatch({
            type: "role/list",
            payload:{
                appId:currentApp.id
            }
        });

        this.setState({
            appName:currentApp.name,
            appId:currentApp.id
        });
    }

    /**
     * 关闭弹窗
     */
    onCancelModal = () => {
        this.props.dispatch({
            type: "role/hideModal"
        });
    };
    /**
     * 点新建时
     */
    onCreate = () => {
        this.props.dispatch({
            type: "role/showModal",
            payload: {
                modalType: "create"
            }
        });
    };
    /**
     * 点编辑时
     */
    onEdit = record => {
        this.props.dispatch({
            type: "role/showModal",
            payload: {
                modalType: "update",
                editData: record
            }
        });
    };
    /**
     * 删除
     * @param record
     */
    onDelete = record => {
        this.props.dispatch({
            type: "role/remove",
            payload: {
                id: record.id
            }
        });
    };

    /**
     * 点提交新建/编辑表单的OK键
     * @param e
     */
    onSubmitForm = values => {
        const {
            role: { modalType }
        } = this.props;
        this.props.dispatch({
            type: `role/${modalType}`,
            payload: {...values,appId:this.state.appId}
        });
    };

    handleTableChange = (pagination, filtersArg, sorter) => {
        this.props.dispatch({
            type: "role/list",
            payload: {
                page: pagination.current,
                limit: pagination.pageSize
            }
        });
    };
    selectMenu = (record, e) => {
        switch (e.key) {
            case "assignMenu":
                this.props.dispatch(
                    routerRedux.push(
                        `/sys/rolelist/assign-role-menu/${record.id}`
                    )
                );
                break;
            case "assignResource":
                this.props.dispatch(
                    routerRedux.push(`/sys/rolelist/role-res/${record.id}`)
                );
                break;
            case "delete":
                confirm({
                    title: "确定要删除这条记录?",
                    onOk: () => {
                        this.onDelete(record);
                    }
                });
                break;
            default:
                break;
        }
    };
    render() {
        const {
            app,
            loading,
            createLoading,
            updateLoading,
            role: { data, modalVisible, modalType, editData }
        } = this.props;
        const modalProps = {
            item: modalType === "create" ? {} : editData,
            visible: modalVisible,
            title: modalType === "create" ? "新建角色" : "编辑角色",
            onOk: this.onSubmitForm,
            confirmLoading:
                modalType === "create" ? createLoading : updateLoading,
            onCancel: () => this.onCancelModal()
        };
        const paginationProps = {
            showTotal(total) {
                return `共 ${total} 条记录`;
            },
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize: data.limit,
            current: data.page,
            total: data.total
        };

        // 表列定义
        const columns = [
            {
                title: "ID",
                key: "id",
                dataIndex: "id"
            },
            {
                title: "优先级",
                key: "priority",
                dataIndex: "priority"
            },
            {
                title: "角色名称",
                key: "name",
                dataIndex: "name"
            },
            {
                title: "用户数量",
                key: "cntUser",
                dataIndex: "cntUser",
                render: (text, record) => (
                    <Link to={`/sys/rolelist/assign-role-users/${record.id}`}>
                        {record.cntUser}
                    </Link>
                )
            },
            {
                title: "类型",
                key: "roleType",
                dataIndex: "roleType",
                render: (text, record) =>
                    record.roleType == 1 ? "普通" : "超级管理员"
            },
            {
                title: "默认权限",
                key: "defaultAllow",
                dataIndex: "defaultAllow",
                render: (text, record) =>
                    record.defaultAllow > 0 ? "允许" : "禁止"
            },
            {
                title: "分配策略",
                key: "assignPolicy",
                dataIndex: "assignPolicy",
                render: (text, record) => {
                    if (
                        record.assignPolicy ==
                        DICT.ROLE_ASSIGN_POLICY_TO_LOGINED
                    ) {
                        return "自动分配给登陆的会员";
                    } else if (
                        record.assignPolicy ==
                        DICT.ROLE_ASSIGN_POLICY_TO_UNLOGINED
                    ) {
                        return "自动分配给未登陆的会员";
                    } else {
                        return "不自动分配";
                    }
                }
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => (
                    <span>
                        <a onClick={this.onEdit.bind(this, record)}>编辑</a>
                        <Divider type="vertical" />
                        <DropdownMenu
                            onMenuClick={e => this.selectMenu(record, e)}
                            menuOptions={[
                                { key: "assignMenu", name: "分配菜单" },
                                { key: "assignResource", name: "分配资源" },
                                { key: "delete", name: "删除" }
                            ]}
                        />
                    </span>
                )
            }
        ];

        return (
            <PageHeaderWrapper title={app.currentApp.name + "角色管理"}>
                <Card bordered={false}>
                    <Affix offsetTop={64} className={styles.navToolbarAffix}>
                        <div className={styles.navToolbar}>
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={this.onCreate}
                            >
                                {formatMessage({ id: "form.new" })}
                            </Button>
                            <Divider />
                        </div>
                    </Affix>
                    <div className={styles.tableList}>
                        <Table
                            rowKey={record => record.id}
                            loading={loading}
                            dataSource={data.list}
                            columns={columns}
                            onChange={this.handleTableChange}
                            pagination={paginationProps}
                        />
                    </div>
                </Card>
                {modalVisible && <RoleModal {...modalProps} />}
            </PageHeaderWrapper>
        );
    }
}
export default RoleList;
