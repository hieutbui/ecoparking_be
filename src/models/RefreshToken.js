import mongoose, { Schema } from 'mongoose';
import { schemaTypes } from '../global/constants.js';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: schemaTypes.String,
    },
    user: {
      type: schemaTypes.ObjectId,
      ref: 'User',
    },
    expiryDate: Date,
  },
  {
    timestamps: true,
  }
);

export async function createRefreshToken(user) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRARION
  );

  let _token = uuidv4();

  let _object = new RefreshToken({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log(_object);

  let refreshToken = await _object.save();

  return refreshToken.token;
}

export function verifyExpiration(token) {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
