import { DrawerForm, ProFormTextArea, ProFormRadio, ProFormSelect, ProFormText, ProFormDependency, ProFormDigit } from '@ant-design/pro-components';
import { useEffect, useRef } from 'react';
import { DICT } from '@/constants/index';
import { App } from 'antd';
interface PageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dataSource: any;
    onConfirm: (data: any) => void;
}

const Page: React.FC<PageProps> = (props) => {
    const formRef = useRef();
    const { modal } = App.useApp();
    const onFinish = (values) => {
        if (values.readonly === 'y') {
            modal.confirm({
                title: '提示',
                content: '设为只读后，将不可以再修改这个参数，是否继续？',
                onOk: () => {
                    props.onConfirm(values);
                },
            });
        } else {
            props.onConfirm(values);
        }
    };
    const payload = props.dataSource
        ? {
            ...props.dataSource,
        }
        : {};
    console.log('payload', payload);
    return (
        <DrawerForm
            formRef={formRef}
            width={500}
            open={props.open}
            onOpenChange={props.onOpenChange}
            title={'设置'}
            layout="vertical"
            grid={true}
            rowProps={{ gutter: [8, 2] }}
            colProps={{
                xs: 12,
            }}
            drawerProps={{
                destroyOnClose: true,
            }}
            onFinish={onFinish}
            initialValues={payload}
        >
            <ProFormText
                label="参数名称"
                name="configName"
                rules={[
                    {
                        required: true,
                    },
                ]}
            />
            <ProFormSelect
                label="参数类型"
                name="itemType"
                rules={[
                    {
                        required: true,
                    },
                ]}
                options={[
                    {
                        label: '字串',
                        value: 'text',
                    },
                    {
                        label: '数字',
                        value: 'number',
                    },
                    {
                        label: '是与否',
                        value: 'booleanstring',
                    },
                ]}
            />
            <ProFormText
                label="参数Key"
                name="configKey"
                disabled={!!payload.id}
                rules={[
                    {
                        required: true,
                    },
                ]}
            />
            <ProFormDependency name={['itemType']}>
                {({ itemType }) => {
                    if (itemType === 'booleanstring') {
                        return (
                            <ProFormSelect
                                label="参数Value"
                                name="configValue"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                options={[
                                    {
                                        label: 'y',
                                        value: 'y',
                                    },
                                    {
                                        label: 'n',
                                        value: 'n',
                                    },
                                ]}
                            />
                        );
                    } else if (itemType === 'number') {
                        return (
                            <ProFormDigit
                                label="参数Value"
                                name="configValue"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        );
                    }
                    return (
                        <ProFormText
                            label="参数Value"
                            name="configValue"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        />
                    );
                }}
            </ProFormDependency>
            <ProFormText
                label="模块"
                name="module"
                rules={[
                    {
                        required: true,
                    },
                ]}
            />
            <ProFormRadio.Group
                radioType="button"
                label="只读"
                name="readonly"
                rules={[
                    {
                        required: true,
                    },
                ]}
                options={[
                    {
                        label: '是',
                        value: 'y',
                    },
                    {
                        label: '否',
                        value: 'n',
                    },
                ]}
            />
            <ProFormRadio.Group
                radioType="button"
                label="启用"
                name="isEnabled"
                rules={[
                    {
                        required: true,
                    },
                ]}
                options={[
                    {
                        label: '启用',
                        value: 'y',
                    },
                    {
                        label: '禁用',
                        value: 'n',
                    },
                ]}
            />
            <ProFormTextArea label="备注" name="remark" colProps={{ xs: 24 }} />
        </DrawerForm>
    );
};
export default Page;
