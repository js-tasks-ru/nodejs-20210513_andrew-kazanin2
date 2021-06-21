const Product = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  /**
   * example request http://localhost:3000/api/products?subcategory=mysubcategory
   */

  const {request: {query: {subcategory} = {}}} = ctx || {};

  if (subcategory) {
    const products = await Product.find({subcategory});
    ctx.body = {products};
    ctx.status = 200;
  }
};

module.exports.productList = async function productList(ctx, next) {
  /**
   * example request http://localhost:3000/api/products
   */

  const products = await Product.find({});
  ctx.body = {products};
  ctx.status = 200;
};

module.exports.productById = async function productById(ctx, next) {
  /**
   * example wrong request http://localhost:3000/api/products/18
   * example true request http://localhost:3000/api/products/5d208e631866a7366d831ffc
   */

  const {params: {id} = {}} = ctx || {};

  if (ObjectId.isValid(id)) {
    const product = await Product.findOne({_id: id});
    ctx.body = {product};
    ctx.status = 200;
  } else {
    ctx.status = 404;
    ctx.res.end('Wrong product id');
  }
};

