const router = require('express').Router();
const res = require('express/lib/response');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // finds all tags and includes associated Product info
  try {
    const tagInfo = await Tag.findAll({
    include: [{model: Product}],
    });
   res.status(200).json(tagInfo);
} catch (err) {
  res.status(400).json(err);
}
});

router.get('/:id', async (req, res) => {
 // find a tag by id
  try {
    const tagInfo = await Tag.findByPk(req.params.id, {
      include: [{ model: Product}]
});
      res.status(200).json(tagInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  // creates a new tag
  try{
    const tagInfo = await Tag.create (req.body,);
  res.status(201).json(tagInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // updates product data
     Tag.update(req.body,  {
      where: {
        id: req.params.id, 
      },
    })
      .then((tag) => {
        return ProductTag.findAll({ where: { tag_id: req.params.id } });
      })
      .then((productTags) => {
        // gets a list of current tag_ids
        const productTagIds = productTags.map(({ product_id }) => product_id);
        // creates filtered list of new tag_ids
        const newProductTags = req.body.productIds
          .filter((product_id) => !productTagIds.includes(product_id))
          .map((product_id) => {
            return {
              tag_id: req.params.id,
              product_id,
            };
        });
       
      //determines which ones to remove
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      // runs both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedTags) => res.json(updatedTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // deletes a tag by id
  try {
    const deleteTagInfo = await Tag.destroy({
      where: {id: req.params.id},
    })
  res.status(200).json(deleteTagInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
