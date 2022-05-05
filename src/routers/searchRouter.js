const router = require('express').Router();
const search_controller = require('../controllers/searchController');

router.post('/search', search_controller);

module.exports = router;