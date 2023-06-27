import express from 'express';
import controllers from '../controllers/index.js';

const parkings = express.Router();

parkings.post('/create-new-parking', controllers.parkings.createNewParking);
parkings.get('/get-parking', controllers.parkings.getParkings);
parkings.post('/delete-parking', controllers.parkings.deleteParkings);
parkings.patch('/update-parking', controllers.parkings.updateParkings);

export default parkings;
