import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import * as seatApi from '../../api/seatApi'; 
import * as showtimeApi from '../../api/showtimeApi'; 
import * as cinemaApi from '../../api/cinemaApi';
import * as roomApi from '../../api/roomApi';

function* fetchCinemasSaga(action) {
  try {
    const res = yield call(cinemaApi.getCinemas);
    yield put(actions.setCinemas(res.data && res.data.result ? res.data.result : []));
  } catch (error) {
    console.error('Fetch cinemas failed', error);
    yield put(actions.setFailedMessage('Fetch cinemas failed'));
  }
}

function* fetchRoomsByCinemaSaga(action) {
  try {
    const res = yield call(roomApi.getRoomsByCinema, action.payload); 
    yield put(actions.setRooms(res.data && res.data.result ? res.data.result : []));
  } catch (error) {
    console.error('Fetch rooms by cinema failed', error);
    yield put(actions.setFailedMessage('Fetch rooms by cinema failed'));
  }
}


function* fetchShowtimeByDateAndRoomSaga(action) {
  try {
    console.log("Fetching showtimes for date and room:", action.payload);
    const res = yield call(showtimeApi.getShowtimesByDateAndRoom, action.payload);
    yield put(actions.setShowtimes(res.data && res.data.result ? res.data.result : []));
  } catch (error) {
    console.error('Fetch showtimes by date and room failed', error);
    yield put(actions.setFailedMessage('Fetch showtimes by date and room failed'));
  }
}


function* fetchSeatsByRoomSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(seatApi.getSeatsByRoom, action.payload);
    yield put(actions.setSeats(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch seats by room failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch seats by room failed'));
  }
}


function* fetchBookedTicketsSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(showtimeApi.getBookedTickets, action.payload);
    yield put(actions.setTickets(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch booked tickets failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setTickets([]));
    yield put(actions.setFailedMessage('Fetch booked tickets failed'));
  }
}

function* fetchInvoiceSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(showtimeApi.getBookedTickets, action.payload);
    yield put(actions.setInvoice(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch booked tickets failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch booked tickets failed'));
  }
}

function* fetchShowTimeSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(showtimeApi.getShowtimeById, action.payload);
    yield put(actions.setShowtime(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch showtime failed', error);
    yield put(actions.setShowtime(null));
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch showtime failed'));
  }
}


function* fetchAvailabeSeatsByShowtimeSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(showtimeApi.getAvailableSeats, action.payload);
    yield put(actions.setAvaiableSeats(res.data && res.data.result ? res.data.result : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch available seats by showtime failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch available seats by showtime failed'));
  }
}

export default function* seatManagementSaga() {
  yield takeLatest(types.FETCH_SEATS_BY_ROOM, fetchSeatsByRoomSaga);
  yield takeLatest(types.FETCH_BOOKED_TICKETS, fetchBookedTicketsSaga);
  yield takeLatest(types.FETCH_INVOICE, fetchInvoiceSaga);
  yield takeLatest(types.FETCH_SHOWTIME_BY_ID, fetchShowTimeSaga);
  yield takeLatest(types.FETCH_AVAIABLE_SEATS_BY_SHOWTIME, fetchAvailabeSeatsByShowtimeSaga);
  yield takeLatest(types.FETCH_CINEMAS, fetchCinemasSaga);
  yield takeLatest(types.FETCH_ROOMS_BY_CINEMA, fetchRoomsByCinemaSaga);
  yield takeLatest(types.FETCH_SHOWTIMES, fetchShowtimeByDateAndRoomSaga);
};
