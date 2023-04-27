const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
// changing these functions to async to include error handling so that user can see if something went wrong
// with try catch to catch errors
// 200 being okay, 500 being internal server error, and 404 being not found.
// wish i had time to add error handling in project 2

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ include: [{ model: Product}] });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: "not found" });
  }
});

// find one category by its `id` value
// be sure to include its associated Products
// using req.params.body with the findbyPK method 
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, { include: [{ model: Product }] });
  if (!category) {
    res.status(404).json({ message: "no id" });
    return;
  }
  res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: "nothing here" });
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const postCategory = await Category.create(req.body);
    res.status(200).json(postCategory);
  } catch (err) {
    res.status(400).json({ message: "post failure" })
  }
});

// update a category by its `id` value
// again it has to be params here cause we're targeting the /:id extension in the url
// since we are trying to update existing properties by matching an id

router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(req.body, { where: { id: req.params.id } });
    !updatedCategory[0]? res.status(404).json({ message: "no id" }) : res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: "no update" });
  }
});

// delete a category by its `id` value
// when the user enters a category and it is not found then return a 404 error 
// on success returns the deleted data

router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({ where: { id: req.params.id } });
    !deletedCategory ? res.status(404).json({ message: "no id" }) : res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
