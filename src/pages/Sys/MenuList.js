/**
 * 系统管理--菜单列表界面
 * @author Donny
 *
 */
import React, { PureComponent } from "react";
import { connect } from "dva";
import {
    Table,
    Card,
    Form,
    Affix,
    Popconfirm,
    Button,
    Divider,
    Icon
} from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import MenuModal from "./MenuModal";
import styles from "../common.less";
import {getCachedApp} from '@/utils/utils';
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(",");

@connect(({ app, menu, loading }) => ({
    app,
    menu,
    createLoading: loading.effects["menu/create"],
    updateLoading: loading.effects["menu/update"],
    loading: loading.effects["menu/menuList"]
}))
class MenuList extends PureComponent {
    componentDidMount() {
        const {
            dispatch,
            location: { query }
        } = this.props;
        const currentApp = getCachedApp(query);
        if (!currentApp) {
            routerRedux.push("/exception/404");
            return;
        } else {
            dispatch({
                type: "app/setCurrentApp",
                payload: currentApp
            });
        }
        dispatch({
            type: "menu/menuList"
        });
    }

    /**
     * 关闭弹窗
     */
    onCancelModal = () => {
        this.props.dispatch({
            type: "menu/hideModal"
        });
    };
    /**
     * 点新建时
     */
    onCreate = () => {
        this.props.dispatch({
            type: "menu/showModal",
            payload: {
                modalType: "create"
            }
        });
    };
    /**
     * 点编辑菜单时
     */
    onEdit = record => {
        this.props.dispatch({
            type: "menu/showModal",
            payload: {
                modalType: "update",
                editMenu: record
            }
        });
    };
    /**
     * 删除用户
     * @param record
     */
    onDelete = record => {
        this.props.dispatch({
            type: "menu/deleteMenu",
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
            app,
            menu: { modalType }
        } = this.props;
        this.props.dispatch({
            type: `menu/${modalType}`,
            payload: {...values,appId:app.currentApp.id}
        });
    };
    handleTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            ...formValues,
            ...filters
        };
        dispatch({
            type: "menu/menuList",
            payload: params
        });
    };

    render() {
        const {
            app,
            loading,
            createLoading,
            updateLoading,
            menu: { data, modalVisible, modalType, editMenu }
        } = this.props;

        const modalProps = {
            item: modalType === "create" ? {} : editMenu,
            visible: modalVisible,
            title: modalType === "create" ? "新建菜单" : "编辑菜单",
            onOk: this.onSubmitForm,
            menuList: data,
            confirmLoading:
                modalType === "create" ? createLoading : updateLoading,
            onCancel: () => this.onCancelModal()
        };
        // 表列定义
        const columns = [
            {
                title: "菜单名",
                dataIndex: "name",
                key: "name",
                render: (text, record) => (
                    <span>
                        <span>{record.name}</span>
                    </span>
                )
            },
            {
                title: "ID",
                dataIndex: "id",
                key: "id"
            },
            {
                title: "链接",
                key: "link",
                render: (text, record) => record.url
            },
            {
                title: "显示",
                dataIndex: "display",
                key: "display",
                render: (text, record) =>
                    record.display === 1 ? "显示" : "隐藏"
            },
            {
                title: "排序权重",
                key: "sortByWeight",
                render: (text, record) => record.sortByWeight
            },
            {
                title: "操作",
                key: "action",
                render: (text, record) => (
                    <span>
                        <a onClick={this.onEdit.bind(this, record)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="菜单删除时，子菜单也会被一起删除，确定要删除这个菜单?"
                            placement="left"
                            onConfirm={this.onDelete.bind(this, record)}
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        ];

        return (
            <PageHeaderWrapper title={app.currentApp.name + "菜单管理"}>
                <Card bordered={false}>
                    <Affix offsetTop={64} className={styles.navToolbarAffix}>
                        <div className={styles.navToolbar}>
                            <div className={styles.navToolbar}>
                                <Button
                                    icon="plus"
                                    type="primary"
                                    onClick={this.onCreate}
                                >
                                    {formatMessage({ id: "form.new" })}
                                </Button>
                            </div>
                            <Divider />
                        </div>
                    </Affix>
                    <div className={styles.tableList}>
                        <Table
                            rowKey={record => record["id"]}
                            pagination={false}
                            loading={loading}
                            dataSource={data}
                            columns={columns}
                            onChange={this.handleTableChange}
                        />
                    </div>
                </Card>
                {modalVisible && <MenuModal {...modalProps} />}
            </PageHeaderWrapper>
        );
    }
}
export default MenuList;
