export const selectRooms = (state) => state.room.rooms;
export const selectCinemas = (state) => state.room.cinemas || [];
export const selectIsShowEditModal = (state) =>  state.room && state.room.showEditModal ? state.room.showEditModal : false;
export const selectIsLoading = (state) => state.room.loading;
export const selectFailedMessage = (state) => state.room.failedMessage;
export const selectSuccessMessage = (state) => state.room.successMessage;