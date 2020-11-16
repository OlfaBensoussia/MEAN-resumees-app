import { model, Schema } from 'mongoose';

const condidatureSchema: Schema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: String },
  email: { type: String, required: true },
  anneExperience: { type: String },
  numTelephone: { type: String, required: true },
  message: { type: String},
  disponibilite: { type: Number},
  dateCreation: { type: String, required: true },
  cv: {type: String},
  etatCondidature: {type: String},
  statusEmail: {type: String}
});

const Condidature = model('Condidature', condidatureSchema, 'Condidatures');
// const User = model('user', userSchema);
// export default User;


export default Condidature;

