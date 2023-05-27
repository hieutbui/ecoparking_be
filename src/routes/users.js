import express from 'express';
import { body, validationResult } from 'express-validator';
import controllers from '../controllers/index.js';

const users = express.Router();

users.get('/', (req, res) => {
  res.send('GET users');
});

users.get('/:id', controllers.users.getDetailUser);

users.post('/login', controllers.users.login);

users.post('/register', controllers.users.register);

users.post('/insert', controllers.users.insertUser);

export default users;
