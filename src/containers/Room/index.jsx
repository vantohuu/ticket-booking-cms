"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Input, message, Select, Modal } from "antd"
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { fetchRooms, fetchCinemas, showBeginEditModal, deleteRoom, clearMessages } from "./actions"
import {
  selectRooms,
  selectCinemas,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
  selectPagination,
} from "./selectors"
import PageLayout from "../../layouts/PageLayout"
import AddEditRoom from "./AddEditPage"
import Loading from "../../components/Loading"
const { Option } = Select
const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3000/"

const RoomList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const cinemaIdFromQuery = searchParams.get("cinemaId")
  const [modalType, setModalType] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [selectedCinemaId, setSelectedCinemaId] = useState(cinemaIdFromQuery ? Number(cinemaIdFromQuery) : null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState("id")
  const [sortOrder, setSortOrder] = useState("asc")

  const rooms = useSelector(selectRooms) || []
  const cinemas = useSelector(selectCinemas) || []
  const messageText = useSelector(selectSuccessMessage)
  const errorText = useSelector(selectFailedMessage)
  const isLoading = useSelector(selectIsLoading)
  const pagination = useSelector(selectPagination)

  useEffect(() => {
    dispatch(fetchRooms(currentPage, pageSize, `${sortField},${sortOrder}`))
    dispatch(fetchCinemas())
  }, [dispatch, currentPage, pageSize, sortField, sortOrder])

  useEffect(() => {
    if (messageText) {
      message.success(messageText)
      dispatch(clearMessages())
    }
  }, [messageText, dispatch])

  useEffect(() => {
    if (errorText) {
      message.error(errorText)
      dispatch(clearMessages())
    }
  }, [errorText, dispatch])

  const handleAddClick = () => {
    setModalType("add")
    setSelectedRoom(null)
    dispatch(showBeginEditModal())
  }

  const handleEditClick = (room) => {
    setModalType("edit")
    setSelectedRoom(room)
    dispatch(showBeginEditModal())
  }

  const handleDeleteClick = (room) => {
    const cinemaName = cinemaIdToName[room.cinemaId] || "Không rõ"
    Modal.confirm({
      title: "Xác nhận xóa phòng chiếu",
      content: `Bạn có chắc chắn muốn xóa phòng "${room.name}" tại rạp "${cinemaName}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        dispatch(deleteRoom(room.id))
      },
    })
  }

  const handleCinemaChange = (value) => {
    setSelectedCinemaId(value)
    const params = new URLSearchParams()
    if (value !== null) {
      params.set("cinemaId", value)
    }
    navigate(`?${params.toString()}`)
  }
  const cinemaIdToName = useMemo(() => {
    const map = {}
    cinemas.forEach((cinema) => {
      map[cinema.id] = cinema.name
    })
    return map
  }, [cinemas])

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchName = room.name.toLowerCase().includes(searchText)
      const matchCinema = selectedCinemaId === null || room.cinemaId === selectedCinemaId
      return matchName && matchCinema
    })
  }, [rooms, searchText, selectedCinemaId])

  const handleTableChange = (paginationInfo, filters, sorter) => {
    if (paginationInfo) {
      setCurrentPage(paginationInfo.current - 1)
      setPageSize(paginationInfo.pageSize)
    }

    if (sorter && sorter.field) {
      setSortField(sorter.field)
      setSortOrder(sorter.order === "descend" ? "desc" : "asc")
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
      width: "10%",
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
      sorter: true,
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
      width: "30%",
    },
    {
      title: "Số ghế",
      dataIndex: "totalSeats",
      key: "totalSeats",
      sorter: true,
      width: "15%",
    },
    {
      title: "Tên rạp",
      dataIndex: "cinemaId",
      key: "cinemaName",
      render: (cinemaId) => cinemaIdToName[cinemaId] || "Không rõ",
      filters: cinemas.map((c) => ({ text: c.name, value: c.id })),
      onFilter: (value, record) => record.cinemaId === value,
      width: "20%",
    },
    {
      title: "Sơ đồ ghế",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (_, room) => (
        <a href={`${BASE_URL}seat-map?roomId=${room.id}`} target="_blank" rel="noreferrer">
          Xem sơ đồ ghế
        </a>
      ),
    },
    {
      title: "Sửa",
      key: "edit",
      width: "7.5%",
      render: (_, room) => <Button onClick={() => handleEditClick(room)}>Sửa</Button>,
    },
    {
      title: "Xóa",
      key: "delete",
      width: "7.5%",
      render: (_, room) => (
        <Button danger onClick={() => handleDeleteClick(room)}>
          Xóa
        </Button>
      ),
    },
  ]

  if (isLoading) return <Loading />

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Danh sách phòng chiếu</h2>
        <div className="mb-4 flex gap-4 items-center flex-wrap">
          <Input.Search
            placeholder="Tìm theo tên phòng"
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo rạp"
            onChange={handleCinemaChange}
            allowClear
            style={{ width: 200 }}
            value={selectedCinemaId}
          >
            <Option value={null}>Tất cả rạp</Option>
            {cinemas.map((cinema) => (
              <Option key={cinema.id} value={cinema.id}>
                {cinema.name}
              </Option>
            ))}
          </Select>

          <Button type="primary" onClick={handleAddClick}>
            Thêm phòng mới
          </Button>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={filteredRooms}
          rowKey="id"
          pagination={{
            current: (pagination?.currentPage || 0) + 1,
            pageSize: pagination?.pageSize || 10,
            total: pagination?.totalRecords || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phòng`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={handleTableChange}
        />
        <AddEditRoom type={modalType} room={selectedRoom} />
      </div>
    </PageLayout>
  )
}

export default RoomList
