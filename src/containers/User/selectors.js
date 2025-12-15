export const selectUsers = (state) => state.user.users
export const selectPagination = (state) => state.user.pagination
export const selectIsLoading = (state) => state.user.loading
export const selectIsSearching = (state) => state.user.isSearching
export const selectIsShowEditModal = (state) => state.user.showEditModal
export const selectIsShowPasswordModal = (state) => state.user.showPasswordModal
export const selectSuccessMessage = (state) => state.user.successMessage
export const selectFailedMessage = (state) => state.user.failedMessage
