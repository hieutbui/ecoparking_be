import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';

const Parking = mongoose.model(
  'Parking',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      name: { type: schemaTypes.String, required: true },
      address: { type: schemaTypes.String, required: true },
      quantity: { type: schemaTypes.Number, required: true },
      image: { type: schemaTypes.String },
      longitude: { type: schemaTypes.Decimal128, required: true },
      latitude: { type: schemaTypes.Decimal128, required: true },
      available: {
        type: schemaTypes.Number,
        required: function () {
          return this.parkType === 0;
        },
      },
      // 0: planned, 1: spontaneous
      parkType: {
        type: schemaTypes.Number,
        enum: {
          values: [0, 1],
          message: '{VALUE} is not supported',
        },
        required: true,
      },
      // unitPrice: {
      //   type: schemaTypes.ObjectId,
      //   ref: 'UnitPrice',
      //   required: function () {
      //     return this.parkType === 0;
      //   },
      // },  
    },
    {
      timestamps: true,
    }
  )
);

export default Parking;
