export const selectProfile = (state) => state.profile.profile;
export const selectIsShowEditModal = (state) =>  state.profile && state.profile.showEditModal ? state.profile.showEditModal : false;
export const selectIsLoading = (state) => state.profile.loading;
export const selectFailedMessage = (state) => state.profile.failedMessage;
export const selectSuccessMessage = (state) => state.profile.successMessage;