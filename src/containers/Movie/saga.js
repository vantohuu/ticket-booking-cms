import { call, put, takeLatest } from "redux-saga/effects"
import * as types from "./constants"
import * as actions from "./actions"
import * as api from "../../api/movieApi"
import * as actorApi from "../../api/actorApi"
import * as genreApi from "../../api/genreApi"
import * as showtimeApi from "../../api/showtimeApi"

function* fetchMoviesSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    const { page = 0, size = 10, sort = "id,desc" } = action.payload || {}
    const res = yield call(api.getMoviesPagination, page, size, sort)

    // Handle paginated response structure
    const paginatedData = res.data && res.data.result ? res.data.result : {}
    const movies = paginatedData.content || []
    const pagination = {
      current: paginatedData.number + 1, // Backend uses 0-based, frontend uses 1-based
      pageSize: paginatedData.size,
      total: paginatedData.totalElements,
      totalPages: paginatedData.totalPages,
    }

    yield put(actions.setMovies(movies))
    yield put(actions.setPagination(pagination))
    yield put(actions.setEndLoadingStatus())
  } catch (error) {
    console.error("Fetch movies failed", error)
    yield put(actions.setEndLoadingStatus())
    yield put(actions.setFailedMessage("Fetch movies failed"))
  }
}

function* fetchActorsSaga() {
  try {
    const res = yield call(actorApi.getActors)
    yield put(actions.setActors(res.data && res.data.result ? res.data.result : []))
  } catch (error) {
    console.error("Fetch actors failed", error)
    yield put(actions.setFailedMessage("Fetch actors failed"))
  }
}

function* fetchGenresSaga() {
  try {
    const res = yield call(genreApi.getGenres)
    yield put(actions.setGenres(res.data && res.data.result ? res.data.result : []))
  } catch (error) {
    console.error("Fetch genres failed", error)
    yield put(actions.setFailedMessage("Fetch genres failed"))
  }
}

function* fetchShowtimesSaga(action) {
  try {
    const res = yield call(showtimeApi.getShowtimesByMovie, action.payload)
    yield put(actions.setShowtimes(res.data && res.data.result ? res.data.result : []))
  } catch (error) {
    console.error("Fetch showtimes failed", error)
    yield put(actions.setFailedMessage("Fetch showtimes failed"))
  }
}

function* createMovieSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    console.log("[v0] Creating movie with data:", action.payload)

    let res
    if (action.payload.posterFile) {
      const formData = new FormData()
      const posterFile = action.payload.posterFile

      console.log("[v0] Creating movie with file upload")
      console.log("[v0] File details:", posterFile.name, posterFile.type, posterFile.size)

      if (action.payload.title) formData.append("title", action.payload.title)
      if (action.payload.duration) formData.append("duration", action.payload.duration)

      if (action.payload.description) formData.append("description", action.payload.description)
      if (action.payload.language) formData.append("language", action.payload.language)
      if (action.payload.trailer) formData.append("trailer", action.payload.trailer)
      if (action.payload.releaseDate) formData.append("releaseDate", action.payload.releaseDate)

      formData.append("posterFile", posterFile, posterFile.name)

      if (action.payload.genreIds && action.payload.genreIds.length > 0) {
        action.payload.genreIds.forEach((id) => formData.append("genreIds", id))
      }
      if (action.payload.actorIds && action.payload.actorIds.length > 0) {
        action.payload.actorIds.forEach((id) => formData.append("actorIds", id))
      }

      // Debug: Log all FormData entries
      console.log("[v0] FormData entries:")
      for (const pair of formData.entries()) {
        console.log("[v0]", pair[0], ":", pair[1])
      }

      res = yield call(api.createMovieWithUpload, formData)
    } else {
      res = yield call(api.createMovie, action.payload)
    }

    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      console.log("[v0] Movie created successfully", res.data)
      yield put(actions.fetchMovies({ page: 0 }))
      yield put(actions.setSuccessMessage("Movie created successfully"))
    }
  } catch (error) {
    console.error("[v0] Create movie failed", error)
    console.error("[v0] Error response:", error?.response?.data)
    yield put(actions.setEndLoadingStatus())
    yield put(
      actions.setFailedMessage("Create movie failed: " + (error?.response?.data?.message || "An error occurred")),
    )
  }
}

function* updateMovieSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    console.log("[v0] Updating movie with data:", action.payload)

    let res
    if (action.payload.data.posterFile) {
      const formData = new FormData()
      const posterFile = action.payload.data.posterFile

      console.log("[v0] Updating movie with file upload")
      console.log("[v0] File details:", posterFile.name, posterFile.type, posterFile.size)

      if (action.payload.data.title) formData.append("title", action.payload.data.title)
      if (action.payload.data.duration) formData.append("duration", action.payload.data.duration)

      if (action.payload.data.description) formData.append("description", action.payload.data.description)
      if (action.payload.data.language) formData.append("language", action.payload.data.language)
      if (action.payload.data.trailer) formData.append("trailer", action.payload.data.trailer)
      if (action.payload.data.releaseDate) formData.append("releaseDate", action.payload.data.releaseDate)

      formData.append("posterFile", posterFile, posterFile.name)

      if (action.payload.data.genreIds && action.payload.data.genreIds.length > 0) {
        action.payload.data.genreIds.forEach((id) => formData.append("genreIds", id))
      }
      if (action.payload.data.actorIds && action.payload.data.actorIds.length > 0) {
        action.payload.data.actorIds.forEach((id) => formData.append("actorIds", id))
      }

      // Debug: Log all FormData entries
      console.log("[v0] FormData entries:")
      for (const pair of formData.entries()) {
        console.log("[v0]", pair[0], ":", pair[1])
      }

      res = yield call(api.updateMovieWithUpload, action.payload.id, formData)
    } else {
      res = yield call(api.updateMovie, action.payload.id, {
        title: action.payload.data.title,
        description: action.payload.data.description,
        duration: action.payload.data.duration,
        language: action.payload.data.language,
        trailer: action.payload.data.trailer,
        releaseDate: action.payload.data.releaseDate,
        genreIds: action.payload.data.genreIds,
        actorIds: action.payload.data.actorIds,
      })
    }

    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      console.log("[v0] Movie updated successfully", res.data)
      const currentPage = action.currentPage || 0
      yield put(actions.fetchMovies({ page: currentPage }))
      yield put(actions.setSuccessMessage("Movie updated successfully"))
    }
  } catch (error) {
    console.error("[v0] Update movie failed", error)
    console.error("[v0] Error response:", error?.response?.data)
    yield put(actions.setEndLoadingStatus())
    yield put(
      actions.setFailedMessage("Update movie failed: " + (error?.response?.data?.message || "An error occurred")),
    )
  }
}

function* deleteMovieSaga(action) {
  try {
    yield put(actions.setBeginLoadingStatus())
    console.log("Deleting movie with ID:", action.payload)
    const res = yield call(api.deleteMovie, action.payload)
    yield put(actions.setEndLoadingStatus())
    if (res.data) {
      console.log("Movie deleted successfully", res.data)
      const currentPage = action.currentPage || 0
      yield put(actions.fetchMovies({ page: currentPage }))
      yield put(actions.setSuccessMessage("Movie deleted successfully"))
    }
  } catch (error) {
    console.error("Delete movie failed", error)
    console.error("[v0] Error response:", error?.response?.data)
    yield put(actions.setEndLoadingStatus())
    yield put(
      actions.setFailedMessage("Delete movie failed: " + (error?.response?.data?.message || "An error occurred")),
    )
  }
}

export default function* movieSaga() {
  yield takeLatest(types.FETCH_MOVIES, fetchMoviesSaga)
  yield takeLatest(types.FETCH_ACTORS, fetchActorsSaga)
  yield takeLatest(types.FETCH_GENRES, fetchGenresSaga)
  yield takeLatest(types.CREATE_MOVIE, createMovieSaga)
  yield takeLatest(types.UPDATE_MOVIE, updateMovieSaga)
  yield takeLatest(types.DELETE_MOVIE, deleteMovieSaga)
  yield takeLatest(types.FETCH_SHOWTIMES, fetchShowtimesSaga)
}
