import { apiRequest } from "@/utils/utils";
import { SaveOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button, Drawer, Flex, Table, Tag, Transfer, App } from "antd";
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import { useEffect, useMemo, useRef, useState } from "react";
type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType {
    key: string;
    uid: number;
    fullname?: string;
    username?: string;
    mobile?: string;
    email?: string;
}

interface AssignRolesDrawerProps {
    open: boolean;
    onSave: (userIds: string[]) => void;
    onClose: () => void;
    role: any;
}
interface TableTransferProps extends TransferProps<TransferItem> {
    dataSource: DataType[];
    leftColumns: TableColumnsType<DataType>;
    rightColumns: TableColumnsType<DataType>;
}
const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const { leftColumns, rightColumns, pagination, ...restProps } = props;
    const ts = useRef();
    return <Transfer style={{ width: '100%' }} {...restProps} ref={ts}>
        {({
            direction,
            filteredItems,
            onItemSelect,
            onItemSelectAll,
            selectedKeys,
            disabled: listDisabled,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
            const rowSelection: TableRowSelection<TransferItem> = {
                onChange: (selectedRowKeys) => {
                    console.log('selectedRowKeys', selectedRowKeys);
                    onItemSelectAll(selectedRowKeys, 'replace');
                },
                selectedRowKeys: selectedKeys,
                selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
            };
            console.log('listSelectedKeys', selectedKeys);
            return (
                <ProTable
                    pagination={false}
                    search={false}
                    toolBarRender={false}
                    rowKey={'key'}
                    rowSelection={rowSelection}
                    dataSource={filteredItems}
                    columns={columns}
                    size="small"
                    style={{ pointerEvents: listDisabled ? 'none' : undefined }}

                    onRow={(item) => ({
                        onClick: () => {
                            const { key, disabled: itemDisabled } = item;

                            if (itemDisabled || listDisabled) {
                                return;
                            }
                            onItemSelect(key, !selectedKeys.includes(item.key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
}
const AssignRolesDrawer: React.FC<AssignRolesDrawerProps> = (props) => {
    const { message } = App.useApp();
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
    const [listUser, setListUser] = useState({
        data: [],
        total: 0
    });
    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
        console.log('nextTargetKeys', nextTargetKeys);
        setTargetKeys(nextTargetKeys);
    };

    const columns = [
        {
            dataIndex: 'fullname',
            title: '姓名',
        },
        {
            dataIndex: 'username',
            title: '用户名'
        }
    ];
    const filterOption = (input: string, item: DataType) => item.fullname?.includes(input);

    const onSave = async () => {
        // console.log('targetKeys', targetKeys);
        props.onSave(targetKeys);
        // const response = await apiRequest('acc.user.assignrole', {
        //     uid: props.user.uid,
        //     roleIds: targetKeys
        // });
        // if (response.success) {
        //     message.success('保存成功');
        //     props.onClose();

        // } else {
        //     message.error(response.message || '保存失败');
        // }
    }
    const getAssignedList = async (rid: number) => {
        if (!rid) {
            return;
        }
        const response = await apiRequest('acc.role.listuser', {
            rid
        });
        if (response.success) {
            setTargetKeys(response.data.assigned.map(item => item.uid + ''));
        } else {
            setTargetKeys([]);
        }
    };
    const getUserList = async (params) => {
        const response = await apiRequest('acc.user.list', params);
        if (response.success) {
            const list = response.data.list.map((item: any) => ({
                key: item.uid + '',
                ...item
            }));
            setListUser({
                data: list,
                total: response.data.total
            });
        } else {
            setListUser({
                total: 0,
                data: []
            });
        }
    };
    useEffect(() => {
        getUserList({
            current: 1,
            pageSize: 1000
        });

    }, []);
    useEffect(() => {
        getAssignedList(props.role?.id);
    }, [props.role?.id]);

    return <Drawer title='分配用户' width={700} open={props.open} onClose={props.onClose} extra={[
        <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={onSave}>保存</Button>
    ]}>
        <Flex align="start" gap="middle" vertical>
            <TableTransfer
                dataSource={listUser.data}
                rowKey={record => record.key}
                targetKeys={targetKeys}
                showSearch
                showSelectAll={false}
                onChange={onChange}
                filterOption={filterOption}
                leftColumns={columns}
                rightColumns={columns}
            />
        </Flex>
    </Drawer>
}
export default AssignRolesDrawer;