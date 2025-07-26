import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import * as api from '../../api/seatApi'; 

function* fetchSeatsByRoomSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(api.getSeatsByRoom, action.payload);
    yield put(actions.setSeats(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch seats by room failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch seats by room failed'));
  }
}

export default function* seatSaga() {
  yield takeLatest(types.FETCH_SEATS_BY_ROOM, fetchSeatsByRoomSaga);
};
