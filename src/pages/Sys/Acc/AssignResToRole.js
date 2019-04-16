/**
 * 角色管理--给角色分配某个指定的权限资源
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Checkbox, Table, Button,Affix,Divider } from 'antd';
import { routerRedux } from 'dva/router';
import { indexOf, without } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from '../../common.less';
@connect(({ operations, loading }) => ({
    operations,
    loading: loading.effects['operations/list'],
    saveLoading: loading.effects['operations/assign'],
}))
@Form.create()
class AssignResToRole extends PureComponent {
    state = {
        indeterminate: false,
        checkAll: false,
        selectedRowKeys: [], // Check here to configure the default column
    };
    onSelect = e => {
        const { operations: { data } } = this.props;
        let selectedKeys = Object.assign([], this.state.selectedRowKeys);
        if (e.target.checked) {
            indexOf(selectedKeys, e.target.value) == -1 ? selectedKeys.push(e.target.value) : null;
        } else {
            indexOf(selectedKeys, e.target.value) != -1
                ? (selectedKeys = without(selectedKeys, e.target.value))
                : null;
        }
        this.setState({
            selectedRowKeys: selectedKeys,
            checkAll: selectedKeys.length == data.op.length,
            indeterminate: selectedKeys.length && selectedKeys.length < data.op.length,
        });
    };
    onSelectAll = e => {
        const { operations: { data } } = this.props;
        let selectedRowKeys = [];
        if (e.target.checked) {
            data.op.map(record => selectedRowKeys.push(record.code));
        } else {
            selectedRowKeys = [];
        }
        this.setState({
            checkAll: e.target.checked,
            indeterminate: false,
            selectedRowKeys,
        });
    };
    onSave = () => {
        const { dispatch, match: { params } } = this.props;
        dispatch({
            type: 'operations/assign',
            payload: { rid: params.rid, opcodes: this.state.selectedRowKeys.join(',') },
        });
    };
    componentDidMount() {
        const { dispatch, match: { params } } = this.props;
        dispatch({
            type: 'operations/list',
            payload: { rid: params.rid, res: params.rcode },
        });
    }

    render() {
        const {
            operations: { data },
            loading,
            saveLoading,
            match: { params },
            dispatch,
        } = this.props;
        const { selectedRowKeys, indeterminate, checkAll } = this.state;
        // 表列定义
        const columns = [
            {
                title: '操作名称',
                key: 'text',
                dataIndex: 'text',
            },
            {
                title: '操作代码',
                key: 'code',
                dataIndex: 'code',
            },
            {
                title: '当前权限结果',
                key: 'allow',
                dataIndex: 'allow',
                render: (text, record) => <span>{record.allow > 0 ? '允许' : '禁止'}</span>,
            },
            {
                title: (
                    <Checkbox
                        indeterminate={indeterminate}
                        checked={checkAll}
                        onChange={this.onSelectAll}
                    >
                        授权
                    </Checkbox>
                ),
                key: 'assign',
                dataIndex: 'allow',
                render: (text, record) => (
                    <Checkbox
                        onChange={this.onSelect}
                        checked={indexOf(selectedRowKeys, record.code) != -1}
                        value={record.code}
                    >
                        允许
                    </Checkbox>
                ),
            },
        ];
        const returnBack = () => {
            dispatch(routerRedux.push(`/sys/rolelist/role-res/${params.rid}`));
        };
        return (
            <PageHeaderWrapper title="权限资源分配">
                <Card bordered={false}>
                    <Affix offsetTop={64} className={styles.navToolbarAffix}>
                        <div className={styles.navToolbar}>
                        <Button
                            icon="check"
                            type="primary"
                            loading={saveLoading}
                            onClick={this.onSave}
                        >
                            保存
                        </Button>
                        <Button icon="arrow-left" onClick={returnBack}>
                            返回
                        </Button>
                        <Divider />
                        </div>
                    </Affix>
                    <Table
                        rowKey={record => record.code}
                        loading={loading}
                        dataSource={data.op}
                        columns={columns}
                        pagination={false}
                    />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default AssignResToRole;