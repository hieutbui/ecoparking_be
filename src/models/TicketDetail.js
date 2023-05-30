import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const TicketDetail = mongoose.model(
  'TicketDetail',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      customer: { type: schemaTypes.ObjectId, ref: 'User', required: true },
      parking: { type: schemaTypes.ObjectId, ref: 'Parking', required: true },
      carNumber: { type: schemaTypes.String, required: true },
      carType: { type: schemaTypes.String, required: true },
      special: { type: schemaTypes.String },
    },
    {
      timestamps: true,
    }
  )
);

export default TicketDetail;
