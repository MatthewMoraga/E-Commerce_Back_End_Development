const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// find all tags
// be sure to include its associated Product data

// find all tags using findAll to include any inside the product model []
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: "no tag" });
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data
// find tag with findByPK with req.params.id
router.get('/:id', async (req, res) => {
  try {
    const tags = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!tags) {
      res.status(404).json({ message: "no tag with this id" });
      return;
    }
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: "no tag" });
  }
});

// create a new tag
// create a new tag with create(req.body)
router.post('/', async (req, res) => {
  try {
    const tags = await Tag.create(req.body);
    res.status(200).json(tags);
  } catch (err) {
    res.status(400).json({ message: "no tag created" });
  }
});

// update a tag's name by its `id` value
// if the tag has a matching id return it if not then give an error 
// update the tage with update(req.body) setting req.params with where clause and id
router.put('/:id', async (req, res) => {
  try {
    const updateTagName = await Tag.update(req.body, {
      where: { id: req.params.id },
    })
    !updateTagName[0]
    ? res.status(404).json({ message: "no tag with matching id"})
    : res.status(200).json(updateTagName);
  } catch (err) {
    res.status(500).json({ message: "tag not updated" });
  }
});

// delete on tag by its `id` value
// pretty much the same as update but delete works with destroy
// if the tag has a matching id return it if not then give an error 

router.delete('/:id', async (req, res) => {
  try {
    const deleteTagById = await Tag.destroy({ where: { id: req.params.id }});
    !deleteTagById
    ? res.status(404).json({ message: "no tag with id match" })
    : res.status(200).json(deleteTagById);
  } catch (err) {
    res.status(500).json({ message: "no tag deleted "})
  }
});

module.exports = router;
