const router = require('express').Router();
const res = require('express/lib/response');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagInfo = await Tag.findAll({
    include: [{model: Product}],
    });
   res.status(200).json(tagInfo);
} catch (err) {
  res.status(500).json(err);
}
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagInfo = await Tag.findByPk(req.params.id, {
      include: [{ model: Product}]
});
      res.status(200).json(tagInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try{
    const tagInfo = await Tag.create (req.body,);
  res.status(201).json(tagInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const updateTagInfo = await Tag.update({
      where: {id: req.params.id,},
  })
  res.status(200).json(updateTagInfo);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTagInfo = await Tag.destroy({
      where: {id: req.params.id},
    })
  res.status(200).json(deleteTagInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
