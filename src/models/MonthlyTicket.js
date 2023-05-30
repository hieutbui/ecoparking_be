import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const MonthlyTicket = mongoose.model(
  'MonthlyTicket',
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
      startDate: { type: schemaTypes.Date, required: true },
      endDate: { type: schemaTypes.Date, required: true },
    },
    {
      timestamps: true,
    }
  )
);

export default MonthlyTicket;
