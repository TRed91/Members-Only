const { Router } = require('express');
const signupController = require('../controllers/signupController');

const router = Router();

router.get('/', signupController.pageGet);
router.post('/', signupController.createUserPost);

module.exports = router;