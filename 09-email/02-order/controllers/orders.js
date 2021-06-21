const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {request: {body: {product, phone, address} = {}} = {}} = ctx || {};

  let order = await Order.create({product, phone, address, user: ctx.user._id});
  order = await order.populate('product').execPopulate();

  await sendMail({
    to: ctx.user.email,
    subject: 'Подтвердите почту',
    locals: {
      id: order._id,
      product: {
        title: order.product.title,
      },
    },
    template: 'order-confirmation',
  });

  ctx.statusCode = 200;
  ctx.body = {order: order._id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user._id}).populate('product');
  ctx.status = 200;
  ctx.body = {orders};
};
