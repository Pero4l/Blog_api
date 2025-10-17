const express = require('express');
const router = express.Router();
const { createPost, getAllPost } = require('../controllers/postController');
const{authMiddleware} = require('../middlewares/authUserMiddlewar')

router.post('/create', authMiddleware, createPost);
router.get('/seeall', authMiddleware, getAllPost)



module.exports = router;
