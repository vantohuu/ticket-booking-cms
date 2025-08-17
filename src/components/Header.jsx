import React from 'react';
import { Button, Avatar, Dropdown, Menu } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const AppHeader = ({ onToggleDrawer }) => {
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="/profile" icon={<UserOutlined />}>
        Hồ sơ cá nhân
      </Menu.Item>
      <Menu.Item key="/login" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="flex items-center justify-between bg-white shadow-md px-6 h-16">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggleDrawer}
          className="text-2xl p-0"
        />
        <h1 className="text-xl font-bold m-0 select-none">🎟 Ticket Booking CMS</h1>
      </div>

      <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <Avatar
          className="cursor-pointer bg-blue-600"
          icon={<UserOutlined />}
          size="large"
        />
      </Dropdown>
    </header>
  );
};

export default AppHeader;
