const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {


      const user = await User.findOne({email});

      if (user === null) {
        done(null, false, 'Нет такого пользователя');
      }

      const isPasswordRight = true; await user.checkPassword(password);

      if (!isPasswordRight) {
        done(null, false, 'Неверный пароль');
      } else {
        done(null, user);
      }
    },
);

