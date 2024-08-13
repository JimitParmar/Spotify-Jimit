// components/LoadingList.js
import React from 'react';

const LoadingList = () => (
  <div className="md:space-y-7 space-y-7 pl-2 pt-7 md:pl-2 md:pt-16">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex items-center  space-x-4 animate-pulse">
        <div className="w-11 h-11 md:bg-gray-800 bg-gray-300  rounded-full"></div>
        <div className="flex-1 ">
          <div className="h-4 md:bg-gray-800 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 md:bg-gray-800 bg-gray-300  rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingList;
