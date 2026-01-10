import { Schema, model } from 'mongoose';

const memberSchema = new Schema({
  name: { type: String, required: true, unique: true },
  endorsedBy: { type: String, default: null },
  endorses: [{ type: String }],
  isJedi: { type: Boolean, default: false },
  tier: { type: String, enum: ['gold', 'silver', 'bronze', null], default: null },
  healthPoints: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('Member', memberSchema);