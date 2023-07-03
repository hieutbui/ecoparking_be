import { validationResult } from 'express-validator';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import Parking from '../models/Parking.js';
import {
  createNewItem,
  getItem,
  deleteItem,
  updateItem,
} from '../repositories/CRUD.js';
import repositories from '../repositories/index.js';

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 * @returns {JSON}
 */
const createNewParking = async (req, res) => {
  // const { name, address, quantity } = req.body;

  // if (
  //   !name ||
  //   typeof name !== 'string' ||
  //   !address ||
  //   typeof address !== 'string' ||
  //   !quantity ||
  //   typeof quantity !== 'number'
  // ) {
  //   return res.status(HttpStatusCode.BAD_REQUEST).json({
  //     message: 'Invalid parameter types!',
  //   });
  // }

  // try {
  //   const parking = await createNewItem(req.body, address, Parking);
  //   res.status(200).json({
  //     data: parking,
  //   });
  // } catch (error) {
  //   res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
  //     message: 'Error created parking data',
  //     error: error.message,
  //   });
  // }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      errors: errors.array(),
    });
  }
  const { file, body } = req;
  const { name, address, quantity, longitude, latitude, parkType, available, } = body;
  try {
    const parking = await repositories.parkings.createParking({
      name,
      address,
      quantity,
      latitude,
      longitude,
      parkType,
      available,
      image: file,
    });
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
      data: parking,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      error: error.toString(),
    });
  }
};

/* author: dunglda
 */
const getParkings = async (req, res) => {
  const { id } = req.query;

  if (!id || typeof id !== ('string' || 'object')) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Invalid parameter types!',
    });
  }

  try {
    const parking = await getItem(id, Parking);
    res.status(200).json({
      data: parking,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: 'Error retrieving parking data',
      error: error.message,
    });
  }
};

/* author: dunglda
description: update a parking in DB
*/
const updateParkings = async (req, res) => {
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
    const updatedParking = await updateItem(id, Parking);

    res.status(HttpStatusCode.OK).json({
      data: updatedParking,
      message: 'Update parking success!',
    });
  } catch (error) {
    //Handle errors while finding or creating a parking record
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: `Failed to update a parking. Error: ${error.message}`,
    });
  }
};

/* author: dunglda
 */
const deleteParkings = async (req, res) => {
  const { id } = req.body;
  console.log(id + typeof id);

  if (!id || typeof id !== 'string') {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'Invalid parameter types!',
    });
  }

  try {
    await deleteItem(id, Parking);

    res.status(HttpStatusCode.OK).json({
      message: 'Delete parking success!',
    });
  } catch (error) {
    //Handle errors while finding or creating a parking record
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: `Failed to delete a parking. Error: ${error.message}`,
    });
  }
};

/**
 * @author hieubt
 * @param {Request} req
 * @param {Response} res
 */
const getAllParking = async (req, res) => {
  try {
    const parkings = await repositories.parkings.getAllParking();
    return res.status(HttpStatusCode.OK).json({
      result: 'ok',
      data: parkings,
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      result: 'failed',
      message: error.toString(),
    });
  }
};

export default {
  createNewParking,
  getParkings,
  updateParkings,
  deleteParkings,
  getAllParking,
};
