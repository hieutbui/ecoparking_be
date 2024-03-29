import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const TicketDetail = mongoose.model(
  'TicketDetail',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      customerId: { type: schemaTypes.ObjectId, ref: 'User', required: true },
      parkingId: { type: schemaTypes.ObjectId, ref: 'Parking', required: true },
      carNumber: { type: schemaTypes.String, required: true },
      // carType: { type: schemaTypes.String, required: true },
      special: { type: schemaTypes.String },
      startTime: {
        type: schemaTypes.Date,
      },
      endTime: {
        type: schemaTypes.Date,
      },
      status: {
        type: schemaTypes.String,
        enum: {
          values: ['paid', 'nowActive', 'completed', 'canceled'],
          message: '{VALUE} is not supported',
        },
      },
    },
    {
      timestamps: true,
    }
  )
);

export default TicketDetail;
