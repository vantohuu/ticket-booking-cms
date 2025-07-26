import React, { useEffect } from "react";
import { Modal, Form, Input, Button, InputNumber, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createRoom, updateRoom, showEndEditModal } from "../actions";
import { selectIsShowEditModal, selectCinemas } from "../selectors";

const { Option } = Select;

const AddEditRoom = ({ type = "create", room }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isModalVisible = useSelector(selectIsShowEditModal);
  const cinemas = useSelector(selectCinemas) || [];

  const handleSubmit = (values) => {
    const payload = {
      name: values.name,
      totalSeats: values.totalSeats,
      cinemaId: values.cinemaId,
    };

    if (type === "edit" && room?.id) {
      dispatch(updateRoom({ ...payload, id: room.id }));
    } else {
      dispatch(createRoom(payload));
      form.resetFields();
    }

    dispatch(showEndEditModal());
  };

  const handleCancel = () => {
    dispatch(showEndEditModal());
  };

  useEffect(() => {
    if (isModalVisible) {
      if (room) {
        form.setFieldsValue({
          name: room.name || "",
          totalSeats: room.totalSeats || null,
          cinemaId: room.cinemaId || null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [room, isModalVisible, form]);



  return (
    <Modal
      title={room ? "Chỉnh sửa phòng chiếu" : "Thêm phòng chiếu mới"}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên phòng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
          <Input placeholder="Tên phòng" />
        </Form.Item>

        <Form.Item
          label="Tổng số ghế"
          name="totalSeats"
          rules={[
            { required: true, message: "Vui lòng nhập số ghế!" },
            { type: "number", min: 1, message: "Số ghế phải lớn hơn 0!" },
          ]}
        >
          <InputNumber placeholder="Số ghế" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Rạp chiếu"
          name="cinemaId"
          rules={[{ required: true, message: "Vui lòng chọn rạp!" }]}
        >
          <Select placeholder="Chọn rạp">
            {cinemas.map((cinema) => (
              <Option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </Option>
            ))}
          </Select>
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
  );
};

export default AddEditRoom;
