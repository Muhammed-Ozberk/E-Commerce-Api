const router = require('express').Router();
const category_controller = require('../controllers/categoryController');

router.get('/categories', category_controller.category);
router.post('/productsList', category_controller.productsList);
router.post('/productDetail', category_controller.productDetail);


module.exports = router;