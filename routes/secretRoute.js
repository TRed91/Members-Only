const { Router } = require('express');
const router = Router();
const controller = require('../controllers/secretController');

router.get('/', controller.secretPageGet);
router.post('/', controller.secretPagePost);

module.exports = router;