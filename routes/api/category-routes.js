const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
   // find all categories
  // be sure to include its associated Products
  //Do I need attributes and sequelize literal... not understanding attributes yet
  try {
    const categoryInfo = await Category.findAll({
    include: [{model: Product}],
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
      include: [{ model: Product}]
});
    
    res.json(categoryInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryInfo = await Category.create(req.body,);
    res.status(200).json(categoryInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      category_name: req.body.category_name,
      id: req.body.id,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((updatedCategory) => {
      res.json(updatedCategory);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});


router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deleteCategoryInfo = await Category.destroy({
    where: {id: req.params.id}
  })
      res.status(200).json(deleteCategoryInfo);
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
