# BÁO CÁO TRIỂN KHAI HỆ THỐNG TICKET BOOKING CMS LÊN DOCKER

## 1. TỔNG QUAN

### 1.1. Thông tin dự án
- **Tên dự án**: Ticket Booking CMS
- **Công nghệ**: React 18.3.1, React Scripts 5.0.1
- **Môi trường**: Development
- **Container**: Docker
- **Ngày triển khai**: Tháng 12/2025

### 1.2. Kiến trúc hệ thống

```
┌──────────────────────────────────────────────────────┐
│              Browser (http://localhost:3001)         │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│           Docker Container (ticket-cms)              │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │     React Dev Server (Port 3001)           │    │
│  │     - Hot Reload Enabled                   │    │
│  │     - Development Mode                     │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│         Backend API Services (Local Host)            │
│                                                      │
│  • API Server:    http://localhost:8888             │
│  • Uploads:       http://localhost:8081             │
└──────────────────────────────────────────────────────┘
```

## 2. CÀI ĐẶT VÀ CẤU HÌNH

### 2.1. Yêu cầu hệ thống
- Docker Desktop (phiên bản mới nhất)
- macOS/Linux/Windows
- RAM: Tối thiểu 4GB
- Disk: Tối thiểu 2GB trống

### 2.2. Cấu trúc dự án

```
ticket-booking-cms/
├── src/                    # Source code React
│   ├── api/               # API services
│   ├── components/        # React components
│   ├── containers/        # Page containers
│   ├── redux/             # Redux store
│   └── utils/             # Utilities
├── public/                # Static files
├── .env                   # Environment variables
├── .dockerignore          # Docker ignore
├── Dockerfile             # Docker configuration
├── package.json           # Dependencies
└── tailwind.config.js     # Tailwind config
```

### 2.3. File cấu hình Docker

#### 2.3.1. Dockerfile

```dockerfile
# Development Environment - React Dev Server
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install missing peer dependencies
RUN npm install ajv@^8.12.0 --legacy-peer-deps

# Copy source code
COPY . .

# Expose port 3001 for dev server
EXPOSE 3001

# Start development server
CMD ["npm", "start"]
```

**Đặc điểm:**
- Sử dụng Node.js 18 Alpine (image nhỏ gọn)
- Cài đặt dependencies với `--legacy-peer-deps`
- Chạy React development server (`npm start`)
- Hot reload được hỗ trợ
- Port: 3001

#### 2.3.2. .dockerignore

```
node_modules
npm-debug.log
build
.git
.gitignore
README.md
.DS_Store
coverage
.vscode
.idea
*.log
```

**Mục đích:**
- Loại bỏ node_modules (sẽ cài đặt lại trong container)
- Giảm kích thước build context
- Tăng tốc độ build
- Bảo mật (không copy các file nhạy cảm)

#### 2.3.3. .env

```env
REACT_APP_API_URL=http://localhost:8888/api/v1/
REACT_APP_API_TIMEOUT=60000
REACT_APP_URL=http://localhost:3001/
REACT_APP_USER_SERVICE=user-service
REACT_APP_MOVIE_SERVICE=movie-service
REACT_APP_CINEMA_SERVICE=cinema-service
REACT_APP_BOOKING_SERVICE=booking-service
PORT=3001
```

**Lưu ý:** File .env được copy vào container để React dev server có thể đọc các biến môi trường.

## 3. QUÁ TRÌNH TRIỂN KHAI

### 3.1. Xử lý vấn đề Dependencies

#### Vấn đề 1: React version conflict

**Lỗi:**
```
Attempted import error: 'use' is not exported from 'react'
```

**Nguyên nhân:** 
- Package `@testing-library/react` v16.3.0 yêu cầu React 19
- Dự án đang dùng React 18.3.1

**Giải pháp:**
Downgrade testing libraries trong `package.json`:

```json
{
  "@testing-library/react": "^14.3.1",
  "@testing-library/dom": "^9.3.4"
}
```

#### Vấn đề 2: Missing ajv module

**Lỗi:**
```
Error: Cannot find module 'ajv/dist/compile/codegen'
```

**Giải pháp:**
Thêm vào Dockerfile:
```dockerfile
RUN npm install ajv@^8.12.0 --legacy-peer-deps
```

