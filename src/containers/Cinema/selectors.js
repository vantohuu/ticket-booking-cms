export const selectCinemas = (state) => state.cinema.cinemas;
export const selectIsShowEditModal = (state) =>  state.cinema && state.cinema.showEditModal ? state.cinema.showEditModal : false;
export const selectIsLoading = (state) => state.cinema.loading;
export const selectFailedMessage = (state) => state.cinema.failedMessage;
export const selectSuccessMessage = (state) => state.cinema.successMessage;