import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Typography } from 'antd';
import {
    DashboardOutlined,
    CloudUploadOutlined,
    AudioOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout = ({ children, user, onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/upload',
            icon: <CloudUploadOutlined />,
            label: 'Upload Audio',
        },
        {
            key: '/library',
            icon: <AudioOutlined />,
            label: 'Audio Library',
        },
        {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Profile',
        },
    ];

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile Settings',
            onClick: () => navigate('/profile'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: onLogout,
        },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: '#fff',
                    boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
                }}
            >
                <div style={{
                    padding: collapsed ? '16px 8px' : '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                    textAlign: 'center'
                }}>
                    {!collapsed ? (
                        <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
                            🎵 Audio Host
                        </Title>
                    ) : (
                        <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
                            🎵
                        </Title>
                    )}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ borderRight: 0, background: 'transparent' }}
                />
            </Sider>

            <Layout>
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px 0 rgba(29,35,41,.05)',
                    zIndex: 1
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '6px',
                            transition: 'background-color 0.2s'
                        }}>
                            <Avatar
                                style={{ backgroundColor: '#1677ff', marginRight: 8 }}
                                icon={<UserOutlined />}
                            />
                            <span style={{ fontWeight: 500 }}>
                                Welcome, {user.username}
                            </span>
                        </div>
                    </Dropdown>
                </Header>

                <Content style={{
                    margin: '24px',
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'auto'
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;