### 3.2. Build Docker Image

**Bước 1: Build image**
```bash
docker build -t ticket-booking-cms .
```

**Bước 2: Verify image**
```bash
docker images | grep ticket-booking-cms
```

**Kết quả mong đợi:**
- Image name: `ticket-booking-cms`
- Size: ~400-500MB (bao gồm node_modules)
- Build time: 2-3 phút

### 3.3. Chạy Container

**Lệnh chạy:**
```bash
docker run -d -p 3001:3001 --name ticket-cms ticket-booking-cms
```

**Giải thích parameters:**
- `-d`: Chạy ở chế độ detached (background)
- `-p 3001:3001`: Map port 3001 từ container ra host
- `--name ticket-cms`: Đặt tên container
- `ticket-booking-cms`: Tên image

**Kiểm tra container đang chạy:**
```bash
docker ps
```

**Xem logs:**
```bash
docker logs ticket-cms
docker logs -f ticket-cms  # Theo dõi realtime
```

### 3.4. Truy cập ứng dụng

Mở trình duyệt và truy cập:
```
http://localhost:3001
```

## 4. QUẢN LÝ CONTAINER

### 4.1. Các lệnh cơ bản

```bash
# Xem danh sách containers
docker ps                    # Đang chạy
docker ps -a                 # Tất cả

# Dừng container
docker stop ticket-cms

# Khởi động lại
docker start ticket-cms

# Khởi động lại (restart)
docker restart ticket-cms

# Xóa container
docker rm ticket-cms

# Xóa container đang chạy (force)
docker rm -f ticket-cms
```

### 4.2. Xem logs và debug

```bash
# Xem logs
docker logs ticket-cms

# Xem logs realtime
docker logs -f ticket-cms

# Xem 100 dòng cuối
docker logs --tail 100 ticket-cms

# Truy cập shell trong container
docker exec -it ticket-cms sh

# Xem processes trong container
docker top ticket-cms

# Xem resource usage
docker stats ticket-cms
```

### 4.3. Update code

Khi có thay đổi code, cần rebuild và restart:

```bash
# Dừng và xóa container cũ
docker stop ticket-cms
docker rm ticket-cms

# Build lại image
docker build -t ticket-booking-cms .

# Chạy container mới
docker run -d -p 3001:3001 --name ticket-cms ticket-booking-cms
```

**Hoặc dùng script ngắn gọn:**
```bash
docker rm -f ticket-cms && \
docker build -t ticket-booking-cms . && \
docker run -d -p 3001:3001 --name ticket-cms ticket-booking-cms
```

## 5. XỬ LÝ SỰ CỐ

### 5.1. Container không start

**Kiểm tra:**
```bash
docker ps -a                  # Xem trạng thái
docker logs ticket-cms        # Xem logs lỗi
docker inspect ticket-cms     # Xem chi tiết
```

**Nguyên nhân thường gặp:**
- Port 3001 đã được sử dụng
- Lỗi trong code
- Thiếu dependencies

**Giải pháp:**
```bash
# Kiểm tra port đang dùng
lsof -i :3001

# Kill process đang dùng port
kill -9 <PID>

# Thử port khác
docker run -d -p 3002:3001 --name ticket-cms ticket-booking-cms
```

### 5.2. API không kết nối được

**Triệu chứng:**
- Frontend không gọi được API
- CORS errors trong console

**Kiểm tra:**
1. Backend API đang chạy:
```bash
curl http://localhost:8888/api/v1/health
```

2. File .env có đúng không:
```bash
docker exec ticket-cms cat /app/.env
```

**Giải pháp:**
- Đảm bảo backend API đang chạy
- Cấu hình CORS ở backend cho phép origin `http://localhost:3001`

### 5.3. Build bị lỗi

**Lỗi: Docker cache**
```bash
# Build với --no-cache
docker build --no-cache -t ticket-booking-cms .
```

**Lỗi: Dependencies**
```bash
# Xóa node_modules local trước khi build
rm -rf node_modules
docker build -t ticket-booking-cms .
```

## 6. TỐI ƯU HÓA

### 6.1. Giảm thời gian rebuild

**Sử dụng Docker layer caching:**
- Copy `package.json` trước
- Cài dependencies
- Sau đó mới copy source code

