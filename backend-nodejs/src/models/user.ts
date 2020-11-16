import { model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  level: { type: Number, required: true }
});

const User = model('Users', userSchema, 'users');
// const User = model('user', userSchema);
// export default User;
export default User;

