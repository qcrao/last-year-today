import React, { useEffect, useState } from "react";

const LastYearToday: React.FC = () => {
  const [today] = useState(new Date());

  useEffect(() => {
    console.log("LastYearToday component mounted");
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Last Year Today</h2>
      <div className="bg-blue-50 p-4 rounded">
        <div>Today: {today.toLocaleDateString()}</div>
        <div className="mt-2">Testing content</div>
      </div>
    </div>
  );
};

export default LastYearToday;
