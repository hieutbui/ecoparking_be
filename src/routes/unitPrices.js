import express from 'express';
import { body, validationResult } from 'express-validator';
import controllers from '../controllers/index.js';

const unitPrices = express.Router();

unitPrices.get('/', (req, res) => {
  res.send('response from unit price');
});

unitPrices.post('/create', controllers.unitPrices.createNew);

export default unitPrices;
