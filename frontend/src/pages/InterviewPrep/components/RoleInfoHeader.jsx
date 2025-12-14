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
    <div className="bg-white relative border-b border-gray-100">
      <div className="container mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="h-[220px] flex flex-col justify-center relative z-10">
          <div className="flex items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-[#1e3a5f]">
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
            <div className="text-[11px] font-semibold text-[#1e3a5f] bg-[#1e3a5f]/10 px-4 py-1.5 rounded-full border border-[#1e3a5f]/20 shadow-sm">
              Experience: {experience} {experience === 1 ? "Year" : "Years"}
            </div>

            <div className="text-[11px] font-semibold text-[#1e3a5f] bg-[#1e3a5f]/10 px-4 py-1.5 rounded-full border border-[#1e3a5f]/20 shadow-sm">
              {questions} Q&A
            </div>

            <div className="text-[11px] font-semibold text-[#1e3a5f] bg-[#1e3a5f]/10 px-4 py-1.5 rounded-full border border-[#1e3a5f]/20 shadow-sm">
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
