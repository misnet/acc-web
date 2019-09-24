/**
 * 角色管理--角色分配给用户界面
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Spin, Transfer, Button } from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './Assign.less';
import {getCachedApp} from '@/utils/utils';

@connect(({ assignUsers, loading }) => ({
    assignUsers,
    loading: loading.effects['assignUsers/list'],
}))
@Form.create()
class AssignUserToRole extends PureComponent {
    componentDidMount() {
        const { dispatch, location: { query },match: { params } } = this.props;
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
            type: 'assignUsers/list',
            payload: { rid: params.rid ,appId:currentApp.id},
        });
    }

    /**
     * 分配或取消分配操作
     * @param tagetKeys
     * @param direction
     * @param moveKeys
     */
    onTransferChange = (tagetKeys, direction, moveKeys) => {
        const { dispatch, match: { params } } = this.props;
        const dire = direction === 'right' ? 'assign' : 'unassign';
        const uids = direction === 'right' ? tagetKeys : moveKeys;
        dispatch({
            type: `assignUsers/${dire}`,
            payload: { uid: uids.join(','), rid: params.rid },
        });
    };
    render() {
        const { loading, dispatch, assignUsers: { data: { assigned, unassigned } } } = this.props;
        const chosenList = [];
        if (Array.isArray(assigned) && assigned.length > 0) {
            for (let i = 0; i < assigned.length; i++) {
                chosenList.push(assigned[i].uid);
            }
        }
        const returnBack = () => {
            dispatch(routerRedux.push('/sys/rolelist/index'));
        };
        return (
            <PageHeaderWrapper title="分配用户">
                <Card bordered={false}>
                    <div className={styles.operatorSection}>
                        <Button icon="arrow-left" type="primary" onClick={returnBack}>
                            返回
                        </Button>
                    </div>

                    <Spin spinning={loading} size="large">
                        <Transfer
                            titles={['未分配的用户', '已分配的用户']}
                            rowKey={record => record.uid}
                            dataSource={unassigned}
                            render={record => (record.username ? record.username : '')}
                            targetKeys={chosenList}
                            onChange={this.onTransferChange}
                        />
                    </Spin>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default AssignUserToRole;