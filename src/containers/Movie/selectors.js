export const selectMovies = (state) => state.movie.movies || [];
export const selectActors = (state) => state.movie.actors || [];
export const selectGenres = (state) => state.movie.genres || [];
export const selectIsShowEditModal = (state) =>  state.movie && state.movie.showEditModal ? state.movie.showEditModal : false;
export const selectIsLoading = (state) => state.movie.loading || false;
export const selectFailedMessage = (state) => state.movie.failedMessage || null;
export const selectSuccessMessage = (state) => state.movie.successMessage || null;