import { print, OutputType } from '../helpers/print.js';

export default class Exception extends Error {
  static WRONG_DB_USERNAME_PASSWORD = "Wrong database's username or password";
  static WRONG_CONNECTION_STRING = 'Wrong server name/connection string';
  static CANNOT_CONNECT_MONGOOSE = 'Cannot connect tot Mongoose';
  static APP_VARIABLES_REQUIRED = "App variables required";
  constructor(message) {
    super(message);
    print(message, OutputType.ERROR);
  }
}
