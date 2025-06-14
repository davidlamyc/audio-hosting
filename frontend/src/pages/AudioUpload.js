import React, { useState } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Upload,
    Typography,
    Space,
    Progress,
    Alert,
    List
} from 'antd';
import {
    CloudUploadOutlined,
    InboxOutlined,
    FileOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { App } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;

const AudioUpload = () => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { message } = App.useApp();

    const categories = [
        { value: 'music', label: '🎵 Music' },
        { value: 'podcast', label: '🎙️ Podcast' },
        { value: 'audiobook', label: '📚 Audiobook' },
        { value: 'sound-effect', label: '🔊 Sound Effect' },
        { value: 'voice-recording', label: '🎤 Voice Recording' },
        { value: 'other', label: '📁 Other' }
    ];

    const uploadGuidelines = [
        'Supported formats: MP3, WAV, M4A, OGG, FLAC, and other audio formats',
        'Maximum file size: 50MB per file',
        'Please provide a meaningful description for better organization',
        'Choose the appropriate category to help with discovery',
        'Multiple files can be uploaded simultaneously'
    ];

    const handleUpload = async (values) => {
        if (fileList.length === 0) {
            message.error('Please select at least one audio file');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const formData = new FormData();
                formData.append('audio', file.originFileObj);
                formData.append('description', values.description);
                formData.append('category', values.category);

                await axios.post('/audio/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            ((i * 100) + (progressEvent.loaded * 100) / progressEvent.total) / fileList.length
                        );
                        setUploadProgress(progress);
                    },
                });
            }

            message.success(`${fileList.length} audio file(s) uploaded successfully!`);
            form.resetFields();
            setFileList([]);
            setUploadProgress(0);
        } catch (error) {
            message.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const beforeUpload = (file) => {
        const isAudio = file.type.startsWith('audio/');
        if (!isAudio) {
            message.error('You can only upload audio files!');
            return false;
        }

        const isLt50M = file.size / 1024 / 1024 < 50;
        if (!isLt50M) {
            message.error('Audio file must be smaller than 50MB!');
            return false;
        }

        return false; // Prevent automatic upload
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const uploadProps = {
        name: 'audio',
        multiple: true,
        fileList,
        beforeUpload,
        onChange: ({ fileList: newFileList }) => {
            setFileList(newFileList.filter(file => file.status !== 'error'));
        },
        onRemove: (file) => {
            setFileList(fileList.filter(item => item.uid !== file.uid));
        },
    };

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Title level={2} style={{ margin: 0 }}>
                        <CloudUploadOutlined /> Upload Audio Files
                    </Title>
                    <Text type="secondary">
                        Upload your audio files with descriptions and categories
                    </Text>
                </Card>

                <Card title="Upload Form">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpload}
                        initialValues={{ category: 'music' }}
                    >
                        <Form.Item
                            name="files"
                            label="Select Audio Files"
                            rules={[{ required: true, message: 'Please select audio files!' }]}
                        >
                            <Dragger {...uploadProps} style={{ padding: '20px' }}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined style={{ fontSize: '48px', color: '#1677ff' }} />
                                </p>
                                <p className="ant-upload-text" style={{ fontSize: '16px' }}>
                                    Click or drag audio files to this area to upload
                                </p>
                                <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
                                    Support for single or bulk upload. Only audio files are accepted.
                                </p>
                            </Dragger>
                        </Form.Item>

                        {fileList.length > 0 && (
                            <Card size="small" title="Selected Files" style={{ marginBottom: 16 }}>
                                <List
                                    size="small"
                                    dataSource={fileList}
                                    renderItem={(file) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<FileOutlined style={{ color: '#1677ff' }} />}
                                                title={file.name}
                                                description={`${formatFileSize(file.size)} • ${file.type}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        )}

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter a description!' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Enter a description for your audio file(s)..."
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[{ required: true, message: 'Please select a category!' }]}
                        >
                            <Select
                                size="large"
                                placeholder="Select a category"
                                options={categories}
                            />
                        </Form.Item>

                        {uploading && (
                            <Form.Item>
                                <Progress
                                    percent={uploadProgress}
                                    status="active"
                                    strokeColor={{
                                        '0%': '#108ee9',
                                        '100%': '#87d068',
                                    }}
                                />
                                <Text type="secondary">Uploading files...</Text>
                            </Form.Item>
                        )}

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={uploading}
                                disabled={fileList.length === 0}
                                icon={<CloudUploadOutlined />}
                                size="large"
                                block
                            >
                                {uploading ? `Uploading... ${uploadProgress}%` : `Upload ${fileList.length} File(s)`}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                <Card
                    title={
                        <Space>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <span>Upload Guidelines</span>
                        </Space>
                    }
                >
                    <List
                        size="small"
                        dataSource={uploadGuidelines}
                        renderItem={(item, index) => (
                            <List.Item>
                                <Text>
                                    <Text strong>{index + 1}.</Text> {item}
                                </Text>
                            </List.Item>
                        )}
                    />
                </Card>
            </Space>
        </div>
    );
};

export default AudioUpload;