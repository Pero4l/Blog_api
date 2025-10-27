const express = require('express');
const router = express.Router();
const { createPost, getAllPost, seeSinglePost, deletePost } = require('../controllers/postController');
const{authMiddleware} = require('../middlewares/authUserMiddlewar')

router.post('/create', authMiddleware, createPost);
router.get('/all', authMiddleware, getAllPost);
router.delete('/delete', authMiddleware, deletePost)
router.get('/:id', authMiddleware, seeSinglePost);



module.exports = router;
