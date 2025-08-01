import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import * as api from '../../api/reportApi';

function* fetchReportSaga(action) {
  try {
    const { reportType, fromDate, toDate } = action.payload;
    yield put(actions.setBeginLoadingStatus());
    console.log("Fetching report with params:", { reportType, fromDate, toDate });
    const response = yield call(api.getReport, reportType, { fromDate, toDate });
    const result = response?.data;
    
    yield put(actions.setReport(result));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch report failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch report failed'));
  }
}

export default function* reportSaga() {
  yield takeLatest(types.FETCH_REPORT, fetchReportSaga);
}
