const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({include: [Product]});
    res.json(tags);
  } catch(err) {
    res.json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const taragetTag = await Tag.findByPk(req.params.id, {
      include: [Product]
    });
    res.json(taragetTag);
  } catch (err) {
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.json(tagData);
  } catch (err) {
    res.json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      if (req.body.tag_name && req.body.tag_name.length) {

        Tag.findAll({
          where: { tag_id: req.params.id }
        }).then((tags) => {
          // create filtered list of new tag_ids
          const tagIds = Tags.map(({ tag_id }) => tag_id);
          const newTags = req.body.tag_name
            .filter((tag_id) => !tagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                tag_name: req.params.name,
                tag_id,
              };
            });

          // figure out which ones to remove
          const tagsToRemove = tags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: tagsToRemove } }),
            ProductTag.bulkCreate(newTags),
          ]);
        });
      }
      return res.json(tag);
    }).catch((err) => {
        res.json(err);
    });    
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({where: {id: req.params.id}});
    res.json(deletedTag);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
