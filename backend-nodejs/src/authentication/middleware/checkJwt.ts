import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

function verifyToken (req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    try {
      // Get the jwt token from the head
      const authorization = req.headers.authorization.split(' ');
      if (authorization[0] !== 'Bearer') {
        return res.status(401).send();
      } else {
        // Try to validate the token and get data
        const jwtPayload = jwt.verify(authorization[1], `${process.env.JWT_SECRET}`);
        res.locals.jwtPayload = jwtPayload;
        return next();
      }
    } catch (error) {
      // If token is not valid, respond with 401 (unauthorized)
      res.status(401).send();
    }
  } else {
    res.status(401).send();
  }
}
module.exports = verifyToken;
