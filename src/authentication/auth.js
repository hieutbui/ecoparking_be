import Exception from '../exceptions/Exception.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import jwt from 'jsonwebtoken';

export default function checkToken(req, res, next) {
  //bypass login, register
  if (
    req.url.toLowerCase().trim() === '/users/login'.toLowerCase().trim() ||
    req.url.toLowerCase().trim() === '/users/register'.toLowerCase().trim()
  ) {
    next();
    return;
  }
  //other requests

  //get and validate token
  const token = req.headers?.authorization?.split(' ')[1];
  try {
    const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
    const isExpired = Date.now() >= jwtObject.exp * 1000;
    if (isExpired) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        result: 'failed',
        message: Exception.TOKEN_EXPIRED,
      });
    } else {
      next();
      return;
    }
  } catch (error) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      result: 'failed',
      error: error.toString(),
    });
  }
}
