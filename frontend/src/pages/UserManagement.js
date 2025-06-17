import React, { useEffect, useState } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Typography,
    Space,
    Row,
    Col,
    Modal,
    Alert,
    Table
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { App } from 'antd';
import axios from 'axios';

const { Title } = Typography;
const { confirm } = Modal;

const UserProfile = ({ user }) => {
    const [createUserForm] = Form.useForm();
    const [editUserForm] = Form.useForm();
    const [getUsersLoading, setUsersLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const { message } = App.useApp();

    useEffect(() => {
        fetchUsers();
    }, []);

    const showEditUserModal = (record) => {
        editUserForm.setFieldsValue(record)
        setOpen(true);
    };

    const handleEditCancel = () => {
        setOpen(false);
        editUserForm.setFieldsValue({})
    };

    const handleCreateUser = async (values) => {
        setCreateLoading(true);
        setUsersLoading(true);
        try {
            await axios.post('/users', values);
            message.success('User created successfully!');
            createUserForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'User creation failed');
        } finally {
            setCreateLoading(false);
            fetchUsers();
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await axios.get('/users');
            setUsers(response.data.users)
        } catch (error) {
            setUsers([])
            message.error('Failed to fetch users');
            console.error('Fetch error:', error);
        } finally {
            setUsersLoading(false);
        }
    };

    const handleDeleteAccount = (record) => {
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
                    await axios.delete(`/users/${record.id}`);
                    message.success('Account deleted successfully');
                    // window.location.reload();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Account deletion failed');
                } finally {
                    fetchUsers();
                }
            },
        });
    };

    const handleEditUser = async (values) => {
        setEditLoading(true);
        try {
            const response = await axios.put(`/users/${values.id}`, values);
            message.success('Profile updated successfully!');
        } catch (error) {
            message.error(error.response?.data?.message || 'Edit failed');
        } finally {
            setEditLoading(false);
            setOpen(false);
            fetchUsers();
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        info
                        icon={<EditOutlined />}
                        onClick={() => showEditUserModal(record)}
                        size="large"
                    >
                        Edit Account
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteAccount(record)}
                        size="large"
                        disabled={record.id === user.id}
                    >
                        Delete Account
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Modal
                title="Edit user"
                open={open}
                confirmLoading={editLoading}
                onCancel={handleEditCancel}
                footer={null}
            >
                <Form
                    form={editUserForm}
                    layout="vertical"
                    onFinish={handleEditUser}
                >
                    <Form.Item
                        name="id"
                        label="id"
                        hidden={true}
                    >
                    </Form.Item>

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
                            loading={editLoading}
                            size="large"
                            block
                        >
                            {editLoading ? 'Editing...' : 'Edit User'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Title level={2} style={{ margin: 0 }}>
                        <UserOutlined />User Management
                    </Title>
                </Card>

                <Row gutter={[24, 24]}>
                    {/* Create User Section */}
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <Space>
                                    <EditOutlined />
                                    <span>Create User</span>
                                </Space>
                            }
                        >
                            <Form
                                form={createUserForm}
                                layout="vertical"
                                onFinish={handleCreateUser}
                                initialValues={{
                                    username: '',
                                    email: ''
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

                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        { required: true, message: 'Please enter your password!' },
                                        { min: 6, message: 'Password must be at least 6 characters!' }
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined />}
                                        placeholder="Enter password"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={createLoading}
                                        size="large"
                                        block
                                    >
                                        {createLoading ? 'Creating...' : 'Create User'}
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <Space>
                                    <EditOutlined />
                                    <span>Manage User</span>
                                </Space>
                            }
                        >
                            <Table columns={columns} dataSource={users} loading={getUsersLoading} pagination={false} />
                        </Card>
                    </Col>
                </Row>
            </Space>
        </div>
    );
};

export default UserProfile;