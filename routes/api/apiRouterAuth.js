const express = require('express')

const router = express.Router();

const authController = require('../../controllers/api/authCtrApi');

router.post('/authenticate', authController.authenticate);
router.post('forgotPassword', authController.forgotPassword);

module.exports = router;