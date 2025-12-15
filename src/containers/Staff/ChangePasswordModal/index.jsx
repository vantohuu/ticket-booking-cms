"use client"

import { useEffect } from "react"
import { Modal, Form, Input, Button } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { updateStaffPassword, showEndPasswordModal } from "../actions"
import { selectIsShowPasswordModal } from "../selectors"

const ChangePasswordModal = ({ staff, currentPage }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const isModalVisible = useSelector(selectIsShowPasswordModal)

  const handleSubmit = (values) => {
    if (staff?.username) {
      dispatch(updateStaffPassword(staff.username, values.newPassword, currentPage))
    }
    form.resetFields()
    dispatch(showEndPasswordModal())
  }

  const handleCancel = () => {
    dispatch(showEndPasswordModal())
    form.resetFields()
  }

  useEffect(() => {
    if (isModalVisible) {
      form.resetFields()
    }
  }, [isModalVisible, form])

  return (
    <Modal
      title={`Đổi mật khẩu cho: ${staff?.username || ""}`}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"))
              },
            }),
          ]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
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

export default ChangePasswordModal
