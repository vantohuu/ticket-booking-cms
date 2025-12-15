"use client"

import { useEffect } from "react"
import { Modal, Form, Input, Button } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { createUser, updateUser, showEndEditModal } from "../actions"
import { selectIsShowEditModal } from "../selectors"

const AddEditUser = ({ type = "create", user = null, currentPage }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const isModalVisible = useSelector(selectIsShowEditModal)
  const isEditMode = type === "edit" && user

  const handleSubmit = (values) => {
    if (isEditMode) {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      }
      dispatch(updateUser(user.username, payload, currentPage))
    } else {
      // Create new user
      const payload = {
        username: values.username,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      }
      dispatch(createUser(payload))
    }
    form.resetFields()
    dispatch(showEndEditModal())
  }

  const handleCancel = () => {
    dispatch(showEndEditModal())
    form.resetFields()
  }

  useEffect(() => {
    if (isModalVisible) {
      if (isEditMode) {
        form.setFieldsValue({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        })
      } else {
        form.resetFields()
      }
    }
  }, [isModalVisible, isEditMode, user, form])

  return (
    <Modal
      title={isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            { min: 4, message: "Tên đăng nhập phải có ít nhất 4 ký tự!" },
          ]}
        >
          <Input placeholder="Tên đăng nhập" disabled={isEditMode} />
        </Form.Item>

        {!isEditMode && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>
        )}

        <Form.Item label="Họ" name="firstName" rules={[{ required: true, message: "Vui lòng nhập họ!" }]}>
          <Input placeholder="Họ" />
        </Form.Item>

        <Form.Item label="Tên" name="lastName" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
          <Input placeholder="Tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddEditUser
