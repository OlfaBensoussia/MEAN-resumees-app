import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import User from '../../models/user';
import jwtDecode from 'jwt-decode';
const process = require('process');
const jwt = require('jsonwebtoken');
const VerifyToken = require('../middleware/checkJwt');
const VerifyLevel = require('../middleware/checkLevel');
const router: Router = Router();
let user: any;
let token: any;
// let email: any;
let userInfo: any;

router.post('/login', function (req, res, next) {
  // email = '';

  const promise = User.findOne({ email: req.body.username }).exec();
  promise.then(function (doc: any) {
    user = doc;
    // email = user.email;
    if (doc) {
      if (!AuthController.isValid(req.body.password, doc.password)) {
        return res.status(401).send({ error: 'Login ou mot de passe incorrect.' });
      }

      // Sing JWT, valid for 1 hour
      token = jwt.sign(
        { id: user._id, username: user.username, role: user.role, level: user.level },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "30s" }
      );
      // Send the jwt in the response
      res.status(200).json({ id: user._id, username: user.username, 'role ': user.role, level: user.level, access_token: token });
    } else {
      res.status(401).json({ error: 'Login ou mot de passe incorrect.' });
    }
  });

  promise.catch(function (err) {
    console.error('Error: ', err);
    return res.status(501).json({ message: 'Some internal error' });
  });
});

router.get('/info', VerifyToken, VerifyLevel, (req, res, next) => {
  const authorization = req.headers.authorization.split(' ');
  // Decode token
  const tokenInfo = getDecodedAccessToken(authorization[1]);
  // Chercher l'utilisateur à partir d'id
  User.findOne({ _id: tokenInfo.id }).then((config: any) => {
    if ((typeof config.level === 'undefined') || (config.level === null)) {
      config.level = -1;
    }

    userInfo = { id: config._id, email: config.email, username: config.username, role: config.role, level: config.level };

    res.status(200).json(userInfo);
  });
});

function getDecodedAccessToken (token: string): any {
  try {
    return jwtDecode(token);
  } catch (Error) {
    return undefined;
  }
}
export default router;
