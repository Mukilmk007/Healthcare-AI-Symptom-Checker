import React, { useState } from "react";
import axios from "axios";

export default function SymptomChecker({ onSave }) {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e?.preventDefault();
    setError("");
    if (!symptoms.trim()) {
      setError("Please enter your symptoms.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/symptom-check", { symptoms });
      setResponse(res.data);
      // parent update
      onSave?.(res.data);
      setSymptoms("");
    } catch (err) {
      console.error(err);
      setError("Server error — try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
      {/* Vibrant tagline directly above the input */}
      <h1 className="text-2xl font-extrabold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400">
        💬 Enter your symptoms and get the best possible health insights
      </h1>

      <form onSubmit={submit} className="space-y-4">
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          placeholder="Type symptoms (e.g., fever, sore throat, cough)..."
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none text-gray-700"
        />

        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-2xl shadow hover:bg-indigo-700 transition flex items-center gap-2"
          >
            {loading ? "Analyzing..." : "Check Symptoms"}
          </button>

          <button
            type="button"
            onClick={() => {
              setSymptoms("");
              setResponse(null);
              setError("");
            }}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded"
          >
            Clear
          </button>
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {response && (
        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <h3 className="font-semibold text-indigo-700">Diagnosis</h3>
          <p className="text-gray-700 mt-1">{response.diagnosis}</p>

          <h3 className="font-semibold text-indigo-700 mt-3">Advice</h3>
          <p className="text-gray-700 mt-1">{response.advice}</p>

          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <span><strong>Severity:</strong> {response.severity}</span>
            <span>
              <strong>Emergency:</strong>{" "}
              {response.emergency ? <span className="text-red-600">Yes</span> : <span className="text-green-600">No</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}