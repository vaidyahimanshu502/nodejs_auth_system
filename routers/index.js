const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

//home page route
router.get('/', homeController.SignUpBtn);

router.use('/user', require('./users'));

module.exports = router;