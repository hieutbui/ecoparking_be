import express from 'express';
import controllers from '../controllers/index.js';

const parkings = express.Router();

parkings.post('/create-new-parking', controllers.parkings.createNewParking);

export default parkings;
