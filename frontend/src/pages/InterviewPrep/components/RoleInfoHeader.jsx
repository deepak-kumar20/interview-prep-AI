import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/20 relative border-b border-orange-100/50">
      <div className="container mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="h-[220px] flex flex-col justify-center relative z-10">
          <div className="flex items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {role}
                  </h2>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    {topicsToFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <div className="text-[11px] font-semibold text-orange-700 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-1.5 rounded-full border border-orange-200 shadow-sm">
              Experience: {experience} {experience === 1 ? "Year" : "Years"}
            </div>

            <div className="text-[11px] font-semibold text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-1.5 rounded-full border border-blue-200 shadow-sm">
              {questions} Q&A
            </div>

            <div className="text-[11px] font-semibold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 rounded-full border border-purple-200 shadow-sm">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>

        <div className="w-[40vw] md:w-[30vw] h-[200px] flex items-center justify-center bg-white overflow-hidden absolute top-0 right-0">
          <div className="w-16 h-16 bg-lime-400 blur-[65px] animate-blob1" />
          <div className="w-16 h-16 bg-teal-400 blur-[65px] animate-blob2" />
          <div className="w-16 h-16 bg-cyan-300 blur-[45px] animate-blob3" />
          <div className="w-16 h-16 bg-fuchsia-200 blur-[45px] animate-blob1" />
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
