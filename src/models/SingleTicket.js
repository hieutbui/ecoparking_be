import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const SingleTicket = mongoose.model(
  'SingleTicket',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      ticketDetail: {
        type: schemaTypes.ObjectId,
        ref: 'TicketDetail',
        required: true,
      },
      checkedIn: { type: schemaTypes.Date, required: true },
      checkedOut: { type: schemaTypes.Date },
      parkedDate: { type: schemaTypes.Date, required: true },
      fee: { type: schemaTypes.Number, required: true },
    },
    {
      timestamps: true,
    }
  )
);

export default SingleTicket;
