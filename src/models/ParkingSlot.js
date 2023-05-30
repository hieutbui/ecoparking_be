import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const ParkingSlot = mongoose.model(
  'ParkingSlot',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      parking: { type: schemaTypes.ObjectId, ref: 'Parking', required: true },
      isAvailable: { type: schemaTypes.Boolean, required: true },
    },
    {
      timestamps: true,
    }
  )
);

export default ParkingSlot;
