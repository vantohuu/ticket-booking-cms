import React, { useState } from 'react';
import { Drawer, Button, Menu } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const NavigationDrawer = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <div>
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={showDrawer}
        style={{ marginBottom: 16 }}
      >
        Menu
      </Button>

      <Drawer
        title="TiketBookingCMS"
        placement="left"
        onClose={onClose}
        visible={visible}
      >
        <Menu mode="vertical" defaultSelectedKeys={['home']}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            Trang chủ
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Quản lí rạp
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Quản lí quản lí phòng
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Cài đặt
          </Menu.Item>
        </Menu>
      </Drawer>
    </div>
  );
};

export default NavigationDrawer;
