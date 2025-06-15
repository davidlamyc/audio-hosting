# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Set build arguments
ARG REACT_APP_API_URL
ARG REACT_APP_ENV

# Set environment variables
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS runtime

# Install security updates
RUN apk upgrade --no-cache

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# # Create non-root user
# RUN addgroup -g 1001 -S nginx_app && \
#     adduser -S nginx_app -u 1001

# # Set proper permissions
# RUN chown -R nginx_app:nginx_app /usr/share/nginx/html && \
#     chown -R nginx_app:nginx_app /var/cache/nginx && \
#     chown -R nginx_app:nginx_app /var/log/nginx && \
#     chown -R nginx_app:nginx_app /etc/nginx/conf.d

# # Switch to non-root user
# USER nginx_app

# Set proper permissions (nginx will run as root)
RUN chmod -R 755 /usr/share/nginx/html

# Test nginx configuration
# RUN nginx -t

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]