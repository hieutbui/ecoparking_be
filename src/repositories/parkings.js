import Exception from '../exceptions/Exception.js';
import upload from '../helpers/upload.js';
import models from '../models/index.js';

const getAllParking = async () => {
  const foundParking = await models.Parking.find({});
  return foundParking;
};

/**
 * @author hieubt
 * @typedef CreateParkParams
 * @property {string} name
 * @property {string} address
 * @property {{originalname: string, mimetype: string, buffer: Buffer}} image
 * @property {number} longitude
 * @property {number} latitude
 * @property {number} available
 * @property {0 | 1} parkType
 * @param {CreateParkParams} param
 * @returns {Document<unknown, {}, {createdAt: NativeDate, updatedAt: NativeDate,} & {name: string, address: string, quantity: number, longitude: Types.Decimal128, latitude: Types.Decimal128, parkType: unknown[], id?: Types.ObjectId | undefined, image?: string | undefined, available?: number | undefined,}> & Omit<...>}
 */
const createParking = async ({
  name,
  address,
  quantity,
  image,
  longitude,
  latitude,
  parkType,
  available,
}) => {
  const existingParking = await models.Parking.findOne({
    name,
    address,
    longitude,
    latitude,
  });
  if (!!existingParking) {
    throw new Exception(Exception.PARKING_EXISTED);
  }

  const { originalname, mimetype, buffer } = image;
  const uploadImage = await upload.image({
    originalname: originalname,
    mimetype: mimetype,
    buffer: buffer,
    parkName: name,
    model: 'parkings',
  });

  const newParking = await models.Parking.create({
    name,
    address,
    quantity,
    image: uploadImage.downloadURL,
    longitude,
    latitude,
    parkType,
    available,
  });

  return newParking;
};

export default {
  getAllParking,
  createParking,
};
