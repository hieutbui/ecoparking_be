import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { print, OutputType } from '../helpers/print.js';
import models from '../models/index.js';
import Exception from '../exceptions/Exception.js';
import upload from '../helpers/upload.js';
import { deleteObject, getStorage, ref } from 'firebase/storage';

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
          expiresIn: '10 days',
        }
      );
      return {
        ...existingUser.toObject(),
        password: 'not show',
        accessToken: token,
      };
    } else {
      throw new Exception(Exception.INVALID_EMAIL_OR_PASSWORD);
    }
  } else {
    throw new Exception(Exception.INVALID_EMAIL_OR_PASSWORD);
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

  const { originalname, mimetype, buffer } = avatar;
  const uploadImage = await upload.image({
    originalname: originalname,
    mimetype: mimetype,
    buffer: buffer,
    email: email,
  });

  const newUser = await models.User.create({
    phoneNumber,
    password: hashedPassword,
    email,
    name,
    avatar: uploadImage.downloadURL,
    address,
    gender,
    role,
    workingTime,
  });

  return {
    ...newUser._doc,
    password: 'not show',
  };
};

export default {
  login,
  register,
  updateProfile,
};
