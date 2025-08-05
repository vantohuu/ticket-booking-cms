import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import * as actions from './actions';
import * as api from '../../api/movieApi'; 
import * as actorApi from '../../api/actorApi'; 
import * as genreApi from '../../api/genreApi'; 


function* fetchMoviesSaga() {
  try {
    yield put(actions.setBeginLoadingStatus());
    const res = yield call(api.getMovies);
    yield put(actions.setMovies(res.data && res.data.result.content ? res.data.result.content : []));
    yield put(actions.setEndLoadingStatus());
  } catch (error) {
    console.error('Fetch movies failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Fetch movies failed'));
  }
}

function* fetchActorsSaga() {
  try {
    const res = yield call(actorApi.getActors);
    yield put(actions.setActors(res.data && res.data.result ? res.data.result : []));
  } catch (error) {
    console.error('Fetch actors failed', error);
    yield put(actions.setFailedMessage('Fetch actors failed'));
  }
}


function* fetchGenresSaga() {
  try {
    const res = yield call(genreApi.getGenres);
    yield put(actions.setGenres(res.data && res.data.result ? res.data.result : []));
  } catch (error) {
    console.error('Fetch genres failed', error);
    yield put(actions.setFailedMessage('Fetch genres failed'));
  }
}

function* createMovieSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Creating movie with data:', action.payload);
    const res = yield call(api.createMovie, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Movie created successfully', res.data);
      yield put(actions.fetchMovies()); // Refresh the list after creation
      yield put(actions.setSuccessMessage('Movie created successfully'));
    }
  } catch (error) {
    console.error('Create movie failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Create movie failed'));
  }
}

function* updateMovieSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Updating movie with data:', action.payload);
    const res = yield call(api.updateMovie, action.payload.id, {
      title: action.payload.title,
      description: action.payload.description,
      duration: action.payload.duration,
      language: action.payload.language,
      poster: action.payload.poster,
      trailer: action.payload.trailer,
      releaseDate: action.payload.releaseDate,
      endDate: action.payload.endDate,
      status: action.payload.status,
      genreIds: action.payload.genreIds,
      actorIds: action.payload.actorIds,
    });
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Movie updated successfully', res.data);
      yield put(actions.fetchMovies());
      yield put(actions.setSuccessMessage('Movie updated successfully'));
    }
  } catch (error) {
    console.error('Update movie failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Update movie failed'));
  }
}

function* deleteMovieSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus());
    console.log('Deleting movie with ID:', action.payload);
    const res = yield call(api.deleteMovie, action.payload);
    yield put(actions.setEndLoadingStatus());
    if (res.data) {
      console.log('Movie deleted successfully', res.data);
      yield put(actions.fetchMovies());
      yield put(actions.setSuccessMessage('Movie deleted successfully'));
    }
  } catch (error) {
    console.error('Delete movie failed', error);
    yield put(actions.setEndLoadingStatus());
    yield put(actions.setFailedMessage('Delete movie failed'));
  }
}

export default function* movieSaga() {
  yield takeLatest(types.FETCH_MOVIES, fetchMoviesSaga);
  yield takeLatest(types.FETCH_ACTORS, fetchActorsSaga);
  yield takeLatest(types.FETCH_GENRES, fetchGenresSaga);
  yield takeLatest(types.CREATE_MOVIE, createMovieSaga);
  yield takeLatest(types.UPDATE_MOVIE, updateMovieSaga);
  yield takeLatest(types.DELETE_MOVIE, deleteMovieSaga);
};
