export const selectCinemas = (state) => state.showtime.cinemas
export const selectMovies = (state) => state.showtime.movies
export const selectRooms = (state) => state.showtime.rooms
export const selectShowtimes = (state) => state.showtime.showtimes
export const selectIsShowEditModal = (state) =>
  state.showtime && state.showtime.showEditModal ? state.showtime.showEditModal : false
export const selectIsLoading = (state) => state.showtime.loading
export const selectFailedMessage = (state) => state.showtime.failedMessage
export const selectSuccessMessage = (state) => state.showtime.successMessage
export const selectPagination = (state) => state.showtime.pagination
