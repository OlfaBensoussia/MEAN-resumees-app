const bcrypt = require('bcryptjs');

class AuthController {
  static isValid (hashedpassword: any, password: any) {
    return bcrypt.compareSync(hashedpassword, password);
  }
}
export default AuthController;
