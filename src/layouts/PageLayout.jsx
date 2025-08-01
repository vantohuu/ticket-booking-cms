import React, { useState } from "react";
import { Layout, Drawer, Menu } from "antd";
import {
  VideoCameraOutlined,
  ShopOutlined,
  AppstoreAddOutlined,
  TableOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  IdcardOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import AppHeader from "../components/Header";

const { Content } = Layout;

function PageLayout({ children }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setDrawerVisible((prev) => !prev);
  const closeDrawer = () => setDrawerVisible(false);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    closeDrawer();
  };

  return (
    <Layout className="min-h-screen bg-gray-100">
      <AppHeader onToggleDrawer={toggleDrawer} />

      <Drawer
        title="Menu"
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          className="h-full"
        >
          <Menu.Item key="/" icon={<ScanOutlined />}>
            Scan QR vé
          </Menu.Item>
          <Menu.Item key="/movie" icon={<VideoCameraOutlined />}>
            Quản lí phim
          </Menu.Item>
          <Menu.Item key="/cinema" icon={<ShopOutlined />}>
            Quản lí rạp
          </Menu.Item>
          <Menu.Item key="/room" icon={<AppstoreAddOutlined />}>
            Quản lí phòng
          </Menu.Item>
          <Menu.Item key="/showtime" icon={<ClockCircleOutlined />}>
            Lịch chiếu
          </Menu.Item>
          <Menu.Item key="/seat-management" icon={<TableOutlined />}>
            Quản lí vé
          </Menu.Item>
          <Menu.Item key="/reports" icon={<BarChartOutlined />}>
            Thống kê báo cáo
          </Menu.Item>
        </Menu>
      </Drawer>
      <Content className="p-6 m-6 bg-white rounded shadow">{children}</Content>
    </Layout>
  );
}

export default PageLayout;
