const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/auth');
const { checkDuplicateUsername } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/signup', checkDuplicateUsername, authController.postSignup);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);

module.exports = router;
