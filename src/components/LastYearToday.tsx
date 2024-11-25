import React, { useEffect, useState } from "react";
import { getHistoricalPages } from "../utils/dateUtils";

interface HistoricalPage {
  date: string;
  uid: string;
}

const LastYearToday: React.FC = () => {
  const [historicalPages, setHistoricalPages] = useState<HistoricalPage[]>([]);

  useEffect(() => {
    const pages = getHistoricalPages();
    setHistoricalPages(pages);
  }, []);

  const openPage = (uid: string) => {
    window.roamAlphaAPI.ui.rightSidebar.addWindow({
      window: {
        type: "outline",
        "block-uid": uid,
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {historicalPages.length > 0 ? (
          historicalPages.map((page, index) => (
            <div key={index} className="mb-2">
              <button
                onClick={() => openPage(page.uid)}
                className="w-full px-3 py-2 text-left rounded hover:bg-gray-100 transition-colors duration-150 ease-in-out text-sm"
              >
                {page.date}
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No entries found for this day in previous years
          </div>
        )}
      </div>
    </div>
  );
};

export default LastYearToday;
