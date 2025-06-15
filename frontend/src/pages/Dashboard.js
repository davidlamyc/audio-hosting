import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Statistic,
    List,
    Typography,
    Space,
    Button,
    Empty,
    Tag
} from 'antd';
import {
    AudioOutlined,
    CloudUploadOutlined,
    FolderOpenOutlined,
    PlusOutlined,
    UserOutlined
} from '@ant-design/icons';
import { App } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalFiles: 0,
        totalSize: 0,
        recentFiles: []
    });
    const [loading, setLoading] = useState(true);
    const { message } = App.useApp();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/audio');
            const audioFiles = response.data.audioFiles;

            const totalSize = audioFiles.reduce((sum, file) => sum + file.file_size, 0);
            const recentFiles = audioFiles.slice(0, 5);

            setStats({
                totalFiles: audioFiles.length,
                totalSize,
                recentFiles
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            message.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getCategoryColor = (category) => {
        const colors = {
            'music': 'blue',
            'podcast': 'green',
            'audiobook': 'orange',
            'sound-effect': 'purple',
            'voice-recording': 'red',
            'other': 'default'
        };
        return colors[category] || 'default';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'music': '🎵',
            'podcast': '🎙️',
            'audiobook': '📚',
            'sound-effect': '🔊',
            'voice-recording': '🎤',
            'other': '📁'
        };
        return icons[category] || '📁';
    };

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Welcome Section */}
                <Card>
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Title level={2} style={{ margin: 0 }}>
                                Welcome back, {user.username}! 👋
                            </Title>
                            <Text type="secondary" style={{ fontSize: '16px' }}>
                                Manage your audio files and account settings
                            </Text>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/upload')}
                            >
                                Upload Audio
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* Statistics Cards */}
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Audio Files"
                                value={stats.totalFiles}
                                prefix={<AudioOutlined />}
                                valueStyle={{ color: '#1677ff' }}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Total Storage Used"
                                value={formatFileSize(stats.totalSize)}
                                prefix={<FolderOpenOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Card>
                            <Statistic
                                title="Recent Uploads"
                                value={stats.recentFiles.length}
                                prefix={<CloudUploadOutlined />}
                                valueStyle={{ color: '#fa8c16' }}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Recent Files */}
                <Card
                    title={
                        <Space>
                            <AudioOutlined />
                            <span>Recent Uploads</span>
                        </Space>
                    }
                    extra={
                        <Button
                            type="link"
                            onClick={() => navigate('/library')}
                        >
                            View All
                        </Button>
                    }
                >
                    {stats.recentFiles.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={stats.recentFiles}
                            loading={loading}
                            renderItem={(file) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="link"
                                            onClick={() => navigate('/library')}
                                        >
                                            View
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '8px',
                                                background: '#f0f2f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '18px'
                                            }}>
                                                {getCategoryIcon(file.category)}
                                            </div>
                                        }
                                        title={
                                            <Space>
                                                <Text strong>{file.original_name}</Text>
                                                <Tag color={getCategoryColor(file.category)}>
                                                    {file.category.replace('-', ' ').toUpperCase()}
                                                </Tag>
                                            </Space>
                                        }
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">{file.description}</Text>
                                                <Space>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {formatFileSize(file.file_size)}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {new Date(file.created_at).toLocaleDateString()}
                                                    </Text>
                                                </Space>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Space direction="vertical">
                                    <Text type="secondary">No audio files uploaded yet</Text>
                                    <Button
                                        type="primary"
                                        icon={<CloudUploadOutlined />}
                                        onClick={() => navigate('/upload')}
                                    >
                                        Upload Your First File
                                    </Button>
                                </Space>
                            }
                        />
                    )}
                </Card>

                {/* Quick Actions */}
                <Card title="Quick Actions">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <Card
                                hoverable
                                style={{ textAlign: 'center' }}
                                onClick={() => navigate('/upload')}
                            >
                                <CloudUploadOutlined style={{ fontSize: '32px', color: '#1677ff', marginBottom: '8px' }} />
                                <div>
                                    <Text strong>Upload Audio</Text>
                                    <br />
                                    <Text type="secondary">Add new audio files</Text>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Card
                                hoverable
                                style={{ textAlign: 'center' }}
                                onClick={() => navigate('/library')}
                            >
                                <AudioOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                                <div>
                                    <Text strong>Browse Library</Text>
                                    <br />
                                    <Text type="secondary">View all your files</Text>
                                </div>
                            </Card>
                        </Col>
                        {/* <Col xs={24} sm={8}>
                            <Card
                                hoverable
                                style={{ textAlign: 'center' }}
                                onClick={() => navigate('/profile')}
                            >
                                <UserOutlined style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '8px' }} />
                                <div>
                                    <Text strong>Profile Settings</Text>
                                    <br />
                                    <Text type="secondary">Manage your account</Text>
                                </div>
                            </Card>
                        </Col> */}
                    </Row>
                </Card>
            </Space>
        </div>
    );
};

export default Dashboard;