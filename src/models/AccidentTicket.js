import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const AccidentTicket = mongoose.model(
  'AccidentTicket',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      ticketDetail: {
        type: schemaTypes.ObjectId,
        ref: 'TicketDetail',
        required: true,
      },
      employee: { type: schemaTypes.ObjectId, ref: 'User', required: true },
      name: { type: schemaTypes.String, required: true },
      cost: { type: schemaTypes.Decimal128 },
      startTime: { type: schemaTypes.Date, required: true },
      endTime: { type: schemaTypes.Date, required: true },
      description: { type: schemaTypes.String },
    },
    {
      timestamps: true,
    }
  )
);

export default AccidentTicket;
