import React, { useEffect, useState } from "react";
import { Modal, Form, Select, DatePicker, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createShowtime,
  updateShowtime,
  showEndEditModal,
  fetchRoomsByCinema,
  fetchMovies,
} from "../actions";
import {
  selectIsShowEditModal,
  selectCinemas,
  selectRooms,
  selectMovies,
} from "../selectors";
import dayjs from "dayjs";

const { Option } = Select;

const AddEditShowtime = ({ type = "create", showtime }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isShow = useSelector(selectIsShowEditModal);
  const cinemas = useSelector(selectCinemas);
  const rooms = useSelector(selectRooms);
  const movies = useSelector(selectMovies);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);

  useEffect(() => {
    if (type === "edit" && showtime) {
      const cinemaId = showtime.room.cinemaId;
      setSelectedCinemaId(cinemaId); 
      form.setFieldsValue({
        ...showtime,
        startTime: dayjs(showtime.startTime),
        cinemaId: cinemaId
      });
      dispatch(fetchRoomsByCinema(cinemaId));
      dispatch(fetchMovies());
    } else {
      form.resetFields();
      setSelectedCinemaId(null);
    }
  }, [type, showtime, form, dispatch]);

  const handleCinemaChange = (cinemaId) => {
    setSelectedCinemaId(cinemaId); 
    form.setFieldsValue({ roomId: null, movieId: null });
    dispatch(fetchRoomsByCinema(cinemaId));
    dispatch(fetchMovies());
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      startTime: values.startTime.toISOString(),
    };
    if (type === "create") {
      dispatch(createShowtime(payload));
    } else {
      dispatch(updateShowtime({ ...showtime, ...payload }));
    }
    dispatch(showEndEditModal());
  };

  return (
    <Modal
      open={isShow}
      title={type === "create" ? "Thêm suất chiếu" : "Cập nhật suất chiếu"}
      onCancel={() => dispatch(showEndEditModal())}
      onOk={() => form.submit()}  
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Chọn rạp chiếu"
          name="cinemaId"
          rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
        >
          <Select onChange={handleCinemaChange} placeholder="Chọn rạp">
            {cinemas.map((cinema) => (
              <Option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Chọn phòng"
          name="roomId"
          rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
        >
          <Select placeholder="Chọn phòng" disabled={!selectedCinemaId}>
            {rooms.map((room) => (
              <Option key={room.id} value={room.id}>
                {room.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Chọn phim"
          name="movieId"
          rules={[{ required: true, message: "Vui lòng chọn phim" }]}
        >
          <Select
            placeholder="Chọn phim"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {movies.map((movie) => (
              <Option key={movie.id} value={movie.id}>
                {movie.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Thời gian bắt đầu"
          name="startTime"
          rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item 
          label="Giá vé"
          name="ticketPrice"
          rules={[{ required: true, message: "Vui lòng chọn giá vé" }]}
        >
          <InputNumber
            type="number"
            min={0}
            placeholder="Nhập giá vé"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditShowtime;
