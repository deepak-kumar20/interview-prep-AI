import React, { useRef, useState, useEffect } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../../pages/InterviewPrep/components/AIResponsePreview";
const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-lg mb-4 overflow-hidden py-4 px-5 shadow-lg shadow-orange-100/40 border border-orange-100/30 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 group">
        <div className="flex items-start justify-between cursor-pointer">
          <div className="flex items-start gap-3.5">
            <span className="text-xs md:text-[15px] font-semibold text-gray-400 leading-[18px] ">
              Q
            </span>

            <h3 className="text-xs md:text-[14px] font-medium text-gray-800 mr-0 md:mr-20">
              {question}
            </h3>
          </div>
          <div className="flex items-center justify-end ml-4 relative">
            <div
              className={`flex ${
                isExpanded ? "md:flex" : "md:hidden group-hover-flex "
              }`}
            >
              <button
                className="flex items-center gap-2 text-xs text-blue-700 font-medium bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 mr-2 rounded text-nowrap border border-blue-200 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 cursor-pointer"
                onClick={onTogglePin}
              >
                {isPinned ? (
                  <LuPinOff className="text-xs" />
                ) : (
                  <LuPin className="text-xs" />
                )}
              </button>

              <button
                className="flex items-center gap-2 text-xs text-orange-700 font-medium bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1 mr-2 rounded text-nowrap border border-orange-200 hover:border-orange-300 hover:from-orange-100 hover:to-amber-100 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  setIsExpanded(true);
                  onLearnMore();
                }}
              >
                <LuSparkles />
                <span className="hidden md:block">Learn More</span>
              </button>
            </div>
            <button
              className="text-gray-400 hover:text-gray-500 cursor-pointer"
              onClick={toggleExpand}
            >
              <LuChevronDown
                size={20}
                className={`transform transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div
            ref={contentRef}
            className="mt-4 text-gray-700 bg-gradient-to-br from-orange-50/50 to-amber-50/30 px-6 py-4 rounded-xl border border-orange-100/50"
          >
            <AIResponsePreview content={answer} />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
