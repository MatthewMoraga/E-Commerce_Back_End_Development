const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);

// we need to add routes for the models so that they can be used by the paths and route files

router.use("/categories", categoryRoutes),
router.use("/products", productRoutes);
router.use("/tags", tagRoutes);

// exporting

module.exports = router;
