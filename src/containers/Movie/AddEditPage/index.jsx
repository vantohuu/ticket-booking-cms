"use client"

import { useEffect } from "react"
import { Modal, Form, Input, Button, DatePicker, Select } from "antd"
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { createMovie, updateMovie, showEndEditModal } from "../actions"
import { selectIsShowEditModal, selectActors, selectGenres } from "../selectors"
const { Option } = Select

const AddEditMovie = ({ type = "create", movie, currentPage }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const isModalVisible = useSelector(selectIsShowEditModal)
  const actors = useSelector(selectActors)
  const genres = useSelector(selectGenres)
  dayjs.extend(utc)
  const handleSubmit = (values) => {
    const payload = {
      ...values,
      releaseDate: dayjs(values.releaseDate).utc(true),
    }

    if (type === "edit" && movie?.id) {
      dispatch(updateMovie({ ...payload, id: movie.id }, currentPage))
    } else {
      dispatch(createMovie(payload))
      form.resetFields() // Chỉ reset khi thêm mới
    }

    dispatch(showEndEditModal())
  }

  const handleCancel = () => {
    dispatch(showEndEditModal())
  }

  useEffect(() => {
    if (isModalVisible) {
      console.log("Movie data in modal:", movie)
      if (movie) {
        form.setFieldsValue({
          title: movie.title || "",
          description: movie.description || "",
          duration: movie.duration || "",
          language: movie.language || "",
          poster: movie.poster || "",
          trailer: movie.trailer || "",
          releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
          genreIds: movie.genres?.map((g) => g.id) || [],
          actorIds: movie.actors?.map((a) => a.id) || [],
        })
      } else {
        form.resetFields()
      }
    }
  }, [movie, isModalVisible, form])

  return (
    <Modal
      title={movie ? "Chỉnh sửa phim" : "Thêm phim mới"}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tên phim" name="title" rules={[{ required: true, message: "Vui lòng nhập tên phim!" }]}>
          <Input placeholder="Tên phim" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
          <Input.TextArea rows={3} placeholder="Mô tả phim" />
        </Form.Item>

        <Form.Item
          label="Thời lượng (phút)"
          name="duration"
          rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
        >
          <Input type="number" placeholder="Thời lượng" />
        </Form.Item>
        <Form.Item label="Ngôn ngữ" name="language" rules={[{ required: true, message: "Vui lòng nhập ngôn ngữ!" }]}>
          <Input placeholder="Ngôn ngữ" />
        </Form.Item>

        <Form.Item label="Poster URL" name="poster" rules={[{ required: true, message: "Vui lòng nhập link poster!" }]}>
          <Input placeholder="Link poster" />
        </Form.Item>

        <Form.Item
          label="Trailer URL"
          name="trailer"
          rules={[{ required: true, message: "Vui lòng nhập link trailer!" }]}
        >
          <Input placeholder="Link trailer" />
        </Form.Item>
        <Form.Item
          label="Ngày phát hành"
          name="releaseDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Thể loại phim"
          name="genreIds"
          rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
        >
          <Select mode="multiple" placeholder="Chọn thể loại" allowClear optionFilterProp="children">
            {genres.map((genre) => (
              <Option key={genre.id} value={genre.id}>
                {genre.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Diễn viên" name="actorIds" rules={[{ required: true, message: "Vui lòng chọn diễn viên!" }]}>
          <Select mode="multiple" placeholder="Chọn diễn viên" allowClear optionFilterProp="children">
            {actors.map((actor) => (
              <Option key={actor.id} value={actor.id}>
                {actor.firstName + " " + actor.lastName}
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
  )
}

export default AddEditMovie
