import React from "react";

const SkeletonLoader = () => {
  return (
    <>
      <div role="status" class="animate-pulse space-y-4 max-w-3xl">
        <div class="h-6 bg-gradient-to-r from-orange-100 to-orange-50 rounded-md w-1/2"></div>
        <div class="space-y-2">
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-11/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-10/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-9/12"></div>
        </div>
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 space-y-2 border border-orange-100">
          <div class="h-2.5 bg-orange-200/60 rounded w-3/4"></div>
          <div class="h-2.5 bg-orange-200/60 rounded w-2/3"></div>
          <div class="h-2.5 bg-orange-200/60 rounded w-1/2"></div>
        </div>
      </div>

      <div role="status" class="animate-pulse space-y-4 max-w-3xl mt-10">
        <div class="h-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-md w-1/2"></div>

        <div class="space-y-2">
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-11/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-10/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-9/12"></div>
        </div>

        <div class="space-y-2">
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-11/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-10/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-9/12"></div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 space-y-2 border border-blue-100">
          <div class="h-2.5 bg-blue-200/60 rounded w-3/4"></div>
          <div class="h-2.5 bg-blue-200/60 rounded w-2/3"></div>
        </div>

        <div class="h-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-md w-1/2 mt-8"></div>

        <div class="space-y-2">
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-11/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-10/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-9/12"></div>
        </div>
      </div>
    </>
  );
};

export default SkeletonLoader;
