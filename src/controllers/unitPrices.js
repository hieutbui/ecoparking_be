import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import repositories from '../repositories/index.js';

const createNew = async (req, res) => {
  await repositories.unitPrices.demo();
  res.status(HttpStatusCode.OK).json({
    message: 'response from create unit price',
  });
};

export default {
  createNew,
};
