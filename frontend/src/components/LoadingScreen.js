import React from 'react';
import { Spin, Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingScreen = () => {
    return (
        <Layout style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
                <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />}
                    size="large"
                />
                <div style={{ marginTop: 16, fontSize: 18 }}>
                    Loading Audio Hosting Platform...
                </div>
            </div>
        </Layout>
    );
};

export default LoadingScreen;