//const { required, ref } = require('@hapi/joi');
const express = require('express');
const authController = require('../Controller/authController');
const router = express.Router();
const auhtController = require('../Controller/authController');



router.post('/register',authController.register);


router.post('/login',auhtController.login);


router.post('/refreshToken',auhtController.refreshToken);

router.delete('/logout',auhtController.logout);


module.exports = router;