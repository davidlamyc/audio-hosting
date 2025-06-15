FROM nginx:alpine

# Copy configuration
COPY conf.d/ /etc/nginx/conf.d/

# Install security updates
RUN apk upgrade --no-cache

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]