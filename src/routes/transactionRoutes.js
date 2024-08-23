const express = require('express');
const transactionController = require('../controllers/transactionController.js');

const router = express.Router();

router.post('/transaction', transactionController.createTransaction);
router.get('/transaction/:id', transactionController.getTransaction);

module.exports = router;