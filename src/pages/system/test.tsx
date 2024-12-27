import { apiRequest } from "@/utils/utils";
import { PageContainer, ProForm, ProFormCaptcha, ProFormText, ProTable } from "@ant-design/pro-components"

import type { CaptFieldRef } from '@ant-design/pro-components';
import { Alert, Card, Col, Divider, Row, Space, Tag } from "antd";
import { useEffect, useRef, useState } from "react";

const TestPage: React.FC = () => {
    useEffect(() => { });
    const formInstance = useRef();
    const formInstance2 = useRef();
    const captchaRef = useRef<CaptFieldRef | null | undefined>();
    const [state, setState] = useState({
        phoneTest: null,
        emailTest: null
    })
    const columns = [
        {
            title: '检测项名称',
            dataIndex: 'name',
            hideInSearch: true,
        },
        {
            title: '检测结果',
            dataIndex: 'success',
            hideInSearch: true,
            render: (text: any, record: any) => {
                return text ? <Tag color='success'>成功</Tag> : <Tag color="error">失败</Tag>;
            }
        },
        {
            title: '异常信息',
            dataIndex: 'message',
            hideInSearch: true,
        }
    ];
    const sendToValidate = async (receive: string, isPhone: boolean) => {
        if (receive) {
            const response = await apiRequest('common.verifycode.send', { receive });
            const stateKey = isPhone ? 'phoneTest' : 'emailTest';
            const title = isPhone ? '手机' : '邮箱';
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    [stateKey]: {
                        success: true,
                        message: response.message || title + '验证码发送成功'
                    }
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    [stateKey]: {
                        success: false,
                        message: response.message || title + '验证码发送失败'
                    }
                }));
            }
        }
    }
    return <PageContainer>
        <Card>
            <ProTable

                pagination={false}
                search={false}
                toolBarRender={false}
                columns={columns}
                request={async () => {
                    const response = await apiRequest('common.test', {});
                    if (response.success) {
                        return {
                            data: response.data,
                            success: true,
                        }
                    }
                    return {
                        data: [],
                        success: true,
                    }
                }}
            />
        </Card>
        <Card>
            <Row gutter={[10, 10]}>
                <Col span={12}>
                    <ProForm
                        layout="inline"
                        formRef={formInstance}
                        onFinish={async (values) => {
                            setState(prev => ({
                                ...prev,
                                phoneTest: null
                            }));
                            if (values.phone) {
                                sendToValidate(values.phone, true);
                            }
                        }}
                        submitter={{
                            searchConfig: {
                                submitText: '发送检测',
                            },
                            render: (_, dom) => {
                                return dom.pop();
                            }
                        }}>
                        <ProFormText
                            label="手机"
                            name="phone"
                            placeholder={'仅支持中国11位手机号'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入中国大陆手机号',
                                },
                                {
                                    pattern: /^1[3456789]\d{9}$/,
                                    message: '请输入正确的手机号',
                                },
                            ]}
                        />
                    </ProForm>
                </Col>
                <Col span={12}>
                    {state.phoneTest && <Alert message={state.phoneTest.message} type={state.phoneTest.success ? 'success' : 'error'} />}
                </Col>
            </Row>
            <Divider />
            <Row >
                <Col span={12}>
                    <ProForm
                        layout="inline"
                        formRef={formInstance2}
                        onFinish={async (values) => {
                            setState(prev => ({
                                ...prev,
                                emailTest: null
                            }));
                            if (values.email) {
                                sendToValidate(values.email, false);
                            }
                        }}
                        submitter={{
                            searchConfig: {
                                submitText: '发送检测',
                            },
                            render: (_, dom) => {
                                return dom.pop();
                            }
                        }}>
                        <ProFormText
                            label="邮箱"
                            name="email"
                            rules={[

                                {
                                    required: true,
                                    message: '请输入邮箱',
                                },
                                {
                                    type: 'email',
                                    message: '请输入正确的邮箱',
                                },
                            ]}
                        />
                    </ProForm>
                </Col>
                <Col span={12}>
                    {state.emailTest && <Alert message={state.emailTest?.message} type={state.emailTest?.success ? 'success' : 'error'} />}
                </Col>
            </Row>
        </Card>
    </PageContainer>
}
export default TestPage;