import { call, put, takeLatest } from "redux-saga/effects"
import * as types from "./constants"
import * as actions from "./actions"
import * as api from "../../api/userApi"

function* fetchProfileSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const res = yield call(api.fetchUserProfile, action.payload)
    yield put(actions.setProfile(res.data && res.data.result ? res.data.result : {}))
    yield put(actions.setEndLoadingStatus())
  } catch (error) {
    console.error("Fetch profile failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Lấy thông tin thất bại"))
  }
}

function* updateProfileSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const res = yield call(api.updateUserProfile, action.payload)
    yield put(actions.setProfile(res.data && res.data.result ? res.data.result : {}))
    yield put(actions.setSuccessMessage("Cập nhật thông tin thành công"))
    yield put(actions.showEndEditModal())
    yield put(actions.setEndLoadingStatus())
  } catch (error) {
    console.error("Update profile failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Cập nhật thông tin thất bại"))
  }
}

export default function* profileSaga() {
  yield takeLatest(types.FETCH_PROFILE, fetchProfileSaga)
  yield takeLatest(types.UPDATE_PROFILE, updateProfileSaga)
}
