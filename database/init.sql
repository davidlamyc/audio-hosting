-- Create database and user
SELECT 'CREATE DATABASE audiohosting' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'audiohosting');

-- Switch to the database
\c audiohosting;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audio_files table
CREATE TABLE audio_files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    duration INTEGER, -- duration in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_audio_files_user_id ON audio_files(user_id);
CREATE INDEX idx_audio_files_category ON audio_files(category);
CREATE INDEX idx_audio_files_created_at ON audio_files(created_at);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@audiohosting.com', '$2a$10$Hw4E3eJtBrBOMmZQq6ZtS.P3jQIJTY1VFL2RntGBnUbfbgDsx7/S.');

-- Create function to update updated_at timestamp
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $ language 'plpgsql';

-- -- Create triggers for updated_at
-- CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_audio_files_updated_at BEFORE UPDATE ON audio_files 
--     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();