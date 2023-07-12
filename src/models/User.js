import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import { schemaTypes } from '../global/constants.js';

const User = mongoose.model(
  'User',
  new Schema(
    {
      id: { type: schemaTypes.ObjectId },
      name: {
        type: schemaTypes.String,
        required: true, //NOT NULL
        validate: {
          validator: (value) => value.length > 3,
          message: 'Username must be at least 3 characters',
        },
      },
      avatar: {
        type: schemaTypes.String,
        required: false,
      },
      email: {
        type: schemaTypes.String,
        validate: {
          validator: (value) => isEmail(value),
          message: 'Email is incorrect format',
        },
      },
      gender: {
        type: schemaTypes.String,
        enum: {
          values: ['Male', 'Female', 'Other'],
          message: '{VALUE} is not supported',
        },
        required: false,
      },
      password: {
        type: schemaTypes.String,
        required: true,
      },
      phoneNumber: {
        type: schemaTypes.String,
        required: true,
        validate: {
          validator: (value) => value.length > 5,
          message: 'Phone number must be at least 5 characters',
        },
      },
      address: {
        type: schemaTypes.String,
        required: true,
      },
      // 0: Admin, 1: Employee, 2: Customer
      role: {
        type: schemaTypes.Number,
        enum: {
          values: [0, 1, 2],
          message: '{VALUE} is not supported',
        },
        message: 'Role is not supported',
        required: true,
      },
      workingTime: {
        type: schemaTypes.String,
        required: function () {
          return this.role === 1;
        },
      },
      saveParkings: [
        {
          type: schemaTypes.ObjectId,
          ref: 'Parking',
        },
      ],
      tickets: [
        {
          type: schemaTypes.ObjectId,
          ref: 'SingleTicket',
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

export default User;
