import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import repositories from '../repositories/index.js';

const demo = async (req, res) => {
  await repositories.ticketDetails.demo();
  res.status(HttpStatusCode.OK).json({
    message: 'response from create ticket detail',
  });
};

export default {
  demo,
};
