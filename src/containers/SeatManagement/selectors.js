export const selectSeats = (state) => state.seatManagement.seats;
export const selectBookedTickets = (state) => state.seatManagement.bookedTickets;
export const selectAvaiableSeats = (state) => state.seatManagement.avaiableSeats;
export const selectIsShowEditModal = (state) =>  state.seatManagement && state.seatManagement.showEditModal ? state.seatManagement.showEditModal : false;
export const selectIsLoading = (state) => state.seatManagement.loading;
export const selectFailedMessage = (state) => state.seatManagement.failedMessage;
export const selectSuccessMessage = (state) => state.seatManagement.successMessage;