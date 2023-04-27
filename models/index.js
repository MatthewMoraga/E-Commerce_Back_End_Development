// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// setting the relationship between product and tag through association according to the readme specs

// Products belongsTo Category

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

// Categories have many Products

Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: "product_id",
});

// Products belongToMany Tags (through ProductTag)

Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: "tag_id",
});

// Tags belongToMany Products (through ProductTag)

Category.hasMany(Product, {
  foreignKey: "category_id",
});

// Exporting 

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
