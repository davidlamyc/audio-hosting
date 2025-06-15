FROM node:18-alpine

WORKDIR /app

# Install development dependencies
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Install nodemon globally for hot reloading
RUN npm install -g nodemon

# Development command with hot reloading
CMD ["npm", "run", "dev"]