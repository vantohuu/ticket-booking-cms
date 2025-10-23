"use client"
import { useNavigate } from "react-router-dom"
import { Result, Button } from "antd"

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Result
        status="403"
        title="403"
        subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
        extra={
          <Button type="primary" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </Button>
        }
      />
    </div>
  )
}

export default UnauthorizedPage
