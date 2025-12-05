"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Input, message, Modal } from "antd"
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import {
  fetchShowtimes,
  fetchCinemas,
  fetchMovies,
  deleteShowtime,
  showBeginEditModal,
  clearMessages,
  searchShowtimes,
} from "./actions"
import {
  selectShowtimes,
  selectIsLoading,
  selectIsSearchLoading,
  selectSuccessMessage,
  selectFailedMessage,
  selectPagination,
} from "./selectors"
import PageLayout from "../../layouts/PageLayout"
import AddEditShowtime from "./AddEditPage"
import Loading from "../../components/Loading"

const ShowtimeList = () => {
  const dispatch = useDispatch()
  const [modalType, setModalType] = useState(null)
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const debounceTimerRef = useRef(null)

  const messageText = useSelector(selectSuccessMessage)
  const errorText = useSelector(selectFailedMessage)
  const showtimes = useSelector(selectShowtimes) || []
  const isLoading = useSelector(selectIsLoading)
  const isSearchLoading = useSelector(selectIsSearchLoading)
  const pagination = useSelector(selectPagination) || {}

  useEffect(() => {
    dispatch(fetchShowtimes({ page: 0, size: pageSize }))
    dispatch(fetchCinemas())
    dispatch(fetchMovies())
  }, [])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      if (searchText.trim()) {
        dispatch(searchShowtimes(searchText, { page: 0, size: pageSize }))
        setCurrentPage(1)
      } else {
        dispatch(fetchShowtimes({ page: 0, size: pageSize }))
        setCurrentPage(1)
      }
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchText, pageSize])

  useEffect(() => {
    if (currentPage > 1) {
      if (searchText.trim()) {
        dispatch(searchShowtimes(searchText, { page: currentPage - 1, size: pageSize }))
      } else {
        dispatch(fetchShowtimes({ page: currentPage - 1, size: pageSize }))
      }
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

  const handleAddClick = useCallback(() => {
    setModalType("create")
    setSelectedShowtime(null)
    dispatch(showBeginEditModal())
  }, [dispatch])

  const handleEditClick = useCallback(
    (showtime) => {
      setModalType("edit")
      setSelectedShowtime(showtime)
      dispatch(showBeginEditModal())
    },
    [dispatch],
  )

  const handleDeleteClick = useCallback(
    (showtime) => {
      const movieTitle = showtime.movie?.title || "N/A"
      const startTime = dayjs(showtime.startTime).format("DD/MM/YYYY HH:mm")
      Modal.confirm({
        title: "Xác nhận xóa suất chiếu",
        content: `Bạn có chắc chắn muốn xóa suất chiếu phim "${movieTitle}" lúc ${startTime}? Hành động này sẽ xóa tất cả vé đã đặt cho suất chiếu này. Hành động này không thể hoàn tác.`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          dispatch(deleteShowtime(showtime.id, currentPage - 1))
        },
      })
    },
    [dispatch, currentPage],
  )

  const handleTableChange = useCallback((paginationInfo) => {
    setCurrentPage(paginationInfo.current)
    setPageSize(paginationInfo.pageSize)
  }, [])

  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value)
  }, [])

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: "5%",
        sorter: (a, b) => a.id - b.id,
      },
      {
        title: "Phim",
        key: "movieTitle",
        sorter: (a, b) => a.movie?.title?.localeCompare(b.movie?.title),
        width: "20%",
        render: (text, record) => record.movie?.title || "N/A",
      },
      {
        title: "Rạp chiếu",
        dataIndex: "cinemaName",
        key: "cinemaName",
        sorter: (a, b) => a.cinemaName?.localeCompare(b.cinemaName),
        width: "15%",
        render: (text, record) => record.cinemaName || "N/A",
      },
      {
        title: "Phòng chiếu",
        dataIndex: "roomName",
        key: "roomName",
        sorter: (a, b) => a.roomName?.localeCompare(b.roomName),
        width: "15%",
        render: (text, record) => record.room?.name || "N/A",
      },
      {
        title: "Thời gian bắt đầu",
        dataIndex: "startTime",
        key: "startTime",
        sorter: (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        width: "10%",
        render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
      },
      {
        title: "Thời gian kết thúc",
        dataIndex: "endTime",
        key: "endTime",
        sorter: (a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime(),
        width: "10%",
        render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
      },
      {
        title: "Giá vé",
        dataIndex: "ticketPrice",
        key: "ticketPrice",
        sorter: (a, b) => a.ticketPrice - b.ticketPrice,
        width: "10%",
        render: (value) => value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
      },
      {
        title: "Sửa",
        key: "edit",
        width: "5%",
        render: (_, showtime) => <Button onClick={() => handleEditClick(showtime)}>Sửa</Button>,
      },
      {
        title: "Xóa",
        key: "delete",
        width: "5%",
        render: (_, showtime) => (
          <Button danger onClick={() => handleDeleteClick(showtime)}>
            Xóa
          </Button>
        ),
      },
    ],
    [handleEditClick, handleDeleteClick],
  )

  if (isLoading) return <Loading />

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Danh sách suất chiếu</h2>
        <div className="mb-4">
          <Input
            placeholder="Tìm theo tên phim"
            value={searchText}
            onChange={handleSearchChange}
            prefix={isSearchLoading ? <LoadingOutlined /> : <SearchOutlined />}
            style={{ width: 300, marginRight: 16 }}
            allowClear
          />
          <Button type="primary" onClick={handleAddClick}>
            Thêm suất chiếu
          </Button>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={showtimes}
          rowKey="id"
          loading={isSearchLoading}
          pagination={{
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: pagination.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} suất chiếu`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
        />
        <AddEditShowtime type={modalType} showtime={selectedShowtime} currentPage={currentPage - 1} />
      </div>
    </PageLayout>
  )
}

export default ShowtimeList
