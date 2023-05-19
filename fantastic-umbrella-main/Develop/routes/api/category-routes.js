const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categories = await Category.findAll({include: [Product]});
    res.json(categories);
  } catch (err) {
    res.json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const targetCategory = await Category.findByPk(req.params.id, {
      include: [Product]
    });
    res.json(targetCategory);
  } catch (err) {
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.json(newCategory);
  } catch (err) {
    res.json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const updatedCategory = await Category.update(req.body, {where: {
      id: req.params.id
    }});
    res.json(updatedCategory);
  } catch (err) {
    res.json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = await Category.destroy({where: {id: req.params.id}});
    res.json(deletedCategory);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
