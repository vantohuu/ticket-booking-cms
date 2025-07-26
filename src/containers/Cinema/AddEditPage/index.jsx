import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createCinema, updateCinema, showEndEditModal } from '../actions';
import { selectIsShowEditModal } from '../selectors';

const AddEditCinema = ({ type = 'create', cinema }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isModalVisible = useSelector(selectIsShowEditModal);

  const handleSubmit = (values) => {
    const payload = {
      name: values.name,
      address: values.address,
      phone: values.phone,
    };

    if (type === 'edit' && cinema?.id) {
      dispatch(updateCinema({ ...payload, id: cinema.id }));
    } else {
      dispatch(createCinema(payload));
      form.resetFields(); // Chỉ reset khi thêm mới
    }

    dispatch(showEndEditModal());
  };

  const handleCancel = () => {
    dispatch(showEndEditModal());
  };

  useEffect(() => {
    if (isModalVisible) {
      if (cinema) {
        form.setFieldsValue({
          name: cinema.name || '',
          address: cinema.address || '',
          phone: cinema.phone || '',
        });
      } else {
        form.resetFields();
      }
    }
  }, [cinema, isModalVisible, form]);

  return (
    <Modal
      title={cinema ? 'Chỉnh sửa rạp' : 'Thêm rạp mới'}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Tên rạp"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên rạp!' }]}
        >
          <Input placeholder="Tên rạp" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Địa chỉ" />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input placeholder="Số điện thoại" type="number" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditCinema;
