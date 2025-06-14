import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Space,
    Row,
    Col,
    Divider,
    Modal,
    Alert
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { App } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;
const { confirm } = Modal;

const UserManagement = ({ user, setUser }) => {
    const [profileForm] = Form.useForm();
    const [createUserForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const { message } = App.useApp();

    const handleUpdateProfile = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`/users/${user.id}`, values);
            setUser(response.data.user);
            message.success('Profile updated successfully!');
        } catch (error) {
            message.error(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (values) => {
        setCreateLoading(true);
        try {
            await axios.post('/users', values);
            message.success('User created successfully!');
            createUserForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'User creation failed');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        confirm({
            title: 'Delete Account',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you sure you want to delete your account?</p>
                    <Alert
                        message="Warning"
                        description="This action cannot be undone. All your audio files will be permanently deleted."
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                </div>
            ),
            okText: 'Yes, Delete Account',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.delete(`/users/${user.id}`);
                    message.success('Account deleted successfully');
                    window.location.reload();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Account deletion failed');
                }
            },
        });
    };

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Title level={2} style={{ margin: 0 }}>
                        <UserOutlined /> Account Management
                    </Title>
                    <Text type="secondary">
                        Manage your profile settings and create new user accounts
                    </Text>
                </Card>

                <Row gutter={[24, 24]}>
                    {/* Update Profile Section */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <Space>
                                    <EditOutlined />
                                    <span>Update Profile</span>
                                </Space>
                            }
                        >
                            <Form
                                form={profileForm}
                                layout="vertical"
                                onFinish={handleUpdateProfile}
                                initialValues={{
                                    username: user.username,
                                    email: user.email || ''
                                }}
                            >
                                <Form.Item
                                    name="username"
                                    label="Username"
                                    rules={[
                                        { required: true, message: 'Please enter your username!' },
                                        { min: 3, message: 'Username must be at least 3 characters!' }
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Enter username"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please enter your email!' },
                                        { type: 'email', message: 'Please enter a valid email!' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="Enter email address"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        size="large"
                                        block
                                    >
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                {/* Danger Zone */}
                <Card
                    title={
                        <Space>
                            <DeleteOutlined />
                            <span style={{ color: '#ff4d4f' }}>Danger Zone</span>
                        </Space>
                    }
                    style={{ borderColor: '#ff4d4f' }}
                >
                    <Alert
                        message="Delete Account"
                        description="Once you delete your account, there is no going back. Please be certain."
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteAccount}
                        size="large"
                    >
                        Delete Account
                    </Button>
                </Card>
            </Space>
        </div>
    );
};

export default UserManagement;