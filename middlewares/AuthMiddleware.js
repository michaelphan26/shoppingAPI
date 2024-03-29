const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('No token');
  }

  try {
    const payload = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = payload;
    next();
  } catch (err) {
    return res.status(400).send(err.message);
  }
}

function adminAuth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('No token');
  }

  try {
    const payload = jwt.verify(token, config.get('jwtPrivateKey'));
    const reg = new RegExp(/^admin&/, 'i');
    if (payload.role_name.match(reg)) {
      return res.status(404).send('Resources not found');
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(400).send('Token invalid');
  }
}

module.exports = { auth, adminAuth };
