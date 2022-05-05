const router = require('express').Router();
const auth_controller = require('../controllers/authController');
const tokenMiddleware = require('../middleware/tokenMiddleware');
const multer = require('../config/multer');

router.post('/register', auth_controller.register);
router.post('/login', auth_controller.login);
router.get('/userInfo', tokenMiddleware, auth_controller.userInfo);
router.post('/userUpdate', tokenMiddleware, auth_controller.userUpdate);
router.post('/resetPassword', tokenMiddleware, auth_controller.resetPassword);
router.post('/avatarAdd', tokenMiddleware, multer.single('avatar'), auth_controller.avatarAdd);


module.exports = router;