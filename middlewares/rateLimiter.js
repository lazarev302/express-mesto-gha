const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 100,
  windowMS: 60000,
  message: 'Превышено количество запросов на сервер. Попробуйте повторить немного позже',
});

module.exports = limiter;
