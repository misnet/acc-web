import { apiRequest } from "@/utils/utils";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Drawer, Flex, Table, Tag, Transfer, App } from "antd";
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import { useEffect, useState } from "react";
type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType {
    key: string;
    id: number;
    defaultAllow: string;
    name: string;
}

interface AssignRolesDrawerProps {
    open: boolean;
    onSave: (roleIds: string[]) => void;
    onClose: () => void;
    user: any;
    rolesList: Array<Record<string, any>>;
}
interface TableTransferProps extends TransferProps<TransferItem> {
    dataSource: DataType[];
    leftColumns: TableColumnsType<DataType>;
    rightColumns: TableColumnsType<DataType>;
}
const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const { leftColumns, rightColumns, ...restProps } = props;
    return <Transfer style={{ width: '100%' }} {...restProps}>
        {({
            direction,
            filteredItems,
            onItemSelect,
            onItemSelectAll,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
        }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
            const rowSelection: TableRowSelection<TransferItem> = {
                onChange(selectedRowKeys) {
                    onItemSelectAll(selectedRowKeys, 'replace');
                },
                selectedRowKeys: listSelectedKeys,
                selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
            };
            console.log('filteredItems', filteredItems);
            return (
                <Table
                    rowKey={'key'}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{ pointerEvents: listDisabled ? 'none' : undefined }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                            if (itemDisabled || listDisabled) {
                                return;
                            }
                            console.log('listSelectedKeys', listSelectedKeys);
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
}
const AssignRolesDrawer: React.FC<AssignRolesDrawerProps> = (props) => {
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };
    useEffect(() => {
        setTargetKeys(props.user?.roles?.map(item => item.roleId + ''));
    }, [props.rolesList]);
    const columns = [
        {
            dataIndex: 'name',
            title: '角色',
        },
        {
            dataIndex: 'defaultAllow',
            title: '默认权限',
            render: text => text === 'y' ? <Tag color="success">允许</Tag> : <Tag color="error">拒绝</Tag>
        }
    ];
    const filterOption = (input: string, item: DataType) => item.name?.includes(input);
    const dataSource = props.rolesList?.map(item => ({ ...item, key: item.id + '' }));

    const onSave = async () => {
        props.onSave(targetKeys);
    }
    return <Drawer title='分配角色' width={700} open={props.open} onClose={props.onClose} extra={[
        <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={onSave}>保存</Button>
    ]}>
        <Flex align="start" gap="middle" vertical>
            <TableTransfer
                dataSource={dataSource}
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