import React, { useState, useEffect } from "react";
import SymptomChecker from "./components/SymptomChecker.jsx";
import axios from "axios";
import { Trash2, X } from "lucide-react";

export default function App() {
  const [history, setHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  // Fetch existing history
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/history");
      setHistory(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSave = (newEntry) => {
    setHistory((prev) => [newEntry, ...prev]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/history/${id}`);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-indigo-600 text-white py-3 px-6 text-center font-bold text-xl shadow-sm">
        HEALTHCARE SYMPTOM CHECKER
      </header>

      <div className="flex flex-1 relative">
        {/* Main Section */}
        <div className="flex-1 p-8 flex justify-center items-start">
          <div className="w-full max-w-2xl">
            <SymptomChecker onSave={handleSave} />
          </div>
        </div>

        {/* Floating Show History Button */}
              {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed top-20 right-6 bg-indigo-600 text-white py-3 px-5 rounded-full shadow-xl hover:bg-indigo-700 transition z-30"
        >
          🗂️ Chat History
        </button>
      )}  

        {/* Sidebar (Right Side) */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-0 z-40 transform transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="sticky top-0 bg-white z-20 border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">🩺 Symptom History</h2>
              <span className="text-xs text-gray-500">({history.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchHistory}
                className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
                title="Refresh"
              >
                ⟳
              </button>
              <button
                onClick={() => setShowSidebar(false)}
                className="text-gray-500 hover:text-gray-800 p-1 rounded"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="p-4 overflow-y-auto h-[calc(100vh-68px)] space-y-3">
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No history yet.</p>
            ) : (
              history.map((item) => (
                <div
                  key={item._id}
                  className="border p-3 rounded-lg bg-gray-50 flex gap-3 items-start"
                >
                  <div className="flex-1">
                    <p className="text-sm">
                      <strong>Symptoms:</strong> {item.symptoms}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Diagnosis:</strong> {item.diagnosis}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ⚠️ Caution Dialog — Fixed at bottom center */}
       <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-400 text-yellow-800 text-center py-3 shadow-md text-sm">
        ⚠️ This tool is for educational purposes only and is not a substitute
        for professional medical advice.
      </div>
    </div>
  );
}