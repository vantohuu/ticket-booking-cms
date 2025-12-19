"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, Descriptions, Button, Modal, Form, Input, Select, DatePicker, message } from "antd"
import { EditOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import PageLayout from "../../layouts/PageLayout"
import { fetchProfile, updateProfile, showBeginEditModal, showEndEditModal, clearMessages } from "./actions"
import {
  selectProfile,
  selectIsLoading,
  selectIsShowEditModal,
  selectSuccessMessage,
  selectFailedMessage,
} from "./selectors"
import Loading from "../../components/Loading"

const { Option } = Select

const ProfilePage = () => {
  const dispatch = useDispatch()
  const userData = useSelector(selectProfile)
  const loading = useSelector(selectIsLoading)
  const showEditModal = useSelector(selectIsShowEditModal)
  const successMessage = useSelector(selectSuccessMessage)
  const failedMessage = useSelector(selectFailedMessage)
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage)
      dispatch(clearMessages())
    }
    if (failedMessage) {
      message.error(failedMessage)
      dispatch(clearMessages())
    }
  }, [successMessage, failedMessage, dispatch])

  const handleEdit = () => {
    form.setFieldsValue({
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      phone: userData?.phone,
      gender: userData?.gender,
      dateOfBirth: userData?.dateOfBirth ? dayjs(userData.dateOfBirth) : null,
      address: userData?.address,
      idCard: userData?.idCard,
    })
    dispatch(showBeginEditModal())
  }

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null,
    }
    dispatch(updateProfile(payload))
  }

  const handleCancel = () => {
    form.resetFields()
    dispatch(showEndEditModal())
  }

  if (loading && !userData) {
    return <Loading />
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto mt-10">
        <Card
          title="Thông tin cá nhân"
          bordered={false}
          className="shadow rounded"
          extra={
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              Chỉnh sửa
            </Button>
          }
        >
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Tên đăng nhập">{userData?.username || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Họ">{userData?.firstName || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Tên">{userData?.lastName || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData?.email || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{userData?.phone || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {userData?.gender === true ? "Nam" : userData?.gender === false ? "Nữ" : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {userData?.dateOfBirth ? dayjs(userData.dateOfBirth).format("DD/MM/YYYY") : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{userData?.address || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="CMND/CCCD">{userData?.idCard || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Chức vụ">
              {userData?.position === "ADMIN"
                ? "Quản trị viên"
                : userData?.position === "MANAGER"
                  ? "Quản lý"
                  : userData?.position === "STAFF"
                    ? "Nhân viên"
                    : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{userData?.status ? "Hoạt động" : "Khóa"}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Modal
          title="Chỉnh sửa thông tin cá nhân"
          open={showEditModal}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Họ" name="firstName" rules={[{ required: true, message: "Vui lòng nhập họ!" }]}>
              <Input placeholder="Nhập họ" />
            </Form.Item>

            <Form.Item label="Tên" name="lastName" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
              <Input placeholder="Nhập tên" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Email không hợp lệ!" }]}>
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender">
              <Select placeholder="Chọn giới tính">
                <Option value={true}>Nam</Option>
                <Option value={false}>Nữ</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dateOfBirth">
              <DatePicker placeholder="Chọn ngày sinh" format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item label="CMND/CCCD" name="idCard">
              <Input placeholder="Nhập số CMND/CCCD" />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Cập nhật
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  )
}

export default ProfilePage
