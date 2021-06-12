const Categories = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Categories.find({});
  ctx.body = {categories};
  ctx.status = 200;
};
