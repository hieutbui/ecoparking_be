import multer from 'multer';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import repositories from '../repositories/index.js';
import { EventEmitter } from 'node:events';
import upload from '../helpers/upload.js';
import Exception from '../exceptions/Exception.js';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import controllers from './index.js';
import models from '../models/index.js';

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
  try {
    const { id, role } = req.query;

    if (!id || !ObjectId.isValid(id)) {
      let allUsers;

      switch (role) {
        case '0':
          allUsers = await User.find({ role: 0 });
          break;
        case '1':
          allUsers = await User.find({ role: 1 });
          break;
        case '2':
          allUsers = await User.find({ role: 2 });
          break;
        default:
          allUsers = await User.find();
      }

      return res.status(200).json({
        data: allUsers,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      throw new Error('SingleTicket not found');
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving user data',
      error: error.message,
    });
  }
};

const insertUser = async (req, res) => {
  res.send('Post insert users');
};

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 * @returns {JSON}
 */
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

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 *@returns {JSON}
 */
const logout = async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      message: Exception.NOT_ENOUGH_VARIABLES,
    });
  }
  try {
    await repositories.users.logout({ userId });
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
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
 */
const getBooking = async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      message: Exception.NOT_ENOUGH_VARIABLES,
    });
  }
  try {
    const user = await models.User.findById(userId);
    const tickets = await models.SingleTicket.find({
      _id: {
        $in: user.tickets,
      },
    });
    if (!tickets) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        result: 'failed',
        message: 'ticket not found',
      });
    }
    let ticketsId = [];
    tickets.forEach((ticket) => {
      ticketsId.push(ticket.ticketDetail);
    });
    let ticketDetails = await models.TicketDetail.find({
      _id: { $in: ticketsId },
    });
    ticketDetails = await Promise.all(
      ticketDetails.map(async (element, index) => {
        const parking = await models.Parking.findById(element.parkingId);
        element = { ...element._doc, parking: parking };
        return element;
      })
    );
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
      data: ticketDetails,
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
 */
const scanQR = async (req, res) => {
  const { ticketId } = req.body;
  if (!ticketId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      message: Exception.NOT_ENOUGH_VARIABLES,
    });
  }
  try {
    let ticketDetail = await models.TicketDetail.findById(ticketId);
    let currentDate = new Date();
    if (!ticketDetail.startTime) {
      ticketDetail.startTime = currentDate;
      ticketDetail.status = 'nowActive';
    } else {
      ticketDetail.endTime = currentDate;
      ticketDetail.status = 'completed';
    }
    await ticketDetail.save();
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
      data: ticketDetail,
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
 */
const changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  if (!userId || !oldPassword || !newPassword) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      message: Exception.NOT_ENOUGH_VARIABLES,
    });
  }
  try {
    await repositories.users.changePassword({
      userId,
      oldPassword,
      newPassword,
    });
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      error: error.toString(),
    });
  }
};

export default {
  login,
  register,
  getDetailUser,
  insertUser,
  updateProfile,
  refreshLogin,
  logout,
  getBooking,
  scanQR,
  changePassword,
};
