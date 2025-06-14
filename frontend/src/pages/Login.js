import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Space,
    Alert,
    Layout,
    Divider
} from 'antd';
import { UserOutlined, LockOutlined, AudioOutlined } from '@ant-design/icons';
import { App } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const Login = ({ onLogin }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { message } = App.useApp();

    const handleSubmit = async (values) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/auth/login', values);
            message.success('Login successful!');
            onLogin(response.data.user);
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const fillDefaults = () => {
        form.setFieldsValue({
            username: 'admin',
            password: 'admin123'
        });
    };

    return (
        <Layout style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Card
                style={{
                    width: 400,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    borderRadius: '12px'
                }}
                bodyStyle={{ padding: '32px' }}
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <AudioOutlined style={{ fontSize: '48px', color: '#1677ff', marginBottom: '16px' }} />
                        <Title level={2} style={{ margin: 0, color: '#262626' }}>
                            Audio Hosting Platform
                        </Title>
                        <Text type="secondary">
                            Please sign in to your account
                        </Text>
                    </div>

                    {error && (
                        <Alert
                            message="Login Failed"
                            description={error}
                            type="error"
                            showIcon
                            closable
                            onClose={() => setError('')}
                        />
                    )}

                    <Form
                        form={form}
                        name="login"
                        onFinish={handleSubmit}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: 'Please enter your username!' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Enter username"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: 'Please enter your password!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Enter password"
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </Form.Item>
                    </Form>

                    <Divider>Default Credentials</Divider>

                    <Card size="small" style={{ background: '#f6f8fa' }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text strong>Username:</Text>
                            <Text code>admin</Text>
                            <Text strong>Password:</Text>
                            <Text code>admin123</Text>

                            <Button
                                type="link"
                                onClick={fillDefaults}
                                style={{ padding: 0, height: 'auto' }}
                            >
                                Use Default Credentials
                            </Button>
                        </Space>
                    </Card>
                </Space>
            </Card>
        </Layout>
    );
};

export default Login;