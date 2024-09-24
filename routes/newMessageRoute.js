const { Router } = require('express');
const controller = require('../controllers/msgFormController');
const router = Router();

router.get('/', controller.newMsgPageGet);
router.post('/', controller.newMsgPagePost);

module.exports = router;