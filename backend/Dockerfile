FROM node:22-alpine

WORKDIR /app

# Create uploads directory
RUN mkdir -p uploads

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 5000

CMD ["npm", "start"]