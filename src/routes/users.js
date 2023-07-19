import express from 'express';
import { body, validationResult } from 'express-validator';
import controllers from '../controllers/index.js';
import multer from 'multer';

const users = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

users.get('/', controllers.users.getDetailUser);

users.post(
  '/login',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  controllers.users.login
);

users.post(
  '/register',
  upload.single('file'),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('phoneNumber').isLength({ min: 5 }),
  body('role').isIn([0, 1, 2]),
  controllers.users.register
);

users.post('/insert', controllers.users.insertUser);

users.post(
  '/updateProfile',
  upload.single('file'),
  controllers.users.updateProfile
);

users.post('/refreshLogin', controllers.users.refreshLogin);

users.post('/logout', controllers.users.logout);

users.post('/get-booking', controllers.users.getBooking);

users.post('/scanQR', controllers.users.scanQR);

users.post('/change-password', controllers.users.changePassword);

export default users;