```dockerfile
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
```

Khi code thay đổi, chỉ layer cuối cùng rebuild.

### 6.2. Cleanup

```bash
# Xóa containers đã dừng
docker container prune

# Xóa images không dùng
docker image prune

# Xóa tất cả (containers, images, volumes, networks)
docker system prune -a

# Xem dung lượng Docker đang dùng
docker system df
```

## 7. LƯU Ý QUAN TRỌNG

### 7.1. Environment Variables

⚠️ **Quan trọng:** 
- Với React, biến môi trường được đọc lúc **start dev server**
- Container đọc từ file `.env` trong `/app/.env`
- Thay đổi `.env` cần rebuild image

### 7.2. Hot Reload

❌ **Không hoạt động:** Hot reload không hoạt động với setup hiện tại vì code nằm trong container

✅ **Để enable hot reload:** Cần mount volume:
```bash
docker run -d -p 3001:3001 \
  -v $(pwd)/src:/app/src \
  --name ticket-cms \
  ticket-booking-cms
```

### 7.3. CORS Configuration

Backend API cần cho phép CORS từ:
- `http://localhost:3001` (Docker container)
- `http://localhost:3000` (Local dev)

**Ví dụ (Spring Boot):**
```java
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001"
})
```

## 8. SO SÁNH: LOCAL vs DOCKER

| Tiêu chí | Local (`npm start`) | Docker |
|----------|---------------------|--------|
| Command | `npm start` | `docker run ...` |
| Port | 3000 | 3001 |
| Hot Reload | ✅ Có | ❌ Không (trừ khi mount volume) |
| Environment | Host machine | Isolated container |
| Dependencies | Host node_modules | Container node_modules |
| Setup Time | Nhanh | Chậm hơn (build image) |
| Consistency | ❌ Phụ thuộc máy | ✅ Nhất quán |
| Resource | Nhẹ hơn | Nặng hơn |

## 9. KẾT LUẬN

### 9.1. Kết quả đạt được

✅ **Thành công:**
- Deploy React app lên Docker container
- Chạy development server trong container
- Xử lý được vấn đề dependencies conflicts
- Container chạy ổn định trên port 3001

✅ **Lợi ích:**
- Môi trường nhất quán trên mọi máy
- Dễ dàng setup cho thành viên mới
- Tách biệt dependencies với host machine
- Dễ dàng cleanup và restart

### 9.2. Hạn chế

⚠️ **Lưu ý:**
- Hot reload không hoạt động (cần mount volume)
- Rebuild image khi thay đổi code
- Tốn nhiều tài nguyên hơn local dev
- Build time khá lâu (~2-3 phút)

### 9.3. Khuyến nghị

**Cho development:**
- Nên chạy local (`npm start`) để có hot reload
- Dùng Docker cho demo hoặc testing

**Cho production:**
- Nên dùng multi-stage build với Nginx
- Minify và optimize static files
- Cấu hình HTTPS
- Sử dụng environment-specific configs

## PHỤ LỤC

### A. Quick Commands Reference

```bash
# Build
docker build -t ticket-booking-cms .

# Run
docker run -d -p 3001:3001 --name ticket-cms ticket-booking-cms

# Stop
docker stop ticket-cms

# Start
docker start ticket-cms

# Logs
docker logs -f ticket-cms

# Remove
docker rm -f ticket-cms

# Rebuild and run
docker rm -f ticket-cms && \
docker build -t ticket-booking-cms . && \
docker run -d -p 3001:3001 --name ticket-cms ticket-booking-cms

# Cleanup
docker system prune -a
```

### B. Troubleshooting Checklist

- [ ] Docker Desktop đang chạy
- [ ] Port 3001 không bị chiếm bởi process khác
- [ ] File .env tồn tại và có đúng config
- [ ] Backend API đang chạy (port 8888)
- [ ] CORS được cấu hình đúng ở backend
- [ ] Dependencies trong package.json không conflict
- [ ] Đủ disk space cho Docker

### C. Resources

- Docker Documentation: https://docs.docker.com/
- React Documentation: https://react.dev/
- Create React App: https://create-react-app.dev/

---

**Người thực hiện**: Development Team  
**Ngày hoàn thành**: 09/12/2025  
**Version**: 1.0
