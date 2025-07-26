import React from 'react';

console.log("Loading component rendered");

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
      <p className="text-lg font-semibold text-blue-600">Đang tải ...</p>
    </div>
  </div>
);

export default Loading;