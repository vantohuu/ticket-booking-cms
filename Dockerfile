# Development Environment - React Dev Server
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# 👉 Cài timezone data
RUN apk add --no-cache tzdata

# 👉 Set timezone Việt Nam
ENV TZ=Asia/Ho_Chi_Minh 

# Install dependencies
RUN npm install --legacy-peer-deps

# Install missing peer dependencies
RUN npm install ajv@^8.12.0 --legacy-peer-deps

# Copy source code
COPY . .

# Expose port 3000 for dev server
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
