export const selectReport = (state) => state.report.report || [];
export const selectIsShowEditModal = (state) =>  state.report && state.report.showEditModal ? state.report.showEditModal : false;
export const selectIsLoading = (state) => state.report.loading;
export const selectFailedMessage = (state) => state.report.failedMessage;
export const selectSuccessMessage = (state) => state.report.successMessage;