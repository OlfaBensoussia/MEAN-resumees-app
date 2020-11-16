import { Router } from 'express';
import User from '../models/user';
const VerifyToken = require('../authentication/middleware/checkJwt');
const VerifyLevel = require('../authentication/middleware/checkLevel');
const router: Router = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let user: any;
let token: any;
// let email : any
function hashPassword (password: any) {
  return bcrypt.hashSync(password, 10);
}

function isValid (hashedpassword: any, password: any) {
  return bcrypt.compareSync(hashedpassword, password);
}

router.get('/info', VerifyToken, VerifyLevel, (req, res, next) => {
  User.findOne({ email: req.body.email }).then((config: any) => {
    res.status(200).json(config);
  });
});

router.post('', (req, res, next) => {
  const promise = User.findOne({ email: req.body.email }).exec();
  promise.then(function (doc: any) {
    if (doc) {
      res.status(501).json({ message: 'User email is registered.' });
    } else {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword(req.body.password),
        role: req.body.role,
        level: 0
      });
      user.save().then(createduser => {
        // res.redirect(`${process.env.GRAFANA_URI}/login`);
        res.status(200).json("Le compte est bien crée");
      });
    }
  });
}
);

router.post('/login/:state', function (req, res, next) {
  const promise = User.findOne({ email: req.body.email }).exec();
  console.log('promise :', promise);
  promise.then(function (doc: any) {
    console.log('doc', doc);
    user = doc;
    if (doc) {
      if (isValid(req.body.password, doc.password)) {
        const state = req.params.state;
        token = jwt.sign(user.toObject(), 'secret');
        // return res.cookie('token', token).status(200).json({url: `${process.env.GRAFANA_URI}/login/generic_oauth?state=${state}&code=cc536d98d27750394a87ab9d057016e636a8ac31`, token: token});
        res.status(200).cookie('token', token).location(`/login/generic_oauth?state=${state}&code=cc536d98d27750394a87ab9d057016e636a8ac31`);
        res.status(200).json({ url: `${process.env.GRAFANA_URI}/login/generic_oauth?state=${state}&code=cc536d98d27750394a87ab9d057016e636a8ac31`, token: token });
      } else {
        return res.status(501).json({ message: ' Invalid Credentials' });
      }
    } else {
      return res.status(501).json({ message: 'User email is not registered.' });
    }
  });
  promise.catch(function (err) {
    console.log('Error: ', err);
    return res.status(501).json({ message: 'Some internal error' });
  });
});

router.post('/token', (req, res) => {
  res.json({
    access_token: token
  });
});

router.get('/api/', (req, res) => {
  res.status(200).json(user);
});

export default router;
