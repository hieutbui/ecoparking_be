import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { print, OutputType } from '../helpers/print.js';
import models from '../models/index.js';

const login = async ({ email, password }) => {
  console.log('login user in use repository: ' + email + password);
};

const register = async ({ email, password, name, phone, address }) => {
  console.log('register user in use repository');
};

export default {
  login,
  register,
};
