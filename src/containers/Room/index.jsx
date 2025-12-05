"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Input, message, Select, Modal, Spin } from "antd"
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { fetchRooms, fetchCinemas, showBeginEditModal, deleteRoom, clearMessages, searchRooms } from "./actions"
import {
  selectRooms,
  selectCinemas,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
  selectPagination,
  selectIsSearching,
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
  const [searchRoomName, setSearchRoomName] = useState("")
  const [filterCinemaId, setFilterCinemaId] = useState(cinemaIdFromQuery ? Number(cinemaIdFromQuery) : null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isSearchingLocal, setIsSearchingLocal] = useState(false)
  const isInitialMount = useRef(true)

  const rooms = useSelector(selectRooms) || []
  const cinemas = useSelector(selectCinemas) || []
  const messageText = useSelector(selectSuccessMessage)
  const errorText = useSelector(selectFailedMessage)
  const isLoading = useSelector(selectIsLoading)
  const pagination = useSelector(selectPagination)
  const isSearching = useSelector(selectIsSearching)

  useEffect(() => {
    dispatch(fetchCinemas())
    dispatch(fetchRooms(0, pageSize, "id,asc"))
  }, [])

  useEffect(() => {
    if (!isSearching && !isInitialMount.current && !searchRoomName.trim() && !filterCinemaId) {
      dispatch(fetchRooms(currentPage, pageSize, "id,asc"))
    }
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
  }, [currentPage, pageSize])

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

  useEffect(() => {
    const trimmedRoomName = searchRoomName.trim()
    const hasSearchCriteria = trimmedRoomName || filterCinemaId

    if (hasSearchCriteria) {
      setIsSearchingLocal(true)
      const debounceTimer = setTimeout(() => {
        dispatch(searchRooms(trimmedRoomName || null, filterCinemaId))
        setIsSearchingLocal(false)
      }, 300)

      return () => {
        clearTimeout(debounceTimer)
        setIsSearchingLocal(false)
      }
    } else if (!isInitialMount.current) {
      setIsSearchingLocal(true)
      const debounceTimer = setTimeout(() => {
        dispatch(fetchRooms(currentPage, pageSize, "id,asc"))
        setIsSearchingLocal(false)
      }, 300)

      return () => {
        clearTimeout(debounceTimer)
        setIsSearchingLocal(false)
      }
    }
  }, [searchRoomName, filterCinemaId, currentPage, pageSize, dispatch])

  const handleAddClick = useCallback(() => {
    setModalType("add")
    setSelectedRoom(null)
    dispatch(showBeginEditModal())
  }, [dispatch])

  const handleEditClick = useCallback(
    (room) => {
      setModalType("edit")
      setSelectedRoom(room)
      dispatch(showBeginEditModal())
    },
    [dispatch],
  )

  const handleDeleteClick = useCallback(
    (room) => {
      const cinemaName = cinemaIdToName[room.cinemaId] || "Không rõ"
      Modal.confirm({
        title: "Xác nhận xóa phòng chiếu",
        content: `Bạn có chắc chắn muốn xóa phòng "${room.name}" tại rạp "${cinemaName}"? Hành động này không thể hoàn tác.`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          dispatch(deleteRoom(room.id, currentPage))
        },
      })
    },
    [dispatch, currentPage],
  )

  const handleCinemaFilterChange = useCallback(
    (value) => {
      setFilterCinemaId(value)
      const params = new URLSearchParams()
      if (value !== null) {
        params.set("cinemaId", value)
      }
      navigate(`?${params.toString()}`)
    },
    [navigate],
  )

  const handleTableChange = useCallback((paginationInfo) => {
    if (paginationInfo) {
      setCurrentPage(paginationInfo.current - 1)
      setPageSize(paginationInfo.pageSize)
    }
  }, [])

  const handleRoomNameSearchChange = useCallback((e) => {
    setSearchRoomName(e.target.value)
  }, [])

  const cinemaIdToName = useMemo(() => {
    const map = {}
    cinemas.forEach((cinema) => {
      map[cinema.id] = cinema.name
    })
    return map
  }, [cinemas])

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a, b) => a.id - b.id,
        width: "10%",
      },
      {
        title: "Tên phòng",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: "30%",
      },
      {
        title: "Số ghế",
        dataIndex: "totalSeats",
        key: "totalSeats",
        sorter: (a, b) => a.totalSeats - b.totalSeats,
        width: "15%",
      },
      {
        title: "Tên rạp",
        dataIndex: "cinemaId",
        key: "cinemaName",
        render: (cinemaId) => cinemaIdToName[cinemaId] || "Không rõ",
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
    ],
    [cinemaIdToName, handleEditClick, handleDeleteClick],
  )

  if (isLoading && !searchRoomName && !filterCinemaId) return <Loading />

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Danh sách phòng chiếu</h2>
        <div className="mb-4 flex gap-4 items-center flex-wrap">
          <Input
            placeholder="Tìm theo tên phòng"
            value={searchRoomName}
            onChange={handleRoomNameSearchChange}
            style={{ width: 250 }}
            allowClear
            onClear={() => setSearchRoomName("")}
            suffix={isSearchingLocal ? <Spin size="small" /> : null}
          />
          <Select
            placeholder="Chọn rạp"
            onChange={handleCinemaFilterChange}
            allowClear
            style={{ width: 250 }}
            value={filterCinemaId}
          >
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
          dataSource={rooms}
          rowKey="id"
          loading={isSearchingLocal}
          pagination={{
            current: (pagination?.currentPage || 0) + 1,
            pageSize: pagination?.pageSize || 10,
            total: pagination?.totalRecords || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phòng`,
            pageSizeOptions: ["5", "10", "20", "50"],
            ...(isSearching && { showSizeChanger: false, showQuickJumper: false }),
          }}
          onChange={handleTableChange}
        />
        <AddEditRoom type={modalType} room={selectedRoom} currentPage={currentPage} />
      </div>
    </PageLayout>
  )
}

export default RoomList
