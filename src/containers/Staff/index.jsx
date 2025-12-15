"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, message, Modal, Tag, Input, Spin } from "antd"
import {
  fetchStaff,
  showBeginEditModal,
  showBeginPasswordModal,
  deleteStaff,
  clearMessages,
  searchStaff,
} from "./actions"
import {
  selectStaff,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
  selectPagination,
  selectIsSearching,
} from "./selectors"
import PageLayout from "../../layouts/PageLayout"
import AddEditStaff from "./AddEditPage"
import ChangePasswordModal from "./ChangePasswordModal"
import Loading from "../../components/Loading"
import { jwtDecode } from "jwt-decode"

const StaffList = () => {
  const dispatch = useDispatch()
  const [modalType, setModalType] = useState(null)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isSearchingLocal, setIsSearchingLocal] = useState(false)
  const searchInputRef = useRef(null)
  const isInitialMount = useRef(true)
  const messageText = useSelector(selectSuccessMessage)
  const errorText = useSelector(selectFailedMessage)
  const staff = useSelector(selectStaff) || []
  const isLoading = useSelector(selectIsLoading)
  const pagination = useSelector(selectPagination) || {}
  const isSearching = useSelector(selectIsSearching)

  const getUserRole = () => {
    const token = localStorage.getItem("access_token")
    if (!token) return null
    try {
      const decoded = jwtDecode(token)
      return decoded?.scope || ""
    } catch (error) {
      return null
    }
  }

  const userRole = getUserRole()
  const isAdmin = userRole?.includes("ROLE_ADMIN")

  const activeStaff = useMemo(() => {
    return staff.filter((s) => s.status !== 0 && s.status !== false)
  }, [staff])

  useEffect(() => {
    dispatch(fetchStaff({ page: 0, size: pageSize }))
  }, [])

  useEffect(() => {
    if (!isSearching && !isInitialMount.current) {
      dispatch(fetchStaff({ page: currentPage - 1, size: pageSize }))
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
        dispatch(searchStaff({ page: 0, size: pageSize, search: trimmedValue }))
        setIsSearchingLocal(false)
      }, 500)

      return () => {
        clearTimeout(debounceTimer)
        setIsSearchingLocal(false)
      }
    } else if (searchText === "") {
      dispatch(fetchStaff({ page: 0, size: pageSize }))
      setCurrentPage(1)
      setIsSearchingLocal(false)
    }
  }, [searchText, dispatch, pageSize])

  const handleAddClick = useCallback(() => {
    setModalType("add")
    setSelectedStaff(null)
    dispatch(showBeginEditModal())
  }, [dispatch])

  const handleEditClick = useCallback(
    (staff) => {
      setModalType("edit")
      setSelectedStaff(staff)
      dispatch(showBeginEditModal())
    },
    [dispatch],
  )

  const handleChangePasswordClick = useCallback(
    (staff) => {
      setSelectedStaff(staff)
      dispatch(showBeginPasswordModal())
    },
    [dispatch],
  )

  const handleDeleteClick = useCallback(
    (staff) => {
      Modal.confirm({
        title: "Xác nhận xóa nhân viên",
        content: `Bạn có chắc chắn muốn xóa nhân viên "${staff.username}"? Tài khoản sẽ bị vô hiệu hóa.`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          dispatch(deleteStaff(staff.username, currentPage - 1))
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

  const getPositionText = (position) => {
    switch (position) {
      case "ADMIN":
        return "Admin"
      case "MANAGER":
        return "Quản lý"
      case "STAFF":
        return "Nhân viên"
      default:
        return position
    }
  }

  const getPositionColor = (position) => {
    switch (position) {
      case "ADMIN":
        return "red"
      case "MANAGER":
        return "blue"
      case "STAFF":
        return "green"
      default:
        return "default"
    }
  }

  const canEdit = useCallback(
    (staffMember) => {
      if (isAdmin) return true
      return staffMember.position === "STAFF"
    },
    [isAdmin],
  )

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
        title: "Tên đăng nhập",
        dataIndex: "username",
        key: "username",
        sorter: (a, b) => a.username.localeCompare(b.username),
        width: "12%",
      },
      {
        title: "Họ và tên",
        key: "fullName",
        width: "15%",
        render: (_, staff) => `${staff.firstName} ${staff.lastName}`,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "15%",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        width: "12%",
      },
      {
        title: "Chức vụ",
        dataIndex: "position",
        key: "position",
        width: "10%",
        render: (position) => <Tag color={getPositionColor(position)}>{getPositionText(position)}</Tag>,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: "8%",
        render: (status) => <Tag color={status ? "green" : "red"}>{status ? "Hoạt động" : "Khóa"}</Tag>,
      },
      {
        title: "Sửa",
        key: "edit",
        width: "6%",
        render: (_, staff) =>
          canEdit(staff) ? <Button onClick={() => handleEditClick(staff)}>Sửa</Button> : <Button disabled>Sửa</Button>,
      },
      {
        title: "Đổi mật khẩu",
        key: "password",
        width: "10%",
        render: (_, staff) =>
          canEdit(staff) ? (
            <Button onClick={() => handleChangePasswordClick(staff)}>Đổi mật khẩu</Button>
          ) : (
            <Button disabled>Đổi mật khẩu</Button>
          ),
      },
      {
        title: "Xóa",
        key: "delete",
        width: "7%",
        render: (_, staff) =>
          canEdit(staff) ? (
            <Button danger onClick={() => handleDeleteClick(staff)}>
              Xóa
            </Button>
          ) : (
            <Button disabled danger>
              Xóa
            </Button>
          ),
      },
    ],
    [handleEditClick, handleChangePasswordClick, handleDeleteClick, canEdit],
  )

  if (isLoading && !searchText) return <Loading />

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Quản lý nhân viên</h2>
        <div className="mb-4">
          <Input
            ref={searchInputRef}
            placeholder="Tìm theo tên đăng nhập, họ tên, email hoặc số điện thoại"
            value={searchText}
            onChange={handleSearchChange}
            style={{ width: 400, marginRight: 16 }}
            allowClear
            onClear={() => setSearchText("")}
            suffix={isSearchingLocal ? <Spin size="small" /> : null}
          />
          <Button type="primary" onClick={handleAddClick}>
            Thêm nhân viên mới
          </Button>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={activeStaff}
          rowKey="id"
          loading={isSearchingLocal}
          pagination={{
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: pagination.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
            pageSizeOptions: ["10", "20", "50", "100"],
            ...(isSearching && { showSizeChanger: false, showQuickJumper: false }),
          }}
          onChange={handleTableChange}
        />
        <AddEditStaff type={modalType} staff={selectedStaff} currentPage={currentPage - 1} />
        <ChangePasswordModal staff={selectedStaff} currentPage={currentPage - 1} />
      </div>
    </PageLayout>
  )
}

export default StaffList
