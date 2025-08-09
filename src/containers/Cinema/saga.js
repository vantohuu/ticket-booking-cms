import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import * as api from '../../api/cinemaApi'; 

function* fetchCinemasSaga() {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(api.getCinemas);
    yield put(actions.setCinemas(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch cinemas failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch cinemas failed'));
  }
}

function* createCinemaSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Creating cinema with data:', action.payload);
    const res = yield call(api.createCinema, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Cinema created successfully', res.data);
      yield put(actions.fetchCinemas()); // Refresh the list after creation
      yield put(actions.setSuccessMessage('Cinema created successfully'));
    }
  } catch (error) {
    console.error('Create cinema failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Create cinema failed'));
  }
}

function* updateCinemaSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Updating cinema with data:', action.payload);
    const res = yield call(api.updateCinema, action.payload.id, {...action.payload });
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Cinema updated successfully', res.data);
      yield put(actions.fetchCinemas());
      yield put(actions.setSuccessMessage('Cinema updated successfully'));
    }
  } catch (error) {
    console.error('Update cinema failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Update cinema failed'));
  }
}

function* deleteCinemaSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Deleting cinema with ID:', action.payload);
    const res = yield call(api.deleteCinema, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Cinema deleted successfully', res.data);
      yield put(actions.fetchCinemas()); 
      yield put(actions.setSuccessMessage('Cinema deleted successfully'));
    }
  } catch (error) {
    console.error('Delete cinema failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Delete cinema failed'));
  }
}

export default function* cinemaSaga() {
  yield takeLatest(types.FETCH_CINEMAS, fetchCinemasSaga);
  yield takeLatest(types.CREATE_CINEMA, createCinemaSaga);
  yield takeLatest(types.UPDATE_CINEMA, updateCinemaSaga);
  yield takeLatest(types.DELETE_CINEMA, deleteCinemaSaga);
};
