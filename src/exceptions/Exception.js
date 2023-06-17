import { print, OutputType } from '../helpers/print.js';

export default class Exception extends Error {
  static WRONG_DB_USERNAME_PASSWORD = "Wrong database's username or password";
  static WRONG_CONNECTION_STRING = 'Wrong server name/connection string';
  static CANNOT_CONNECT_MONGOOSE = 'Cannot connect tot Mongoose';
  static APP_VARIABLES_REQUIRED = 'App variables required';
  static SOMETHING_WRONG = 'Something wrong';
  static NOT_ENOUGH_VARIABLES = 'Not enough variables';
  static INVALID_EMAIL_OR_PASSWORD = 'Invalid email or password';
  static USER_EXISTED = 'User existed';
  static CANNOT_REGISTER = 'Can not register';
  constructor(message) {
    super(message);
    print(message, OutputType.ERROR);
  }
}
