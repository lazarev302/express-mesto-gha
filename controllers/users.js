const { request } = require('express');
const User = require('../models/user');
const BadReqestError = request()

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
    User.findById(req.params.userId)
      .orFail()
      .then((user) => {
        res.status(httpConstants.HTTP_STATUS_CREATED).send(user);
      })
      .catch((err) => {
        if(err instanceof mongoose.Error.CastError) {
          next(new BadReqestError(`Некорректный _id: ${req.params.userId}`));
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new NotFoundError(`Пользователь по указанному _id: ${req.params.userId} не найден`));
        } else {
          next(err);
        }
      });
    };

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERMAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(httpConstants.HTTP_STATUS__OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Нет пользователя по указанному _id' });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERMAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => res.status(httpConstants.HTTP_STATUS__OK).send(user))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
        } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
          res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Нет пользователя по указанному _id' });
        } else {
          res.status(httpConstants.HTTP_STATUS_INTERMAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
        }
      });
};
