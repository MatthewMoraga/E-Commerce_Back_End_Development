const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
// find all products
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }]
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "no products" });
  }
});

// get one product
// find a single product by its `id`
// be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
      !product
      ? res.status(404).json({ message: "no product" })
      : res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "no product" });
  }
});

// create new product
/* req.body should look like this...
  {
    product_name: "Basketball",
    price: 200.00,
    stock: 3,
    tagIds: [1, 2, 3, 4]
  }
*/
// if there's product tags, we need to create pairings to bulk create in the ProductTag model
// if no product tags, just respond
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// commented this code out for my verion of update cause amount of nested promises

// // update product
// router.put('/:id', (req, res) => {
//   // update product data
//   Product.update(req.body, {
//     where: {
//       id: req.params.id,
//     },
//   })
//     .then((product) => {
//       // find all associated tags from ProductTag
//       return ProductTag.findAll({ where: { product_id: req.params.id } });
//     })
//     .then((productTags) => {
//       // get list of current tag_ids
//       const productTagIds = productTags.map(({ tag_id }) => tag_id);
//       // create filtered list of new tag_ids
//       const newProductTags = req.body.tagIds
//         .filter((tag_id) => !productTagIds.includes(tag_id))
//         .map((tag_id) => {
//           return {
//             product_id: req.params.id,
//             tag_id,
//           };
//         });
//       // figure out which ones to remove
//       const productTagsToRemove = productTags
//         .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
//         .map(({ id }) => id);

//       // run both actions
//       return Promise.all([
//         ProductTag.destroy({ where: { id: productTagsToRemove } }),
//         ProductTag.bulkCreate(newProductTags),
//       ]);
//     })
//     .then((updatedProductTags) => res.json(updatedProductTags))
//     .catch((err) => {
//       // console.log(err);
//       res.status(400).json(err);
//     });
// });

// update product

// no need for all those arrow functions and promises when you can just async await given the proper conditions for your update route.
// you can just use findall and map to find and update what you need
// and then just filter tag_ids so that it knows what to search for in a model
// then destroy removes the old instances
// bulk create allows you to create multiple instances 
// I just thought that it was more effecient to do it this way
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } }); 

    if (req.body.tags && req.body.tags.length > 0) {
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = await productTags.map(({ tag_id }) => tag_id);

      const newProductTags = req.body.tags
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
      });

      const removeProductTags = productTags
        .filter(({ tag_id }) => !req.body.tags.includes(tag_id))
        .map(({ id }) => id)

        await Promise.all([
          ProductTag.destroy({ where: { id: removeProductTags } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }

      const product = await Product.findByPk(req.params.id, { include: [{ model: Tag }] });
      return res.json(product);

  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// delete one product by its `id` value
// error checking to see if there was a product
router.delete('/:id', async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({ where: { id: req.params.id } });
    !deleteProduct
    ? res.status(404).json({ message: "no id" })
    : res.status(200).json({ message: "product deleted" });
  } catch (err) {
    res.status(500).json({ message: "no product deleted", error: err });
  }
});

module.exports = router;
