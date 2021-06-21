const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {request: {body: {email, displayName, password} = {}} = {}} = ctx || {};

  try {
    // const alreadySuchUser = await User.find({email: email}).deleteOne();
    const newUserCreate = await User.create({email, displayName, verificationToken});
    newUserCreate.setPassword(password);
    newUserCreate.save();
  } catch (e) {
    ctx.throw(400, `Email: ${email} уже существует`);
  }

  try {
    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch (e) {
    ctx.throw(400, `Email send error`);
  }
};

module.exports.confirm = async (ctx, next) => {
  const {request: {body: {verificationToken} = {}} = {}} = ctx || {};
  const user = await User.findOne({verificationToken});

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }

  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.body = {token};
};
