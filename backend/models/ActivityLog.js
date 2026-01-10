import { Schema, model } from 'mongoose';

const activityLogSchema = new Schema({
  action: { type: String, required: true }, // 'endorse', 'deendorse', 'default'
  endorser: { type: String },
  endorsed: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }
});

export default model('ActivityLog', activityLogSchema);