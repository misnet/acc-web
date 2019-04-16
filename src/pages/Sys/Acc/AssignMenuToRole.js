/**
 * 角色管理--给角色分配菜单访问界面
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Form, Spin, Tree, Button,Affix,Divider } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { union } from 'lodash';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from '../../common.less';
import {getCachedApp} from '@/utils/utils';
@connect(({ app,menu, assignMenus, loading }) => ({
    app,
    menu,
    assignMenus,
    assignLoading: loading.effects['assignMenus/assign'],
    loading: loading.effects['menu/menuList'],
}))
@Form.create()
class AssignMenuToRole extends PureComponent {
    constructor(props) {
        super(props);
        this.checkedKeys = [];
        this.onCheckMenu = this.onCheckMenu.bind(this);
        this.state = {
            checkedMenuIds: { checked: [], halfChecked: [] },
            expandedMenuIds: [],
        };

    }

    componentDidMount() {
        const { dispatch, match: { params } } = this.props;

        //将当前的网址上的appId和appName缓存起来，如果网址没有这两参数，自动从缓存读取
        const currentApp = getCachedApp({});
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
            type: 'menu/menuList',
            payload: { rid: params.rid },
        }).then(r=>{
            console.log(r);
        })
    }

    // componentWillReceiveProps(nextProps) {
    //     const { menu: { data } } = nextProps;
    //     // 从数据中分离出checked和halfChecked
    //     let checkedMenuIds = { checked: [], halfChecked: [] };
    //     const expandedMenuIds = [];
    //     console.log('data',data);
    //     data.map(record => {
    //         let noneCheckedLength = 0;
    //         expandedMenuIds.push(record.id);
    //         if (record.children) {
    //             noneCheckedLength = record.children.length;
    //             record.children.map(childItem => {
    //                 if (childItem.allow && childItem.allow > 0) {
    //                     noneCheckedLength--;
    //                     checkedMenuIds.checked.push(childItem.id);
    //                 }
    //                 expandedMenuIds.push(childItem.id);
    //             });
    //         }
    //         if (record.allow && record.allow > 0) {
    //             if (noneCheckedLength == 0) {
    //                 checkedMenuIds.checked.push(record.id);
    //             } else {
    //                 checkedMenuIds.halfChecked.push(record.id);
    //             }
    //         }
    //     });
    //     //this.setState({ checkedMenuIds });
    // }

    // 保存分配
    onSave = () => {
        const { dispatch, match: { params } } = this.props;
        dispatch({
            type: 'assignMenus/assign',
            payload: { rid: params.rid, menuIds: this.checkedKeys.join(',') },
        });
    };
    // 选中了某菜单
    onCheckMenu = (checkKeys, e) => {
        const checkedKeys = union(checkKeys, e.halfCheckedKeys);
        const { dispatch, match: { params } } = this.props;
        dispatch({
            type: 'assignMenus/assign',
            payload: { rid: params.rid, menuIds: checkedKeys.join(',') },
        });
    };

    returnBack = () => {
        this.props.dispatch(routerRedux.push('/sys/rolelist/index'));
    };
    render() {
        const { loading, assignLoading, menu: { data }, dispatch } = this.props;
        console.log('render data',data);
        // 从数据中分离出checked和halfChecked
        let checkedMenuIds = { checked: [], halfChecked: [] };
        const expandedMenuIds = [];
        
        data.map(record => {
            let noneCheckedLength = 0;
            expandedMenuIds.push(record.id+'');
            if (record.children) {
                noneCheckedLength = record.children.length;
                record.children.map(childItem => {
                    if (childItem.allow && childItem.allow > 0) {
                        noneCheckedLength--;
                        checkedMenuIds.checked.push(childItem.id+'');
                    }
                    expandedMenuIds.push(childItem.id+'');
                });
            }
            if (record.allow && record.allow > 0) {
                if (noneCheckedLength == 0) {
                    checkedMenuIds.checked.push(record.id+'');
                } else {
                    checkedMenuIds.halfChecked.push(record.id+'');
                }
            }
        });
        console.log('===',checkedMenuIds);
        // data.map(record => {
        //     expandedMenuIds.push(record.id+'');
        //     if (record.children) {
        //         record.children.map(childItem => {
        //             expandedMenuIds.push(childItem.id+ '');
        //         });
        //     }
        // });
        return (
            <PageHeaderWrapper title="分配菜单">
                <Card bordered={false}>
                    <Affix offsetTop={64} className={styles.navToolbarAffix}>
                        <div className={styles.navToolbar}>
                        
                        <Button icon="arrow-left" onClick={this.returnBack}>
                            {formatMessage({id:'form.return'})}
                        </Button>
                        <Divider />
                        </div>
                    </Affix>

                    <Spin spinning={loading} size="large">
                        <Tree
                            checkable
                            onCheck={this.onCheckMenu}
                            expandedKeys={expandedMenuIds}
                            checkedKeys={checkedMenuIds.checked}
                        >
                            {data.map(record => (
                                <Tree.TreeNode title={record.name} key={record.id+""}>
                                    {record.children &&
                                        record.children.map(submenu => (
                                            <Tree.TreeNode title={submenu.name} key={submenu.id + ""} />
                                        ))}
                                </Tree.TreeNode>
                            ))}
                        </Tree>
                    </Spin>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default AssignMenuToRole;