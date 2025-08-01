import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { login, logout } from './../../api/loginApi';
import { setTokens, getAccessToken, clearTokens } from '../../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';
import { HTTP_CODE, API_CODE } from '../../constants/apiCode';

const LoginPage = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      logout({ token: accessToken })
        .finally(() => {
          clearTokens(); 
        });
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await login(values);
      if (response.status === HTTP_CODE.SUCCESS && response.data.code === API_CODE.SUCCESS) {
        setTokens({
          accessToken: response.data.result.token,
          refreshToken: response.data.result.token,
        });
        navigate('/');
      } else {
        messageApi.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin');
      }
    } catch (error) {
      messageApi.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {contextHolder}
      <div className="bg-white shadow p-6 rounded w-full max-w-sm">
        <h2 className="text-center text-xl font-bold mb-4">Đăng nhập Ticket Booking CMS</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
