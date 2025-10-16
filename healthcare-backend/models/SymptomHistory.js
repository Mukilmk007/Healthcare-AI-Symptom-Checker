import mongoose from "mongoose";

const symptomHistorySchema = new mongoose.Schema({
  symptoms: { type: String, required: true },
  diagnosis: { type: String },
  advice: { type: String },
  severity: { type: String },
  emergency: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const SymptomHistory = mongoose.model("SymptomHistory", symptomHistorySchema);
export default SymptomHistory;