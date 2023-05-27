import { ObjectId } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';

const User = mongoose.model(
  'User',
  new Schema(
    {
      id: { type: ObjectId },
      name: {
        type: String,
        required: true, //NOT NULL
        validate: {
          validator: (value) => value.length > 3,
          message: 'Username must be at least 3 characters',
        },
      },
      email: {
        type: String,
        validate: {
          validator: (value) => isEmail(value),
          message: 'Email is incorrect format',
        },
      },
      gender: {
        type: String,
        enum: {
          values: ['Male', 'Female'],
          message: '{VALUE} is not supported',
        },
        required: false,
      },
      password: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
        validate: {
          validator: (value) => value.length > 5,
          message: 'Phone number must be at least 5 characters',
        },
      },
      address: {
        type: String,
        required: true,
      },
    },
    {
      autoCreate: true,
      autoIndex: true,
    }
  )
);

export default User;
