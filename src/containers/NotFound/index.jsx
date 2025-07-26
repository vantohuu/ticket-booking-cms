import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <p className="text-xl mb-6 text-gray-700">Trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
      <Button type="primary" onClick={() => navigate('/')}>
        Về trang chủ
      </Button>
    </div>
  );
};

export default NotFoundPage;
