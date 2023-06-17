import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const Parking = mongoose.model(
  'Parking',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      name: { type: schemaTypes.String, required: true },
      quantity: { type: schemaTypes.Number, required: true },
      // 0: planned, 1: spontaneous
      parkType: {type: [0, 1], required: true},
    },
    {
      timestamps: true,
    }
  )
);

export default Parking;
