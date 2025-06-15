import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileManagement from './pages/ProfileManagement';
import UserManagement from './pages/UserManagement';
import AudioUpload from './pages/AudioUpload';
import AudioLibrary from './pages/AudioLibrary';
import AppLayout from './components/AppLayout';
import LoadingScreen from './components/LoadingScreen';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/auth/check');
            if (response.data.authenticated) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = async () => {
        try {
            await axios.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1677ff',
                    borderRadius: 6,
                },
            }}
        >
            <AntApp>
                <Router>
                    <Routes>
                        <Route
                            path="/login"
                            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="/*"
                            element={
                                user ? (
                                    <AppLayout user={user} onLogout={handleLogout}>
                                        <Routes>
                                            <Route path="/dashboard" element={<Dashboard user={user} />} />
                                            <Route path="/profilemanagement" element={<ProfileManagement user={user} setUser={setUser} />} />
                                            <Route path="/usermanagement" element={<UserManagement user={user}/>} />
                                            <Route path="/upload" element={<AudioUpload />} />
                                            <Route path="/library" element={<AudioLibrary />} />
                                            <Route path="/" element={<Navigate to="/dashboard" />} />
                                        </Routes>
                                    </AppLayout>
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </Router>
            </AntApp>
        </ConfigProvider>
    );
}

export default App;