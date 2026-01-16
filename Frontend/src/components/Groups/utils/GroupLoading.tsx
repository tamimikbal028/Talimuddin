import React from "react";

function GroupLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse">
      {/* ১. কভার ফটো স্কেলিটন */}
      <div className="h-48 w-full rounded-b-xl bg-gray-300 md:h-64"></div>

      {/* ২. প্রোফাইল ও হেডার সেকশন */}
      <div className="-mt-12 flex flex-col items-start gap-4 px-4 sm:flex-row sm:items-end">
        {/* প্রোফাইল পিকচার বক্স */}
        <div className="h-32 w-32 rounded-xl border-4 border-white bg-gray-300 shadow-sm"></div>

        <div className="flex-1 space-y-3 pb-2">
          {/* গ্রুপের নাম */}
          <div className="h-8 w-1/3 rounded-md bg-gray-300"></div>
          {/* মেম্বার সংখ্যা */}
          <div className="h-4 w-1/4 rounded-md bg-gray-200"></div>
        </div>
      </div>

      {/* ৩. বাটন ও ট্যাব সেকশন */}
      <div className="mt-8 flex gap-4 border-t border-b border-gray-100 px-4 py-3">
        <div className="h-10 w-28 rounded-lg bg-gray-300"></div>
        <div className="h-10 w-28 rounded-lg bg-gray-300"></div>
        <div className="h-10 w-28 rounded-lg bg-gray-300"></div>
      </div>
    </div>
  );
}

export default GroupLoading;
