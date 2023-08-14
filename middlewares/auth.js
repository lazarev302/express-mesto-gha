const jwt = require('jsonwebtoken');

const { CONFIDENTIAL_KEY } = require('../utils/constants');

const CustomAuthenticationError = require('../errors/CustomAuthenticationError');

module.exports = (req, _, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMessage = 'Неправильные почта или пароль';
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(
      new CustomAuthenticationError(`${errorMessage}(${authorization})!`),
    );
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, CONFIDENTIAL_KEY);
  } catch (err) {
    return next(new CustomAuthenticationError(`${errorMessage}!`));
  }

  req.user = payload;

  return next();
};