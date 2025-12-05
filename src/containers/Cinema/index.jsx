"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Input, message, Modal, Spin } from "antd"
import { fetchCinemas, showBeginEditModal, deleteCinema, clearMessages, searchCinemas } from "./actions"
import {
  selectCinemas,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
  selectPagination,
  selectIsSearching,
} from "./selectors"
import PageLayout from "../../layouts/PageLayout"
import AddEditCinema from "./AddEditPage"
import Loading from "../../components/Loading"

const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3001/"

const CinemaList = () => {
  const dispatch = useDispatch()
  const [modalType, setModalType] = useState(null)
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isSearchingLocal, setIsSearchingLocal] = useState(false)
  const searchInputRef = useRef(null)
  const isInitialMount = useRef(true)
  const messageText = useSelector(selectSuccessMessage)
  const errorText = useSelector(selectFailedMessage)
  const cinemas = useSelector(selectCinemas) || []
  const isLoading = useSelector(selectIsLoading)
  const pagination = useSelector(selectPagination) || {}
  const isSearching = useSelector(selectIsSearching)

  useEffect(() => {
    dispatch(fetchCinemas({ page: 0, size: pageSize }))
  }, [])

  useEffect(() => {
    if (!isSearching && !isInitialMount.current) {
      dispatch(fetchCinemas({ page: currentPage - 1, size: pageSize }))
    }
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    if (messageText != null && messageText !== "") {
      message.success(messageText)
      dispatch(clearMessages())
    }
  }, [messageText, dispatch])

  useEffect(() => {
    if (errorText != null && errorText !== "") {
      message.error(errorText)
      dispatch(clearMessages())
    }
  }, [errorText, dispatch])

  useEffect(() => {
    const trimmedValue = searchText.trim()

    if (trimmedValue) {
      setIsSearchingLocal(true)
      const debounceTimer = setTimeout(() => {
        dispatch(searchCinemas(trimmedValue))
        setIsSearchingLocal(false)
      }, 500)

      return () => {
        clearTimeout(debounceTimer)
        setIsSearchingLocal(false)
      }
    } else if (!isInitialMount.current) {
      // When search is cleared, fetch all cinemas again
      setIsSearchingLocal(true)
      const debounceTimer = setTimeout(() => {
        dispatch(fetchCinemas({ page: currentPage - 1, size: pageSize }))
        setIsSearchingLocal(false)
      }, 300)

      return () => {
        clearTimeout(debounceTimer)
        setIsSearchingLocal(false)
      }
    }
  }, [searchText, currentPage, pageSize, dispatch])

  const handleAddClick = useCallback(() => {
    setModalType("add")
    setSelectedCinema(null)
    dispatch(showBeginEditModal())
  }, [dispatch])

  const handleEditClick = useCallback(
    (cinema) => {
      setModalType("edit")
      setSelectedCinema(cinema)
      dispatch(showBeginEditModal())
    },
    [dispatch],
  )

  const handleDeleteClick = useCallback(
    (cinema) => {
      Modal.confirm({
        title: "Xác nhận xóa rạp chiếu phim",
        content: `Bạn có chắc chắn muốn xóa rạp "${cinema.name}"? Hành động này sẽ xóa tất cả phòng chiếu và dữ liệu liên quan. Hành động này không thể hoàn tác.`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          dispatch(deleteCinema(cinema.id, currentPage - 1))
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
        sorter: (a, b) => a.id - b.id,
        width: "5%",
      },
      {
        title: "Tên rạp",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: "25%",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        sorter: (a, b) => a.address.localeCompare(b.address),
        width: "40%",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        sorter: (a, b) => a.phone.localeCompare(b.phone),
        width: "20%",
      },
      {
        title: "Danh sách phòng",
        dataIndex: "id",
        key: "id",
        width: "10%",
        render: (_, cinema) => (
          <a href={`${BASE_URL}room?cinemaId=${cinema.id}`} target="_blank" rel="noreferrer">
            Xem danh sách phòng
          </a>
        ),
      },
      {
        title: "Sửa",
        key: "edit",
        width: "5%",
        render: (_, cinema) => <Button onClick={() => handleEditClick(cinema)}>Sửa</Button>,
      },
      {
        title: "Xóa",
        key: "delete",
        width: "5%",
        render: (_, cinema) => (
          <Button danger onClick={() => handleDeleteClick(cinema)}>
            Xóa
          </Button>
        ),
      },
    ],
    [handleEditClick, handleDeleteClick],
  )

  if (isLoading && !searchText) return <Loading />

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Danh sách rạp chiếu phim</h2>
        <div className="mb-4">
          <Input
            ref={searchInputRef}
            placeholder="Tìm theo tên rạp"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 300, marginRight: 16 }}
            allowClear
            onClear={() => setSearchText("")}
            suffix={isSearchingLocal ? <Spin size="small" /> : null}
          />
          <Button type="primary" onClick={handleAddClick}>
            Thêm rạp mới
          </Button>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={cinemas}
          rowKey="id"
          loading={isSearchingLocal}
          pagination={{
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: pagination.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} rạp`,
            pageSizeOptions: ["10", "20", "50", "100"],
            ...(isSearching && { showSizeChanger: false, showQuickJumper: false }),
          }}
          onChange={handleTableChange}
        />
        <AddEditCinema type={modalType} cinema={selectedCinema} currentPage={currentPage - 1} />
      </div>
    </PageLayout>
  )
}

export default CinemaList
