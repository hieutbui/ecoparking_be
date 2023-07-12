import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const UnitPrice = mongoose.model(
  'UnitPrice',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      dayPrice: { type: schemaTypes.Number, required: true },
      nightPrice: { type: schemaTypes.Number, required: true },
    },
    {
      timestamps: true,
    }
  )
);

export default UnitPrice;
