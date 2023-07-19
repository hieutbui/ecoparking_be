import express from 'express';
import controllers from '../controllers/index.js';
import { body } from 'express-validator';
import multer from 'multer';

const parkings = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

parkings.post(
  '/create-new-parking',
  upload.single('file'),
  body('parkType').isIn([0, 1]),
  body('name').exists(),
  body('address').exists(),
  body('quantity').exists(),
  body('longitude').exists(),
  body('latitude').exists(),
  controllers.parkings.createNewParking
);
parkings.get('/get-parking', controllers.parkings.getParkings);
parkings.post('/delete-parking', controllers.parkings.deleteParkings);
parkings.patch('/update-parking', controllers.parkings.updateParkings);
parkings.get('/get-all', controllers.parkings.getAllParking);
parkings.get('/get-one-parking', controllers.parkings.getOne);
// parkings.get('/search-parkings', controllers.parkings.searchParkings);
parkings.post('/save-parking', controllers.parkings.saveParking);
parkings.post('/un-save-parking', controllers.parkings.unSaveParking);

export default parkings;
