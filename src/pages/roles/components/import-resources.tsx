import { DICT } from "@/constants";
import { DrawerForm, ModalForm, ProForm, ProFormCheckbox, ProFormDigit, ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { App, Modal, Tree } from "antd";
import { useEffect, useRef, useState } from "react";
import type { ProFormInstance } from "@ant-design/pro-components";
import { apiRequest } from "@/utils/utils";
interface EditDrawerProps {
    open: boolean;
    appId?: number;
    onClose: () => void;
}
const EditDrawer: React.FC<EditDrawerProps> = (props) => {
    const { message } = App.useApp();
    const frmRef = useRef<ProFormInstance>();
    const [state, setState] = useState({
        parsedKey: null,
        parsedResources: null,
        xml: null
    });
    const startImport = () => {
        frmRef.current?.validateFields(['resourceXml']).then(async (values) => {
            //解析xml
            const response = await apiRequest('acc.role.resourcesxml.parse', { appId: props.appId, xml: values.resourceXml });
            console.log('response', response);
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    xml: values.resourceXml,
                    parsedKey: response.data.parsedKey,
                    parsedResources: response.data.resources
                }));
            } else {
                message.error(response.message || '解析失败');
                setState(prev => ({
                    ...prev,
                    xml: values.resourceXml
                }));
            }
        });
    }
    const prevStep = () => {
        if (!state.parsedKey) {
            props.onClose();
        } else {
            setState(prev => ({ ...prev, parsedKey: null, parsedResources: null }));
        }
    }
    const nextStep = async () => {
        if (!state.parsedKey) {
            startImport();
        } else {
            //开始导入
            const response = await apiRequest('acc.role.resourcesxml.import', { appId: props.appId, parsedKey: state.parsedKey });
            if (response.success) {
                message.success('导入成功');
                props.onClose();
            } else {
                message.error(response.message || '导入失败');
            }
        }
    }
    const createTree = () => {
        return <Tree
            showLine
            treeData={state.parsedResources?.map(item => {
                const node = {
                    title: item.text + '，代码：' + item.code,
                    key: item.code,
                    children: []
                }
                if (Array.isArray(item.op)) {
                    item.op.map(opAction => (
                        node.children.push({
                            title: opAction.text + '，代码：' + opAction.code,
                            key: item.code + '.' + opAction.code
                        })
                    ));
                }
                return node;
            })} />
    }
    return <Modal

        open={props.open}
        onClose={props.onClose}
        width={500}
        title={'导入资源XML'}
        onCancel={prevStep}
        onOk={nextStep}
        okText={state.parsedResources ? '保存' : '下一步'}
        cancelText={state.parsedResources ? '上一步' : '取消'}
    >
        {state.parsedResources ? createTree(state.parsedResources) :
            <ProForm
                initialValues={{ resourceXml: state.xml }}
                submitter={false}
                formRef={frmRef}>
                <ProFormTextArea
                    name="resourceXml"
                    fieldProps={{
                        rows: 10
                    }}
                    rules={[{
                        required: true,
                        message: '请输入资源xml',
                    }]}
                />
            </ProForm>}
    </Modal>
}
export default EditDrawer;