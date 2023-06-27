import { print, OutputType } from '../helpers/print.js';

export default class Exception extends Error {
  static WRONG_DB_USERNAME_PASSWORD = "Wrong database's username or password";
  static WRONG_CONNECTION_STRING = "Wrong server name/connection string";
  static CANNOT_CONNECT_MONGOOSE = "Cannot connect tot Mongoose";
  static APP_VARIABLES_REQUIRED = "App variables required";
  static INVALID_PARAMETERS_TYPES = "Invalid parameter types";
  static FAILED_CREATED_ITEM = "Failed to create a new item";
  static EXISTED_ITEM = "An item already exists!";
  constructor(message) {
    super(message);
    print(message, OutputType.ERROR);
  }
}
