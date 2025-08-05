import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import * as api from '../../api/showtimeApi'; 
import * as cinemaApi from '../../api/cinemaApi'; 
import * as roomApi from '../../api/roomApi'; 
import * as movieApi from '../../api/movieApi'; 


function* fetchCinemasSaga() {
  try {
    const res = yield call(cinemaApi.getCinemas);
    yield put(actions.setCinemas(res.data && res.data.result.content ? res.data.result.content : []));
  } catch (error) {
    console.error('Fetch cinemas failed', error);
    yield put(actions.setFailedMessage('Fetch cinemas failed'));
  }
}


function* fetchRoomsByCinemaSaga(action) {
  try {
    const res = yield call(roomApi.getRoomsByCinema,action.payload);
    console.log("res.data.result", res.data.result);
    yield put(actions.setRooms(res.data && res.data.result ? res.data.result : []));
  } catch (error) {
    console.error('Fetch rooms by cinema failed', error);
    yield put(actions.setFailedMessage('Fetch rooms by cinema failed'));
  }
}

function* fetchMoviesSaga() {
  try {
    const res = yield call(movieApi.getMovies);
    yield put(actions.setMovies(res.data && res.data.result.content ? res.data.result.content : []));
  } catch (error) {
    console.error('Fetch movies failed', error);
    yield put(actions.setFailedMessage('Fetch movies failed'));
  }
}

function* fetchShowtimesSaga() {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(api.getShowtimes);
    yield put(actions.setShowtimes(res.data && res.data.result.content ? res.data.result.content : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch showtimes failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch showtimes failed'));
  }
}


function* createShowtimeSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Creating showime with data:', action.payload);
    const res = yield call(api.createShowtime, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Showtime created successfully', res.data);
      yield put(actions.fetchShowtimes()); // Refresh the list after creation
      yield put(actions.setSuccessMessage('Showtime created successfully'));
    }
  } catch (error) {
    console.error('Create showtime failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Create showtime failed'));
  }
}

function* updateShowtimeSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Updating showtime with data:', action.payload);
    const res = yield call(api.updateShowtime, action.payload.id, {...action.payload });
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Showtime updated successfully', res.data);
      yield put(actions.fetchShowtimes());
      yield put(actions.setSuccessMessage('Showime updated successfully'));
    }
  } catch (error) {
    console.error('Update showtime failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Update showtime failed'));
  }
}

function* deleteShowtimeSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Deleting showtime with ID:', action.payload);
    const res = yield call(api.deleteShowtime, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Showtime deleted successfully', res.data);
      yield put(actions.fetchShowtimes()); 
      yield put(actions.setSuccessMessage('Showtime deleted successfully'));
    }
  } catch (error) {
    console.error('Delete showtime failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Delete showtime failed'));
  }
}

export default function* showtimeSaga() {
  yield takeLatest(types.FETCH_CINEMAS, fetchCinemasSaga);
  yield takeLatest(types.FETCH_ROOMS_BY_CINEMA, fetchRoomsByCinemaSaga);
  yield takeLatest(types.FETCH_MOVIES, fetchMoviesSaga);
  yield takeLatest(types.FETCH_SHOWTIMES, fetchShowtimesSaga);
  yield takeLatest(types.CREATE_SHOWTIME, createShowtimeSaga);
  yield takeLatest(types.UPDATE_SHOWTIME, updateShowtimeSaga);
  yield takeLatest(types.DELETE_SHOWTIME, deleteShowtimeSaga);
  
};
