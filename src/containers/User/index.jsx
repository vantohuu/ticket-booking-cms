 "use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, message, Modal, Tag, Input, Spin } from "antd"
import {
  fetchUsers,
  showBeginEditModal,
  showBeginPasswordModal,
  deleteUser,
  clearMessages,
  searchUsers,
} from "./actions"
import {
  selectUsers,
  selectIsLoading,
  selectSuccessMessage,
  selectFailedMessage,
  selectPagination,
  selectIsSearching,
} from "./selectors"
import PageLayout from "../../layouts/PageLayout"
import AddEditUser from "./AddEditPage"
import ChangePasswordModal from "./ChangePasswordModal"
import Loading from "../../components/Loading"

const UserList = () => {
  const dispatch = useDispatch()
  const [modalType, setModalType] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isSearchingLocal, setIsSearchingLocal] = useState(false)
  const searchInputRef = useRef(null)
  const isInitialMount = useRef(true)
  const messageText = useSelector(selectSuccessMessage)
  const errorText = useSelector(selectFailedMessage)
  const users = useSelector(selectUsers) || []
  const isLoading = useSelector(selectIsLoading)
  const pagination = useSelector(selectPagination) || {}
  const isSearching = useSelector(selectIsSearching)

  const activeUsers = useMemo(() => {
    return users.filter((user) => user.status !== 0 && user.status !== false)
  }, [users])

  useEffect(() => {
    dispatch(fetchUsers({ page: 0, size: pageSize }))
  }, [])

  useEffect(() => {
    if (!isSearching && !isInitialMount.current) {
      dispatch(fetchUsers({ page: currentPage - 1, size: pageSize }))
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
    const trimmedValue = searchText.trim();

    if (trimmedValue) {
      setIsSearchingLocal(true)
      const debounceTimer = setTimeout(() => {
        dispatch(searchUsers({page : 0, size: pageSize, search : trimmedValue}))
        setIsSearchingLocal(false)
      }, 500)

      return () => {
        clearTimeout(debounceTimer)
        setIsSearchingLocal(false)
      }
    } else if (searchText === "") {
      dispatch(fetchUsers({ page: 0, size: pageSize }))
      setCurrentPage(1)
      setIsSearchingLocal(false)
    }
  }, [searchText, dispatch, pageSize])

  const handleAddClick = useCallback(() => {
    setModalType("add")
    setSelectedUser(null)
    dispatch(showBeginEditModal())
  }, [dispatch])

  const handleEditClick = useCallback(
    (user) => {
      setModalType("edit")
      setSelectedUser(user)
      dispatch(showBeginEditModal())
    },
    [dispatch],
  )

  const handleChangePasswordClick = useCallback(
    (user) => {
      setSelectedUser(user)
      dispatch(showBeginPasswordModal())
    },
    [dispatch],
  )

  const handleDeleteClick = useCallback(
    (user) => {
      Modal.confirm({
        title: "Xác nhận xóa người dùng",
        content: `Bạn có chắc chắn muốn xóa người dùng "${user.username}"? Tài khoản sẽ bị vô hiệu hóa.`,
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk() {
          dispatch(deleteUser(user.username, currentPage - 1))
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
        render: (_, user) => `${user.firstName} ${user.lastName}`,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "18%",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        width: "12%",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: "10%",
        render: (status) => <Tag color={status ? "green" : "red"}>{status ? "Hoạt động" : "Khóa"}</Tag>,
      },
      {
        title: "Sửa",
        key: "edit",
        width: "8%",
        render: (_, user) => <Button onClick={() => handleEditClick(user)}>Sửa</Button>,
      },
      {
        title: "Đổi mật khẩu",
        key: "password",
        width: "10%",
        render: (_, user) => <Button onClick={() => handleChangePasswordClick(user)}>Đổi mật khẩu</Button>,
      },
      {
        title: "Xóa",
        key: "delete",
        width: "10%",
        render: (_, user) => (
          <Button danger onClick={() => handleDeleteClick(user)}>
            Xóa
          </Button>
        ),
      },
    ],
    [handleEditClick, handleChangePasswordClick, handleDeleteClick],
  )

  if (isLoading && !searchText) return <Loading />

  return (
    <PageLayout>
      <div>
        <h2 className="text-xl font-bold mb-4">Quản lý người dùng</h2>
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
            Thêm người dùng mới
          </Button>
        </div>

        <Table
          bordered
          columns={columns}
          dataSource={activeUsers}
          rowKey="id"
          loading={isSearchingLocal}
          pagination={{
            current: pagination.current || 1,
            pageSize: pagination.pageSize || 10,
            total: pagination.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
            pageSizeOptions: ["10", "20", "50", "100"],
            ...(isSearching && { showSizeChanger: false, showQuickJumper: false }),
          }}
          onChange={handleTableChange}
        />
        <AddEditUser type={modalType} user={selectedUser} currentPage={currentPage - 1} />
        <ChangePasswordModal user={selectedUser} currentPage={currentPage - 1} />
      </div>
    </PageLayout>
  )
}

export default UserList
