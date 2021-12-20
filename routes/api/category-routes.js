const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async(req, res) => {
   // find all categories
  // be sure to include its associated Products
  //Do I need attributes and sequelize literal... not understanding attributes yet
  try {
    const categoryInfo = await Category.findAll({
    include: [{model: Product}, {model: ProductTag}],
    });
   res.status(200).json(categoryInfo);
} catch (err) {
  res.status(500).json(err);
}
});


router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryInfo = await Category.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'product_data' }]
});
    if (!categoryInfo) {
      res.status(404).json({ message: 'There is no category with this id.' });
      return;
    }
    res.status(200).json(categoryInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
  try {
    const categoryInfo = await Category.create(req.body);
    res.status(200).json(categoryInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
    try {
      const categoryInfo = await Category.put(req.body,)({
        where: {
          id: req.params.id
        }
});
if (!categoryInfo) {
  res.status(404).json({ message: 'There is no category with this id.' });
  return;
}
res.status(200).json(categoryInfo);
} catch (err) {
res.status(500).json(err);
}
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
    try {
      const categoryInfo = await Category.destroy({
        where: {
          id: req.params.id
        }
      });
  
      if (!categoryInfo) {
        res.status(404).json({ message: 'There is no category with this id.' });
        return;
      }
  
      res.status(200).json(categoryInfo);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
