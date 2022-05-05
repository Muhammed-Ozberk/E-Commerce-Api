const router = require('express').Router();
const cart_controller = require('../controllers/cartController');
const tokenMiddleware = require('../middleware/tokenMiddleware');

router.post('/cartAdd',tokenMiddleware, cart_controller.cartAdd);
router.get('/cartBring',tokenMiddleware, cart_controller.cartBring);
router.post('/cartDelete', tokenMiddleware, cart_controller.cartDelete);
router.post('/cartDecrease', tokenMiddleware, cart_controller.cartDecrease);
router.get('/cartEmpty',tokenMiddleware, cart_controller.cartEmpty);


module.exports = router;