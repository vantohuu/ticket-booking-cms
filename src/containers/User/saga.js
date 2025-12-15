import { call, put, takeLatest } from "redux-saga/effects"
import * as types from "./constants"
import * as actions from "./actions"
import * as api from "../../api/userApi"

function* fetchUsersSaga(action) {
  try {
    if (!action.payload || action.payload.page === 0) {
      yield put(actions.setBeginLoadingStatus())
    }
    const { page = 0, size = 10, sort = "id,desc", search = "" } = action.payload || {}
    const res = yield call(api.getUsersPagination, page, size, sort, search)

    const paginatedData = res.data && res.data.result ? res.data.result : {}
    const users = paginatedData.content || []
    const pagination = {
      current: paginatedData.number + 1,
      pageSize: paginatedData.size,
      total: paginatedData.totalElements,
      totalPages: paginatedData.totalPages,
    }

    yield put(actions.setUsers(users))
    yield put(actions.setPagination(pagination))
    yield put(actions.setEndLoadingStatus())
  } catch (error) {
    console.error("Fetch users failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Không thể tải danh sách người dùng"))
  }
}

function* searchUsersSaga(action) {
  try {
    const res = yield call(api.searchUsers, action.payload)
    const paginatedData = res.data && res.data.result ? res.data.result : {}
    const users = paginatedData.content || []
    const pagination = {
      current: paginatedData.number + 1,
      pageSize: paginatedData.size,
      total: paginatedData.totalElements,
      totalPages: paginatedData.totalPages,
    }

    yield put(actions.setUsers(users))
    yield put(actions.setPagination(pagination))
  } catch (error) {
    console.error("Search users failed", error)
    yield put(actions.setFailedMessage("Tìm kiếm người dùng thất bại"))
  }
}

function* createUserSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const res = yield call(api.createUser, action.payload)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      yield put(actions.fetchUsers({ page: 0 }))
      yield put(actions.setSuccessMessage("Tạo người dùng thành công"))
    }
  } catch (error) {
    console.error("Create user failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Tạo người dùng thất bại"))
  }
}

function* updateUserSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const { username, data } = action.payload
    const res = yield call(api.updateUser, username, data)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      const currentPage = action.currentPage || 0
      yield put(actions.fetchUsers({ page: currentPage }))
      yield put(actions.setSuccessMessage("Cập nhật người dùng thành công"))
    }
  } catch (error) {
    console.error("Update user failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Cập nhật người dùng thất bại"))
  }
}

function* updateUserPasswordSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const { username, password } = action.payload
    const res = yield call(api.updateUserPassword, username, { newPassword: password })
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      const currentPage = action.currentPage || 0
      yield put(actions.fetchUsers({ page: currentPage }))
      yield put(actions.setSuccessMessage("Cập nhật mật khẩu thành công"))
    }
  } catch (error) {
    console.error("Update password failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Cập nhật mật khẩu thất bại"))
  }
}

function* deleteUserSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const res = yield call(api.deleteUser, action.payload)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      const currentPage = action.currentPage || 0
      yield put(actions.fetchUsers({ page: currentPage }))
      yield put(actions.setSuccessMessage("Xóa người dùng thành công"))
    }
  } catch (error) {
    console.error("Delete user failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Xóa người dùng thất bại"))
  }
}

export default function* userSaga() {
  yield takeLatest(types.FETCH_USERS, fetchUsersSaga)
  yield takeLatest(types.SEARCH_USERS, searchUsersSaga)
  yield takeLatest(types.CREATE_USER, createUserSaga)
  yield takeLatest(types.UPDATE_USER, updateUserSaga)
  yield takeLatest(types.UPDATE_USER_PASSWORD, updateUserPasswordSaga)
  yield takeLatest(types.DELETE_USER, deleteUserSaga)
}
