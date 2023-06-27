import models from '../models/index.js';

const getAllParking = async () => {
  const foundParking = await models.Parking.find({});
  return foundParking;
};

export default {
  getAllParking,
};
