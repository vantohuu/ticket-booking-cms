import { combineReducers } from 'redux';
import movieReducer from '../containers/Movie/reducer';
import cinemaReducer from '../containers/Cinema/reducer';
import roomReducer from '../containers/Room/reducer';
import seatReducer from '../containers/SeatMap/reducer';
import showtimeReducer from '../containers/Showtime/reducer';
import seatManagementReducer from '../containers/SeatManagement/reducer';
import profileReducer from '../containers/Profile/reducer';
import reportReducer from '../containers/Report/reducer';

const rootReducer = combineReducers({
  movie: movieReducer,
  cinema: cinemaReducer,
  room: roomReducer,
  seat: seatReducer,
  showtime: showtimeReducer,
  seatManagement: seatManagementReducer,
  profile: profileReducer,
  report: reportReducer
});

export default rootReducer;
