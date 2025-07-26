import { all, fork } from 'redux-saga/effects';
import movieSaga from '../containers/Movie/saga';
import cinemaSaga from '../containers/Cinema/saga';
import roomSaga from '../containers/Room/saga';
import seatSaga from '../containers/SeatMap/saga'; 
import showtimeSaga from '../containers/Showtime/saga'; 
import seatManagementSaga from '../containers/SeatManagement/saga';

export default function* rootSaga() {
  yield all([
    fork(movieSaga),
    fork(cinemaSaga),
    fork(roomSaga),
    fork(seatSaga),
    fork(showtimeSaga),
    fork(seatManagementSaga),
  ]);
}
