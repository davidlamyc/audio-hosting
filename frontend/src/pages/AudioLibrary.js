import React, { useState, useEffect, useRef } from 'react';
import {
    Card,
    Input,
    Select,
    Button,
    List,
    Typography,
    Space,
    Tag,
    Avatar,
    Modal,
    Slider,
    Row,
    Col,
    Empty,
    Popconfirm
} from 'antd';
import {
    AudioOutlined,
    SearchOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    DeleteOutlined,
    DownloadOutlined,
    FilterOutlined,
    SoundOutlined
} from '@ant-design/icons';
import { App } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;
const { Search } = Input;

const AudioLibrary = () => {
    const [audioFiles, setAudioFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(50);
    const [playerVisible, setPlayerVisible] = useState(false);
    const audioRef = useRef(null);
    const { message } = App.useApp();

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'music', label: '🎵 Music' },
        { value: 'podcast', label: '🎙️ Podcast' },
        { value: 'audiobook', label: '📚 Audiobook' },
        { value: 'sound-effect', label: '🔊 Sound Effect' },
        { value: 'voice-recording', label: '🎤 Voice Recording' },
        { value: 'other', label: '📁 Other' }
    ];

    useEffect(() => {
        fetchAudioFiles();
    }, []);

    useEffect(() => {
        filterFiles();
    }, [audioFiles, searchTerm, filterCategory]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setCurrentlyPlaying(null);
            setPlayerVisible(false);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentlyPlaying]);

    const fetchAudioFiles = async () => {
        try {
            const response = await axios.get('/audio');
            setAudioFiles(response.data.audioFiles);
        } catch (error) {
            message.error('Failed to fetch audio files');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterFiles = () => {
        let filtered = audioFiles;

        if (searchTerm) {
            filtered = filtered.filter(file =>
                file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== 'all') {
            filtered = filtered.filter(file => file.category === filterCategory);
        }

        setFilteredFiles(filtered);
    };

    const handlePlay = async (audioFile) => {
        try {
            const audio = audioRef.current;

            if (currentlyPlaying === audioFile.id) {
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
                return;
            }

            setCurrentlyPlaying(audioFile.id);
            setPlayerVisible(true);

            const audioUrl = `/api/audio/${audioFile.id}`;
            audio.src = audioUrl;
            audio.volume = volume / 100;
            audio.load();

            try {
                await audio.play();
            } catch (playError) {
                console.error('Play error:', playError);
                message.error('Failed to play audio file');
            }
        } catch (error) {
            message.error('Failed to load audio file');
            console.error('Load error:', error);
        }
    };

    const handleDelete = async (audioFile) => {
        try {
            await axios.delete(`/audio/${audioFile.id}`);
            setAudioFiles(audioFiles.filter(file => file.id !== audioFile.id));
            message.success('Audio file deleted successfully');

            if (currentlyPlaying === audioFile.id) {
                setCurrentlyPlaying(null);
                setPlayerVisible(false);
                audioRef.current.pause();
            }
        } catch (error) {
            message.error('Failed to delete audio file');
            console.error('Delete error:', error);
        }
    };

    const handleSeek = (value) => {
        const audio = audioRef.current;
        if (audio && duration) {
            audio.currentTime = (value / 100) * duration;
        }
    };

    const handleVolumeChange = (value) => {
        setVolume(value);
        if (audioRef.current) {
            audioRef.current.volume = value / 100;
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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

    const currentFile = audioFiles.find(f => f.id === currentlyPlaying);

    return (
        <div style={{ padding: '24px' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={2} style={{ margin: 0 }}>
                                <AudioOutlined /> Audio Library
                            </Title>
                            <Text type="secondary">
                                View and manage your uploaded audio files ({filteredFiles.length} files)
                            </Text>
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={12} md={8}>
                            <Search
                                placeholder="Search audio files..."
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                allowClear
                                size="large"
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Select
                                value={filterCategory}
                                onChange={setFilterCategory}
                                style={{ width: '100%' }}
                                size="large"
                                options={categories}
                                prefix={<FilterOutlined />}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card>
                    {filteredFiles.length === 0 ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                audioFiles.length === 0 ? (
                                    <Space direction="vertical">
                                        <Text type="secondary">No audio files uploaded yet</Text>
                                        <Button
                                            type="primary"
                                            icon={<AudioOutlined />}
                                            onClick={() => window.location.href = '/upload'}
                                        >
                                            Upload Your First File
                                        </Button>
                                    </Space>
                                ) : (
                                    <Text type="secondary">No files match your search criteria</Text>
                                )
                            }
                        />
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={filteredFiles}
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} files`,
                            }}
                            renderItem={(audioFile) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="text"
                                            icon={
                                                currentlyPlaying === audioFile.id && !audioRef.current?.paused ?
                                                    <PauseCircleOutlined /> : <PlayCircleOutlined />
                                            }
                                            onClick={() => handlePlay(audioFile)}
                                            style={{
                                                color: currentlyPlaying === audioFile.id ? '#1677ff' : undefined
                                            }}
                                        >
                                            {currentlyPlaying === audioFile.id && !audioRef.current?.paused ? 'Pause' : 'Play'}
                                        </Button>,
                                        <Button
                                            type="text"
                                            icon={<DownloadOutlined />}
                                            onClick={() => window.open(`/api/audio/${audioFile.id}`, '_blank')}
                                        >
                                            Download
                                        </Button>,
                                        <Popconfirm
                                            title="Delete audio file"
                                            description="Are you sure you want to delete this audio file?"
                                            onConfirm={() => handleDelete(audioFile)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                            >
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                size={48}
                                                style={{
                                                    backgroundColor: '#f0f2f5',
                                                    color: '#1677ff',
                                                    fontSize: '18px'
                                                }}
                                            >
                                                {getCategoryIcon(audioFile.category)}
                                            </Avatar>
                                        }
                                        title={
                                            <Space>
                                                <Text
                                                    strong
                                                    style={{
                                                        color: currentlyPlaying === audioFile.id ? '#1677ff' : undefined
                                                    }}
                                                >
                                                    {audioFile.original_name}
                                                </Text>
                                                <Tag color={getCategoryColor(audioFile.category)}>
                                                    {audioFile.category.replace('-', ' ').toUpperCase()}
                                                </Tag>
                                            </Space>
                                        }
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">{audioFile.description}</Text>
                                                <Space>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {formatFileSize(audioFile.file_size)}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        Uploaded: {new Date(audioFile.created_at).toLocaleDateString()}
                                                    </Text>
                                                </Space>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            </Space>

            {/* Audio Element */}
            <audio ref={audioRef} style={{ display: 'none' }} />

            {/* Audio Player Modal */}
            <Modal
                title={
                    <Space>
                        <SoundOutlined />
                        <span>Now Playing</span>
                    </Space>
                }
                open={playerVisible}
                onCancel={() => {
                    setPlayerVisible(false);
                    audioRef.current?.pause();
                    setCurrentlyPlaying(null);
                }}
                footer={null}
                width={500}
            >
                {currentFile && (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <div style={{ textAlign: 'center' }}>
                            <Avatar
                                size={80}
                                style={{
                                    backgroundColor: '#f0f2f5',
                                    color: '#1677ff',
                                    fontSize: '32px',
                                    marginBottom: '16px'
                                }}
                            >
                                {getCategoryIcon(currentFile.category)}
                            </Avatar>
                            <Title level={4} style={{ margin: 0 }}>
                                {currentFile.original_name}
                            </Title>
                            <Text type="secondary">{currentFile.description}</Text>
                        </div>

                        <div>
                            <Row justify="space-between" style={{ marginBottom: 8 }}>
                                <Text type="secondary">{formatTime(currentTime)}</Text>
                                <Text type="secondary">{formatTime(duration)}</Text>
                            </Row>
                            <Slider
                                min={0}
                                max={100}
                                value={duration ? (currentTime / duration) * 100 : 0}
                                onChange={handleSeek}
                                tooltip={{
                                    formatter: (value) => formatTime((value / 100) * duration)
                                }}
                            />
                        </div>

                        <Row justify="center" align="middle" gutter={16}>
                            <Col>
                                <Button
                                    type="primary"
                                    size="large"
                                    shape="circle"
                                    icon={
                                        audioRef.current?.paused ?
                                            <PlayCircleOutlined /> : <PauseCircleOutlined />
                                    }
                                    onClick={() => {
                                        if (audioRef.current?.paused) {
                                            audioRef.current.play();
                                        } else {
                                            audioRef.current?.pause();
                                        }
                                    }}
                                />
                            </Col>
                        </Row>

                        <div>
                            <Text type="secondary">Volume: {volume}%</Text>
                            <Slider
                                min={0}
                                max={100}
                                value={volume}
                                onChange={handleVolumeChange}
                                tooltip={{
                                    formatter: (value) => `${value}%`
                                }}
                            />
                        </div>
                    </Space>
                )}
            </Modal>
        </div>
    );
};

export default AudioLibrary;