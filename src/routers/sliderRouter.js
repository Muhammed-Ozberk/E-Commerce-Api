const router = require('express').Router();
const slider_controller = require('../controllers/sliderController');


router.get('/slider', slider_controller);



module.exports = router;