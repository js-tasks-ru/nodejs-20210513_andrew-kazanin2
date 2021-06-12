const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  /**
   * example request http://localhost:3000/api/products?query=Product1
   */

  const {query: {query} = {}} = ctx || {};

  if (query) {
    const products = await Product.find({$text: {$search: query}, score: {$meta: 'searchScore'}});
    ctx.status = 200;
    ctx.body = {products};
  }
};
