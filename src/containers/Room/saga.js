import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import * as api from '../../api/roomApi'; 
import * as cinemaApi from '../../api/cinemaApi';

function* fetchRoomsSaga() {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(api.getRooms);
    yield put(actions.setRooms(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch rooms failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch rooms failed'));
  }
}

function* fetchCinemasSaga() {
  try {
    const res = yield call(cinemaApi.getCinemas);
    yield put(actions.setCinemas(res.data && res.data.result.content ? res.data.result.content : []));
  } catch (error) {
    console.error('Fetch cinemas failed', error);
    yield put(actions.setFailedMessage('Fetch cinemas failed'));
  }
}

function* createRoomSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Creating room with data:', action.payload);
    const res = yield call(api.createRoom, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Room created successfully', res.data);
      yield put(actions.fetchRooms()); // Refresh the list after creation
      yield put(actions.setSuccessMessage('Room created successfully'));
    }
  } catch (error) {
    console.error('Create room failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Create room failed'));
  }
}

function* updateRoomSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Updating room with data:', action.payload);
    const res = yield call(api.updateRoom, action.payload.id, {...action.payload });
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Room updated successfully', res.data);
      yield put(actions.fetchRooms());
      yield put(actions.setSuccessMessage('Room updated successfully'));
    }
  } catch (error) {
    console.error('Update room failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Update room failed'));
  }
}

function* deleteRoomSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Deleting room with ID:', action.payload);
    const res = yield call(api.deleteRoom, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Room deleted successfully', res.data);
      yield put(actions.fetchRooms());
      yield put(actions.setSuccessMessage('Room deleted successfully'));
    }
  } catch (error) {
    console.error('Delete room failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Delete room failed'));
  }
}

export default function* roomSaga() {
  yield takeLatest(types.FETCH_ROOMS, fetchRoomsSaga);
  yield takeLatest(types.FETCH_CINEMAS, fetchCinemasSaga);
  yield takeLatest(types.CREATE_ROOM, createRoomSaga);
  yield takeLatest(types.UPDATE_ROOM, updateRoomSaga);
  yield takeLatest(types.DELETE_ROOM, deleteRoomSaga);
};
