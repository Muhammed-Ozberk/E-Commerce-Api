const router = require('express').Router();
const auth_router = require('./authRouter');
const slider_router = require('./sliderRouter');
const category_router = require('./categoryRouter');
const cart_router = require('./cartRouter');
const favori_router = require('./favoriRouter');
const search_router = require('./searchRouter');


router.use('/', slider_router);
router.use('/', auth_router);
router.use('/', category_router);
router.use('/', cart_router);
router.use('/', favori_router);
router.use('/', search_router);


module.exports = router;