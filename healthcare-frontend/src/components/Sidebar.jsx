import React from "react";

const Sidebar = ({ history }) => {
  return (
    <div className="w-72 bg-gray-900 text-white h-screen p-6 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">🩺 Your History</h2>
      <div className="flex-1 overflow-y-auto space-y-3">
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">No history yet...</p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <p className="text-sm font-medium">
                {new Date(item.date).toLocaleString()}
              </p>
              <p className="text-xs text-gray-300 mt-1 truncate">
                {item.symptoms}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;