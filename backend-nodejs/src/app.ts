import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongo from 'connect-mongo';
import compression from 'compression';
import lusca from 'lusca';
import path from 'path';
import AuthenticationRoute from './authentication/controllers/AuthentificationJwt';
import usersRoutes from './controllers/users';
import CondidatRoute from './controllers/condidature/condidature';


export const SESSION_SECRET = process.env['SESSION_SECRET'];
const MongoStore = mongo(session)
const app = express();
const mongoUrl = process.env.MONGODB_URI;
(<any>mongoose).Promise = bluebird;
const dotenv = require('dotenv');
dotenv.config();
app.use(cors({ origin: '*' }));
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/candidatures").then(
    () => {
      console.log('info', 'connected to database');
    })
    .catch(
      () => {
        console.log('error', 'connected to database');
      });
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});
app.set('port', process.env.PORT || 3800);
app.set('host', process.env.HOST || 'localhost');
app.use(compression());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
app.use('/public', express.static('public'));



app.use('/auth', AuthenticationRoute);
app.use('/users', usersRoutes);
app.use('/api',CondidatRoute );
export default app;
