import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const UnitPrice = mongoose.model(
  'UnitPrice',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      stateTime: { type: schemaTypes.Date, required: true },
      endTime: { type: schemaTypes.Date, required: true },
      price: { type: schemaTypes.Decimal128, required: true },
    },
    {
      timestamps: true,
    }
  )
);

export default UnitPrice;
