import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { print, OutputType } from '../helpers/print.js';
import models from '../models/index.js';
import Exception from '../exceptions/Exception.js';
import upload from '../helpers/upload.js';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import {
  createRefreshToken,
  verifyExpiration,
} from '../models/RefreshToken.js';

const storage = getStorage();

const updateProfile = async ({
  id,
  name,
  avatar,
  email,
  gender,
  phoneNumber,
  address,
  role,
  workingTime,
}) => {
  const user = await models.User.findById(id);
  if (user) {
    user.name = name ?? user.name;
    if (avatar) {
      if (user.avatar) {
        const imageRef = ref(storage, user.avatar);
        await deleteObject(imageRef);
      }
      const { originalname, mimetype, buffer } = avatar;
      const uploadImage = await upload.image({
        originalname: originalname,
        mimetype: mimetype,
        buffer: buffer,
        email: user.email,
      });
      user.avatar = uploadImage.downloadURL;
    }
    user.email = email;
    user.gender = gender ?? user.gender;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;
    user.address = address ?? user.address;
    user.role = role ?? user.role;
    user.workingTime = workingTime ?? user.workingTime;
    await user.save();
    return {
      ...user._doc,
      password: 'not show',
    };
  } else {
    throw new Exception(Exception.USER_NOT_EXISTED);
  }
};

const login = async ({ email, password }) => {
  let existingUser = await models.User.findOne({ email }).exec();
  if (existingUser) {
    let isMatch = await bcrypt.compare(password, existingUser.password);
    if (!!isMatch) {
      let token = jwt.sign(
        {
          data: existingUser,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRATION,
        }
      );
      let existingRefreshToken = await models.RefreshToken.findOne({
        user: existingUser._id,
      });
      if (existingRefreshToken) {
        await models.RefreshToken.deleteMany({ user: existingUser._id });
      }
      let refreshToken = await createRefreshToken(existingUser);
      return {
        ...existingUser.toObject(),
        password: 'not show',
        accessToken: token,
        refreshToken,
      };
    } else {
      throw new Exception(Exception.INVALID_EMAIL_OR_PASSWORD);
    }
  } else {
    throw new Exception(Exception.INVALID_EMAIL_OR_PASSWORD);
  }
};

const refreshLogin = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new Exception(Exception.REQUIRED_REFRESH_TOKEN);
  }

  try {
    let token = await models.RefreshToken.findOne({ token: refreshToken });

    if (!token) {
      throw new Exception(Exception.REFRESH_TOKEN_NOT_FOUND);
    }

    if (verifyExpiration(token)) {
      models.RefreshToken.findByIdAndRemove(token._id).exec();

      throw new Exception(Exception.REFRESH_TOKEN_EXPIRED);
    }

    let user = await models.User.findById(token.user._id);
    let newAccessToken = jwt.sign(
      {
        data: user,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
      }
    );

    return {
      accessToken: newAccessToken,
      refreshToken: token.token,
    };
  } catch (error) {
    throw new Exception(Exception.SOMETHING_WRONG);
  }
};

const register = async ({
  name,
  avatar,
  email,
  gender,
  password,
  phoneNumber,
  address,
  role,
  workingTime,
}) => {
  const existingUser = await models.User.findOne({ email }).exec();
  if (!!existingUser) {
    throw new Exception(Exception.USER_EXISTED);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let uploadImage = null;

  if (avatar) {
    const { originalname, mimetype, buffer } = avatar;
    uploadImage = await upload.image({
      originalname: originalname,
      mimetype: mimetype,
      buffer: buffer,
      email: email,
    });
  }

  let dataToCreate = {
    phoneNumber,
    password: hashedPassword,
    email,
    name,
    address,
    gender,
    role,
    workingTime,
  };

  if (uploadImage) {
    dataToCreate = { ...dataToCreate, avatar: uploadImage.downloadURL };
  }

  const newUser = await models.User.create(dataToCreate);

  return {
    ...newUser._doc,
    password: 'not show',
  };
};

const logout = async ({ userId }) => {
  try {
    await models.RefreshToken.deleteMany({ user: userId });
    return {
      result: 'ok',
    };
  } catch (error) {
    throw new Exception(Exception.SOMETHING_WRONG);
  }
};

const changePassword = async ({ userId, oldPassword, newPassword }) => {
  try {
    const user = await models.User.findById(userId);
    let isMatch = await bcrypt.compare(oldPassword, user.password);
    if (isMatch) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
    }
  } catch (error) {
    throw new Exception(Exception.INVALID_EMAIL_OR_PASSWORD);
  }
};

const getUserInfo = async ({ userId }) => {
  try {
    const user = await models.User.findById(userId);
    return {
      ...user._doc,
      password: 'not show',
    };
  } catch (error) {
    throw new Exception(Exception.USER_NOT_EXISTED);
  }
};

export default {
  login,
  register,
  updateProfile,
  refreshLogin,
  logout,
  changePassword,
  getUserInfo,
};
