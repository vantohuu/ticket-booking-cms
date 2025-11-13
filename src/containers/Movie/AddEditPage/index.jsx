"use client"

import { useEffect, useState } from "react"
import { Modal, Form, Input, Button, DatePicker, Select, Upload, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
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

  const [posterFile, setPosterFile] = useState(null)
  const [posterFileList, setPosterFileList] = useState([])

  const handleSubmit = (values) => {
    const formattedDate = values.releaseDate ? dayjs(values.releaseDate).format("YYYY-MM-DD") : null


    const payload = {
      title: values.title,
      description: values.description,
      duration: values.duration,
      language: values.language,
      trailer: values.trailer,
      releaseDate: formattedDate,
      genreIds: values.genreIds || [],
      actorIds: values.actorIds || [],
      posterFile: posterFile, // This is the actual File object
    }


    if (type === "edit" && movie?.id) {
      dispatch(updateMovie({ id: movie.id, data: payload }, currentPage))
    } else {
      dispatch(createMovie(payload))
      form.resetFields()
      setPosterFile(null)
      setPosterFileList([])
    }

    dispatch(showEndEditModal())
  }

  const handleCancel = () => {
    dispatch(showEndEditModal())
    setPosterFile(null)
    setPosterFileList([])
  }

  const handleFileChange = (file) => {
  
    // Validate file type
    const isImage = file.type?.startsWith("image/")
    if (!isImage) { 
      message.error("Chỉ có thể tải lên file ảnh!")
      setPosterFile(null)
      setPosterFileList([])
      return false
    }

    // Validate file size (max 5MB)
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      message.error("Kích thước ảnh phải nhỏ hơn 5MB!")
      setPosterFile(null)
      setPosterFileList([])
      return false
    }

    setPosterFile(file)
    setPosterFileList([
      {
        uid: file.uid || "-1",
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ])

    return false // Prevent auto upload
  }

  useEffect(() => {
    if (isModalVisible) {
      if (movie) {
        form.setFieldsValue({
          title: movie.title || "",
          description: movie.description || "",
          duration: movie.duration || "",
          language: movie.language || "",
          trailer: movie.trailer || "",
          releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
          genreIds: movie.genres?.map((g) => g.id) || [],
          actorIds: movie.actors?.map((a) => a.id) || [],
        })
        if (movie.poster) {
          setPosterFileList([
            {
              uid: "-1",
              name: "poster.jpg",
              status: "done",
              url: movie.poster,
            },
          ])
        }
      } else {
        form.resetFields()
        setPosterFile(null)
        setPosterFileList([])
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

        <Form.Item
          label="Poster"
          name="posterFile"
          rules={[
            {
              required: !movie,
              message: "Vui lòng tải lên poster!",
            },
          ]}
        >
          <Upload
            listType="picture"
            fileList={posterFileList}
            beforeUpload={handleFileChange}
            onRemove={() => {
              setPosterFile(null)
              setPosterFileList([])
            }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh poster</Button>
          </Upload>
          {movie?.poster && !posterFile && (
            <div style={{ marginTop: 8 }}>
              <img
                src={movie.poster || "/placeholder.svg"}
                alt="Current poster"
                style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}
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
