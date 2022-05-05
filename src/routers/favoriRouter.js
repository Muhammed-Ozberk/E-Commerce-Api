const router = require('express').Router();
const favori_controller = require('../controllers/favoriController');
const tokenMiddleware = require('../middleware/tokenMiddleware');


router.post('/favoriAdd',tokenMiddleware, favori_controller.favoriAdd);
router.post('/favoriRemove',tokenMiddleware, favori_controller.favoriRemove);
router.get('/favoriList',tokenMiddleware, favori_controller.favoriList);


module.exports = router;