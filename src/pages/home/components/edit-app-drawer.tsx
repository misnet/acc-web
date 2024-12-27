import { DrawerForm, ProFormCheckbox, ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col } from "antd";
import { useEffect, useRef } from "react";

interface EditAppDrawerProps {
    open: boolean;
    dataSource: Record<string, any>;
    onOpenChange: (open: boolean) => void;
    onFinish: (values: Record<string, any>) => void;
}
const EditAppDrawer: React.FC<EditAppDrawerProps> = (props) => {
    const frm = useRef();
    useEffect(() => {
        if (props.dataSource) {
            setTimeout(() => {
                frm.current?.setFieldsValue(props.dataSource);
            }, 200)
        } else {
            setTimeout(() => {
                frm.current?.resetFields();
            }, 200);
        }
    }, [props.dataSource])
    return <DrawerForm
        initialValues={{
            disabled: 'n',
            autoCreateSecret: 'n',
            allowAutoCreateUser: 'n'
        }}
        formRef={frm}
        onFinish={props.onFinish}
        width={400}
        title={props.dataSource ? '编辑应用' : '新建应用'}
        open={props.open}
        onOpenChange={props.onOpenChange}>
        {props.dataSource && <ProFormText name='id' label='应用ID' disabled />}
        {props.dataSource && <ProFormText name='secret' label='应用秘钥' disabled />}
        <ProFormText name='name' label='应用名称' rules={[{
            required: true,
            message: '请输入应用名称'
        }]} />
        <ProFormTextArea name='shortDesc' label='描述' />
        <ProFormRadio.Group name='disabled' label='状态' fieldProps={{ optionType: 'button' }} options={[
            {
                label: '禁用',
                value: 'y',
            },
            {
                label: '启用',
                value: 'n',
            }
        ]} />
        <ProFormRadio.Group name='allowAutoCreateUser' fieldProps={{ optionType: 'button' }} label='允许自动注册用户' options={[
            {
                label: '允许',
                value: 'y',
            },
            {
                label: '拒绝',
                value: 'n',
            }
        ]} />
        {props.dataSource && <ProFormRadio.Group name='autoCreateSecret' fieldProps={{ optionType: 'button' }} label='重新生成秘钥' options={[
            {
                label: '是',
                value: 'y',
            },
            {
                label: '否',
                value: 'n',
            }
        ]} />}
    </DrawerForm>
}
export default EditAppDrawer;