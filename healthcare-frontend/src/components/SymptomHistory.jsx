import React, { useEffect, useState } from "react";

const SymptomHistory = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="w-64 bg-white p-4 shadow-lg h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">🗂️ Symptom History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No history yet</p>
      ) : (
        history.map((item, index) => (
          <div key={index} className="border p-2 rounded mb-2 hover:bg-gray-50">
            <p><strong>Symptoms:</strong> {item.symptoms}</p>
            <p><strong>Diagnosis:</strong> {item.diagnosis}</p>
            <p><strong>Advice:</strong> {item.advice}</p>
            <p className="text-sm text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SymptomHistory;