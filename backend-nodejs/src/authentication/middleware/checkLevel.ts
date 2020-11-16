
import { Request, Response, NextFunction } from 'express';
import jwtDecode from 'jwt-decode';
const process = require('process');
function verifyLevel (req: Request, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization.split(' ');
  // si un untilisateur lance directement la requête
  if ((typeof req.get('origin') === 'undefined') || (req.get('origin') === null)) {
    // Decode token
    const tokenInfo = getDecodedAccessToken(authorization[1]);
    const levelUser = tokenInfo.level;
    if (levelUser !== 3) {
      return res.status(403).send({ Error: "vous n'êtes pas autorisé" });
    } else {
      return next();
    }
  } else {
    return next();
  }
}

function getDecodedAccessToken (token: string): any {
  try {
    return jwtDecode(token);
  } catch (Error) {
    return undefined;
  }
}
module.exports = verifyLevel;
