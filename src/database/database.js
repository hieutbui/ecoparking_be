import mongoose from 'mongoose';
import { print, OutputType } from '../helpers/print.js';
import Exception from '../exceptions/Exception.js';
mongoose.set('strictQuery', true);

async function connect() {
  try {
    let connection = await mongoose.connect(process.env.MONGO_URI);
    print('Connect mongoose successfully', OutputType.SUCCESS);
    return connection;
  } catch (error) {
    const { code } = error;
    if (code === 8000) {
      throw new Exception(Exception.WRONG_DB_USERNAME_PASSWORD);
    } else if (code === 'ENOTFOUND') {
      throw new Exception(Exception.WRONG_CONNECTION_STRING);
    }
    print('error: ' + error, OutputType.WARNING);
    print('error code: ' + error.code, OutputType.ERROR);
    throw new Exception(Exception.CANNOT_CONNECT_MONGOOSE);
  }
}

export default connect;
