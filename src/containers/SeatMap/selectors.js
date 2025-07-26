export const selectSeats = (state) => state.seat.seats;
export const selectIsShowEditModal = (state) =>  state.seat && state.seat.showEditModal ? state.seat.showEditModal : false;
export const selectIsLoading = (state) => state.seat.loading;
export const selectFailedMessage = (state) => state.seat.failedMessage;
export const selectSuccessMessage = (state) => state.seat.successMessage;