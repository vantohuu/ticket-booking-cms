import { call, put, takeLatest } from "redux-saga/effects"
import * as types from "./constants"
import * as actions from "./actions"
import * as api from "../../api/staffApi"

function* fetchStaffSaga(action) {
  try {
    if (!action.payload || action.payload.page === 0) {
      yield put(actions.setBeginLoadingStatus())
    }
    const { page = 0, size = 10, sort = "id,desc", search = "" } = action.payload || {}
    const res = yield call(api.getStaffPagination, page, size, sort, search)

    const paginatedData = res.data && res.data.result ? res.data.result : {}
    const staff = paginatedData.content || []
    const pagination = {
      current: paginatedData.number + 1,
      pageSize: paginatedData.size,
      total: paginatedData.totalElements,
      totalPages: paginatedData.totalPages,
    }

    yield put(actions.setStaff(staff))
    yield put(actions.setPagination(pagination))
    yield put(actions.setEndLoadingStatus())
  } catch (error) {
    console.error("Fetch staff failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Không thể tải danh sách nhân viên"))
  }
}

function* searchStaffSaga(action) {
  try {
    const res = yield call(api.searchStaff, action.payload)
    const paginatedData = res.data && res.data.result ? res.data.result : {}
    const staff = paginatedData.content || []
    const pagination = {
      current: paginatedData.number + 1,
      pageSize: paginatedData.size,
      total: paginatedData.totalElements,
      totalPages: paginatedData.totalPages,
    }

    yield put(actions.setStaff(staff))
    yield put(actions.setPagination(pagination))
  } catch (error) {
    console.error("Search staff failed", error)
    yield put(actions.setFailedMessage("Tìm kiếm nhân viên thất bại"))
  }
}

function* createStaffSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const res = yield call(api.createStaff, action.payload)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      yield put(actions.fetchStaff({ page: 0 }))
      yield put(actions.setSuccessMessage("Tạo nhân viên thành công"))
    }
  } catch (error) {
    console.error("Create staff failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Tạo nhân viên thất bại"))
  }
}

function* updateStaffSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const { username, data } = action.payload
    const res = yield call(api.updateStaff, username, data)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      const currentPage = action.currentPage || 0
      yield put(actions.fetchStaff({ page: currentPage }))
      yield put(actions.setSuccessMessage("Cập nhật nhân viên thành công"))
    }
  } catch (error) {
    console.error("Update staff failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Cập nhật nhân viên thất bại"))
  }
}

function* updateStaffPasswordSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const { username, password } = action.payload
    const res = yield call(api.updateStaffPassword, username, { newPassword: password })
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      const currentPage = action.currentPage || 0
      yield put(actions.fetchStaff({ page: currentPage }))
      yield put(actions.setSuccessMessage("Cập nhật mật khẩu thành công"))
    }
  } catch (error) {
    console.error("Update password failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Cập nhật mật khẩu thất bại"))
  }
}

function* deleteStaffSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const res = yield call(api.deleteStaff, action.payload)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      const currentPage = action.currentPage || 0
      yield put(actions.fetchStaff({ page: currentPage }))
      yield put(actions.setSuccessMessage("Xóa nhân viên thành công"))
    }
  } catch (error) {
    console.error("Delete staff failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage(error?.response?.data?.message || "Xóa nhân viên thất bại"))
  }
}

export default function* staffSaga() {
  yield takeLatest(types.FETCH_STAFF, fetchStaffSaga)
  yield takeLatest(types.SEARCH_STAFF, searchStaffSaga)
  yield takeLatest(types.CREATE_STAFF, createStaffSaga)
  yield takeLatest(types.UPDATE_STAFF, updateStaffSaga)
  yield takeLatest(types.UPDATE_STAFF_PASSWORD, updateStaffPasswordSaga)
  yield takeLatest(types.DELETE_STAFF, deleteStaffSaga)
}
