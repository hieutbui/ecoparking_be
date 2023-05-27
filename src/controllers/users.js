import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import repositories from '../repositories/index.js';
import { EventEmitter } from 'node:events';

const userEvent = new EventEmitter();

userEvent.on('event.login.user', (param) => {
  console.log(`Info: ${JSON.stringify(param)}`);
});

const login = async (req, res) => {
  const { email, password } = req.body;

  userEvent.emit('event.login.user', { email, password });

  await repositories.users.login({ email, password });

  res.status(HttpStatusCode.OK).json({
    message: 'OK',
  });
};

const register = async (req, res) => {
  res.send('Post register users');
};

const getDetailUser = async (req, res) => {
  res.send('Get user by id: ' + req?.params?.id ?? '');
};

const insertUser = async (req, res) => {
  res.send('Post insert users');
};

export default {
  login,
  register,
  getDetailUser,
  insertUser,
};
