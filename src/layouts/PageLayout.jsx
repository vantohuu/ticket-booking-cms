"use client"

import { useState } from "react"
import { Layout, Drawer, Menu } from "antd"
import {
  VideoCameraOutlined,
  ShopOutlined,
  AppstoreAddOutlined,
  TableOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  ScanOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import AppHeader from "../components/Header"
import { jwtDecode } from "jwt-decode"

const { Content } = Layout

function PageLayout({ children }) {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleDrawer = () => setDrawerVisible((prev) => !prev)
  const closeDrawer = () => setDrawerVisible(false)

  const handleMenuClick = ({ key }) => {
    navigate(key)
    closeDrawer()
  }

  const getUserRole = () => {
    const token = localStorage.getItem("access_token")
    if (!token) return null
    try {
      const decoded = jwtDecode(token)
      return decoded?.scope || ""
    } catch (error) {
      return null
    }
  }

  const userRole = getUserRole()
  const isManager = userRole?.includes("ROLE_MANAGER")
  const isStaff = userRole?.includes("ROLE_STAFF")

  const getMenuItems = () => {
    // Staff can only access QR scan and ticket management
    if (isStaff && !isManager) {
      return [
        {
          key: "/",
          icon: <ScanOutlined />,
          label: "Scan QR vé",
        },
        {
          key: "/seat-management",
          icon: <TableOutlined />,
          label: "Quản lí vé",
        },
      ]
    }

    // Manager can access everything
    if (isManager) {
      return [
        {
          key: "/",
          icon: <ScanOutlined />,
          label: "Scan QR vé",
        },
        {
          key: "/movie",
          icon: <VideoCameraOutlined />,
          label: "Quản lí phim",
        },
        {
          key: "/cinema",
          icon: <ShopOutlined />,
          label: "Quản lí rạp",
        },
        {
          key: "/room",
          icon: <AppstoreAddOutlined />,
          label: "Quản lí phòng",
        },
        {
          key: "/showtime",
          icon: <ClockCircleOutlined />,
          label: "Lịch chiếu",
        },
        {
          key: "/seat-management",
          icon: <TableOutlined />,
          label: "Quản lí vé",
        },
        {
          key: "/reports",
          icon: <BarChartOutlined />,
          label: "Thống kê báo cáo",
        },
      ]
    }

    return []
  }

  return (
    <Layout className="min-h-screen bg-gray-100">
      <AppHeader onToggleDrawer={toggleDrawer} />

      <Drawer title="Menu" placement="left" onClose={closeDrawer} visible={drawerVisible} bodyStyle={{ padding: 0 }}>
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          className="h-full"
          items={getMenuItems()}
        />
      </Drawer>
      <Content className="p-6 m-6 bg-white rounded shadow">{children}</Content>
    </Layout>
  )
}

export default PageLayout
