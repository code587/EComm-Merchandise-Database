const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async(req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagInfo = await Tag.findAll({
    include: [{model: Product}, {model: ProductTag}],
    });
   res.status(200).json(tagInfo);
} catch (err) {
  res.status(500).json(err);
}
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagInfo = await Tag.findByPk(req.params.id, {
      include: [{ model: ProductTag, through: Product, as: 'productTag_data' }]
});
    if (tagInfo) {
      res.status(404).json({ message: 'There is no tag with this id.' });
      return;
    }
    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
  try {
    const tagInfo = await Tag.create(req.body);
    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagInfo = await Tag.put(req.body,)({
      where: {
        id: req.params.id
      }
});
if (!tagInfo) {
res.status(404).json({ message: 'There is no tag with this id.' });
return;
}
res.status(200).json(tagInfo);
} catch (err) {
res.status(500).json(err);
}
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagInfo = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tagInfo) {
      res.status(404).json({ message: 'There is no tag with this id.' });
      return;
    }

    res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
