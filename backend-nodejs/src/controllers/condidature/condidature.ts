import { Router } from 'express';
import Condidature from '../../models/condidature';
import mongoose from 'mongoose';
import multer from 'multer';
const router: Router = Router();
const Schema = mongoose.Schema;
const ConfigSchema = new Schema({ ...{ id: Number } }, { strict: false });
const Config = mongoose.model('AllCondidate', ConfigSchema, 'Condidatures');
const DIR = './public/';
// src\public
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'recrutement.test.inf.managment@gmail.com',
    pass: 'm0tdepasse'
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

//Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"|| file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg, pdf and .jpeg format allowed!'));
    }
  }
});

  router.post("", upload.single('cv'), function (req, res, next) {

    const url = req.protocol + '://' + req.get('host')
    Config.findOne({ email: req.body.email},function (err: any, doc: any) {
      if (!doc){    
        const condidature = new Condidature({
            nom: req.body.nom,
            prenom: req.body.prenom,
            dateCreation: req.body.dateCreation,
            email: req.body.email,
            disponibilite: req.body.disponibilite,
            numTelephone: req.body.numTelephone,
            message: req.body.message,
            anneExperience: req.body.anneeExperience,
            cv: url + '/public/' + req.file.filename,
            dateNaissance: req.body.dateNaissance,
            etatCondidature: "Nouvelle",
            statusEmail: "envoyé"
          });
          condidature.save().then( (data :any) => {
            // res.redirect(`${process.env.GRAFANA_URI}/login`);
            res.status(200).json("La condidature est bien enregistée");
            var mailOptions = {
              from: 'recrutement.test.inf.managment@gmail.com',
              to: req.body.email,
              subject: 'Candidature',
              text: 'Votre condidature est prise en compte!'
            };
        
            transporter.sendMail(mailOptions, function(error :any, info:any){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }).catch(err => {
            console.log(err),
              res.status(500).json({
                error: err
              });
          })
        }
        else { 
                      res.status(500).json({
                
              });
        }
      })

  })
  
router.get('/condidature', (req, res, next) => {

    Config.find({ }).then(config => {
      res.status(200).json(config);
    });
  }); 

  router.get('/condidature/:id', (req, res, next) => {
    Config.find({ _id : req.params.id}).then(config => {
      res.status(200).json(config);
    });
  });

  router.post('/encours', (req, res, next) => {
    var mailOptions = {
      from: 'recrutement.test.inf.managment@gmail.com',
      to: req.body.email,
      subject: 'Candidature en cours de traitement',
      text: 'Votre condidature est en cours de traitement'
    };

    transporter.sendMail(mailOptions, function(error :any, info:any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
      Config.findOneAndUpdate({ _id: req.body.id }, { etatCondidature: "En cours" }, function (
        err,
        result
      ) {
        if (err) {
          console.log('notOK');
        } else {
          console.log('ok');
        }
      });
    
  });

  router.post('/confirmer', (req, res, next) => {
    var mailOptions = {
      from: 'recrutement.test.inf.managment@gmail.com',
      to: req.body.email,
      subject: 'Candidature acceptée',
      text: 'Votre candidature est confirmée, nous allons vous envoyer un lien pour un entretien'
    };

    transporter.sendMail(mailOptions, function(error :any, info:any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
      Config.findOneAndUpdate({ _id: req.body.id }, { etatCondidature: "Confirmé" }, function (
        err,
        result
      ) {
        if (err) {
          console.log('notOK');
        } else {
          console.log('ok');
        }
      });
  });

  router.post('/rejeter', (req, res, next) => {
    var mailOptions = {
      from: 'recrutement.test.inf.managment@gmail.com',
      to: req.body.email,
      subject: 'Candidature refusée',
      text: 'Malheureusement votre candidature est refusée'
    };

    transporter.sendMail(mailOptions, function(error :any, info:any){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
      Config.findOneAndUpdate({ _id: req.body.id }, { etatCondidature: "Rejeté" }, function (
        err,
        result
      ) {
        if (err) {
          console.log('notOK');
        } else {
          console.log('ok');
        }
      });
    
  });

  router.post("/edit", function (req, res, next) {
    console.log(req.body.nom)
    Config.findOneAndUpdate({ email: req.body.email }, { nom: req.body.nom,
      prenom: req.body.prenom,
      dateCreation: req.body.dateCreation,
      email: req.body.email,
      disponibilite: req.body.disponibilite,
      numTelephone: req.body.numTelephone,
      message: req.body.message,
      anneExperience: req.body.anneeExperience,
      dateNaissance: req.body.dateNaissance,
      etatCondidature: req.body.etatCondidature,
      statusEmail: req.body.statusEmail }, function (
      err,
      result
    ) {
      if (err) {
        console.log('notOK');
      } else {
        console.log('ok');
      }
    });
  
  })
  export default router;
