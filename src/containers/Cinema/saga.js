import { call, put, takeLatest } from "redux-saga/effects"
import * as types from "./constants"
import * as actions from "./actions"
import * as api from "../../api/cinemaApi"

function* fetchCinemasSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const { page = 0, size = 10, sort = "id,desc" } = action.payload || {}
    const res = yield call(api.getCinemasPagination, page, size, sort)

    // Handle paginated response structure
    const paginatedData = res.data && res.data.result ? res.data.result : {}
    const cinemas = paginatedData.content || []
    const pagination = {
      current: paginatedData.number + 1, // Backend uses 0-based, frontend uses 1-based
      pageSize: paginatedData.size,
      total: paginatedData.totalElements,
      totalPages: paginatedData.totalPages,
    }

    yield put(actions.setCinemas(cinemas))
    yield put(actions.setPagination(pagination))
    yield put(actions.setEndLoadingStatus())
  } catch (error) {
    console.error("Fetch cinemas failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Fetch cinemas failed"))
  }
}

function* createCinemaSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    console.log("Creating cinema with data:", action.payload)
    const res = yield call(api.createCinema, action.payload)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      console.log("Cinema created successfully", res.data)
      yield put(actions.fetchCinemas({ page: 0 })) // Go to first page after creation
      yield put(actions.setSuccessMessage("Cinema created successfully"))
    }
  } catch (error) {
    console.error("Create cinema failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Create cinema failed"))
  }
}

function* updateCinemaSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    console.log("Updating cinema with data:", action.payload)
    const res = yield call(api.updateCinema, action.payload.id, { ...action.payload })
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      console.log("Cinema updated successfully", res.data)
      const currentPage = action.currentPage || 0
      yield put(actions.fetchCinemas({ page: currentPage }))
      yield put(actions.setSuccessMessage("Cinema updated successfully"))
    }
  } catch (error) {
    console.error("Update cinema failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Update cinema failed"))
  }
}

function* deleteCinemaSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    console.log("Deleting cinema with ID:", action.payload)
    const res = yield call(api.deleteCinema, action.payload)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      console.log("Cinema deleted successfully", res.data)
      const currentPage = action.currentPage || 0
      yield put(actions.fetchCinemas({ page: currentPage }))
      yield put(actions.setSuccessMessage("Cinema deleted successfully"))
    }
  } catch (error) {
    console.error("Delete cinema failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Delete cinema failed"))
  }
}

export default function* cinemaSaga() {
  yield takeLatest(types.FETCH_CINEMAS, fetchCinemasSaga)
  yield takeLatest(types.CREATE_CINEMA, createCinemaSaga)
  yield takeLatest(types.UPDATE_CINEMA, updateCinemaSaga)
  yield takeLatest(types.DELETE_CINEMA, deleteCinemaSaga)
}
