import React from "react";

const SkeletonLoader = () => {
  return (
    <>
      <div role="status" class="animate-pulse space-y-4 max-w-3xl">
        <div class="h-6 bg-gradient-to-r from-[#1e3a5f]/20 to-[#1e3a5f]/10 rounded-md w-1/2"></div>
        <div class="space-y-2">
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-11/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-10/12"></div>
          <div class="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-9/12"></div>
        </div>
        <div class="bg-[#1e3a5f]/5 rounded-lg p-4 space-y-2 border border-[#1e3a5f]/10">
          <div class="h-2.5 bg-[#1e3a5f]/20 rounded w-3/4"></div>
          <div class="h-2.5 bg-[#1e3a5f]/20 rounded w-2/3"></div>
          <div class="h-2.5 bg-[#1e3a5f]/20 rounded w-1/2"></div>
        </div>
      </div>

      <div role="status" class="animate-pulse space-y-4 max-w-3xl mt-10">
        <div class="h-4 bg-gradient-to-r from-[#1e3a5f]/15 to-[#1e3a5f]/5 rounded-md w-1/2"></div>

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

        <div class="bg-[#1e3a5f]/5 rounded-lg p-4 space-y-2 border border-[#1e3a5f]/10">
          <div class="h-2.5 bg-[#1e3a5f]/20 rounded w-3/4"></div>
          <div class="h-2.5 bg-[#1e3a5f]/20 rounded w-2/3"></div>
        </div>

        <div class="h-4 bg-gradient-to-r from-[#1e3a5f]/15 to-[#1e3a5f]/5 rounded-md w-1/2 mt-8"></div>

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
