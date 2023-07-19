import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import SingleTicket from '../models/SingleTicket.js';
import TicketDetail from '../models/TicketDetail.js';
import mongoose from 'mongoose';
import {
  createNewItem,
  getItem,
  deleteItem,
  updateItem,
} from '../repositories/CRUD.js';
import ticketDetails from '../repositories/ticketDetails.js';
import models from '../models/index.js';
import Exception from '../exceptions/Exception.js';

const { ObjectId } = mongoose.Types;

const createNewTicket = async (req, res) => {
  try {
    const {
      customerId,
      parkingId,
      checkedIn,
      checkedOut,
      carNumber,
      carType,
      special,
    } = req.body;

    // if (!carNumber || typeof carNumber !== 'string' ||
    //     !carType || typeof carType !== 'string'||
    //     !checkedIn || typeof checkedIn !== 'object' ||
    //     !checkedOut || typeof checkedOut !== 'object')
    // {
    //     return res.status(HttpStatusCode.BAD_REQUEST).json({
    //         message: 'Invalid parameter types!'
    //     });
    // }

    // Check if ticket is available
    const existingTicket = await TicketDetail.findOne({
      customerId: customerId,
      parkingId: parkingId,
      startTime: checkedIn,
      endTime: checkedOut,
    });

    if (existingTicket) {
      return res.status(HttpStatusCode.CONFLICT).json({
        message: 'Ticket already exists for the customer.',
      });
    }

    const ticketDetail = await TicketDetail.create({
      customerId,
      parkingId,
      carNumber,
      carType,
      special,
      status: 'paid',
    });

    // const fee = await ticketDetails.calculateFee(
    //   checkedIn,
    //   checkedOut,
    //   parkingId
    // );

    const newTicket = await SingleTicket.create({
      ticketDetail: ticketDetail._id,
      checkedIn,
      checkedOut,
      //   parkedDate: CURRENT_DATE.toISOString().substr(0, 10),
      //   fee,
    });

    const parking = await models.Parking.findById(parkingId);

    const user = await models.User.findById(customerId);

    if (user) {
      user.tickets.push(newTicket._id);
    }

    await user.save();

    res.status(200).json({
      data: {
        singleTicket: newTicket,
        parkName: parking.name,
        carNumber: carNumber,
        ticketDetailId: ticketDetail._id,
      },
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Error created parking data',
      error: error.message,
    });
  }
};

/* author: dunglda
 */
const getTicket = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || !ObjectId.isValid(id)) {
      const allTickets = await SingleTicket.find()
        .populate({
          path: 'ticketDetail',
          populate: [
            { path: 'customerId', model: 'User' },
            { path: 'parkingId', model: 'Parking' },
          ],
        })
        .exec();

      if (allTickets) {
        return res.status(200).json({
          data: allTickets,
        });
      } else {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: 'Invalid parameter types!',
        });
      }
    }

    const singleTicket = await SingleTicket.findById(id)
      .populate({
        path: 'ticketDetail',
        populate: [
          { path: 'customerId', model: 'User' },
          { path: 'parkingId', model: 'Parking' },
        ],
      })
      .exec();

    if (!singleTicket) {
      throw new Error('SingleTicket not found');
    }

    const ticket = {
      singleTicket,
    };

    res.status(200).json({
      data: ticket,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving ticket data',
      error: error.message,
    });
  }
};

/* author: dunglda
description: update a ticket in DB
*/
const updateTicket = async (req, res) => {
  const { id, name, address, quantity } = req.body;

  if (
    !id ||
    typeof id !== 'string' ||
    !name ||
    typeof name !== 'string' ||
    !address ||
    typeof address !== 'string' ||
    !quantity ||
    typeof quantity !== 'number'
  ) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Invalid parameter types!',
    });
  }

  try {
    const updatedParking = await updateItem(id, Ticket);

    res.status(HttpStatusCode.OK).json({
      data: updatedParking,
      message: 'Update ticket success!',
    });
  } catch (error) {
    //Handle errors while finding or creating a parking record
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: `Failed to update a ticket. Error: ${error.message}`,
    });
  }
};

/* author: dunglda
 */
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: 'Invalid parameter types!',
      });
    }

    const existingTicket = await SingleTicket.findById(id);

    if (existingTicket) {
      await SingleTicket.deleteOne({ _id: id });

      res.status(HttpStatusCode.OK).json({
        message: 'Delete ticket success!',
      });
    } else {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: 'Not Found ticket to delete',
      });
    }
  } catch (error) {
    //Handle errors while finding or creating a ticket record
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: `Failed to delete a ticket. Error: ${error.message}`,
    });
  }
};

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 */
const getMultiTickets = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        result: 'failed',
        message: Exception.NOT_ENOUGH_VARIABLES,
      });
    }
    const tickets = await models.SingleTicket.find({ _id: { $in: id } });
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
    const ticketDetails = await models.TicketDetail.find({
      _id: { $in: ticketsId },
    });
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
      data: ticketDetails,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      message: error.toString(),
    });
  }
};

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 */
const cancelTicket = async (req, res) => {
  const { ticketId } = req.body;
  if (!ticketId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      message: Exception.NOT_ENOUGH_VARIABLES,
    });
  }

  try {
    const ticket = await models.SingleTicket.findById(ticketId);
    if (!ticket) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        result: 'failed',
        message: 'Ticket not found',
      });
    }
    const ticketDetail = await models.TicketDetail.findById(
      ticket.ticketDetail
    );
    if (!ticketDetail) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        result: 'failed',
        message: 'Ticket not found',
      });
    }
    ticketDetail.status = 'canceled';
    await ticketDetail.save();
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
      message: 'Ticket is canceled',
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      message: error.toString(),
    });
  }
};

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 */
const getSingleTicket = async (req, res) => {
  const { ticketDetailId } = req.body;
  if (!ticketDetailId) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      message: Exception.NOT_ENOUGH_VARIABLES,
    });
  }
  try {
    const singleTicket = await models.SingleTicket.findOne({
      ticketDetail: ticketDetailId,
    });
    if (!singleTicket) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        result: 'failed',
        message: 'NOT FOUND',
      });
    } else {
      return res.status(HttpStatusCode.OK).json({
        result: 'ok',
        data: singleTicket,
      });
    }
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      message: error.toString(),
    });
  }
};

export default {
  createNewTicket,
  getTicket,
  updateTicket,
  deleteTicket,
  getMultiTickets,
  cancelTicket,
  getSingleTicket,
};
