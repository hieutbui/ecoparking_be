import multer from 'multer';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import repositories from '../repositories/index.js';
import { EventEmitter } from 'node:events';
import upload from '../helpers/upload.js';
import Exception from '../exceptions/Exception.js';
import { validationResult } from 'express-validator';

const userEvent = new EventEmitter();

userEvent.on('event.login.user', (param) => {
  console.log(`Info: ${JSON.stringify(param)}`);
});

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 * @returns {JSON}
 */
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    let existingUser = await repositories.users.login({ email, password });
    return res.status(HttpStatusCode.OK).json({
      result: 'successfully',
      data: existingUser,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      error: error.toString(),
    });
  }
};

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 * @returns {JSON}
 */
const refreshLogin = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const token = await repositories.users.refreshLogin({ refreshToken });
    if (token) {
      return res.status(HttpStatusCode.OK).json({
        result: 'ok',
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });
    }
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      error: error.toString(),
    });
  }
};

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 * @returns {JSON}
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      errors: errors.array(),
    });
  }
  const { file, body } = req;
  const {
    name,
    email,
    gender,
    password,
    phoneNumber,
    address,
    role,
    workingTime,
  } = body;
  try {
    const user = await repositories.users.register({
      name,
      email,
      gender,
      password,
      phoneNumber,
      address,
      role,
      workingTime,
      avatar: file,
    });
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
      data: user,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      error: error.toString(),
    });
  }
};

const getDetailUser = async (req, res) => {
  res.send('Get user by id: ' + req?.params?.id ?? '');
};

const insertUser = async (req, res) => {
  res.send('Post insert users');
};

const updateProfile = async (req, res) => {
  const { file } = req;
  const { email, gender, phoneNumber, address, role, workingTime, id, name } =
    req.body;

  if (
    !file &&
    !email &&
    !gender &&
    !phoneNumber &&
    !address &&
    !role &&
    !workingTime &&
    !id &&
    !name
  ) {
    return res.status(HttpStatusCode.BAD_REQUEST).send({
      result: 'failed',
      message: Exception.NOT_ENOUGH_VARIABLES,
    });
  } else {
    try {
      const user = await repositories.users.updateProfile({
        id,
        name,
        avatar: file,
        email,
        gender,
        phoneNumber,
        address,
        role,
        workingTime,
      });
      return res.status(HttpStatusCode.OK).json({
        result: 'ok',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        result: 'failed',
        error: error.toString(),
      });
    }
  }
};

export default {
  login,
  register,
  getDetailUser,
  insertUser,
  updateProfile,
  refreshLogin,
};
