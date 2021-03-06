const router = require('express').Router();
const res = require('express/lib/response');
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint


router.get('/', async (req, res) => {
  // find all products using associated Category and Tag info
  try {
    const productInfo = await Product.findAll({
    include: [{model: Category}, {model: Tag}],
    });
   res.status(200).json(productInfo);
} catch (err) {
  res.status(500).json(err);
}
});

router.get('/:id', async (req, res) => {
  // finds a single product using id
  try {
    const productInfo = await Product.findByPk(req.params.id, {
      include: [{ model: Category,}]
});
   
    res.json(productInfo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates a new product
router.post('/', async (req, res) => {
   //req.body should look like the below...
    // {
    //   product_name: "Basketball",
    //   price: 200.00,
    //   stock: 3,
    //   tagIds: [1, 2, 3, 4]
    // }
  Product.create(req.body)
    .then((product) => {
      // creates pairings to the bulkcreate ProductTag model if there is product tag
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(201).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });
  
router.put('/:id', (req, res) => {
  // updates product info
     Product.update(req.body,  {
      where: {
        id: req.params.id, 
      },
    })
      .then((product) => {
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((productTags) => {
        // gets list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // creates filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
        });
       
      //determines which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // runs both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // deletes a product by id
  try {
  const deleteProductInfo = await Product.destroy({
    where: {id: req.params.id},
  })
  res.status(200).json(deleteProductInfo);
  } catch (err) {
    res.status(500).json(err);
  }
  });

module.exports = router;
