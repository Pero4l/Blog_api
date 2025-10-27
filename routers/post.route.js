const express = require('express');
const router = express.Router();
const { createPost, getAllPost, seeSinglePost, deletePost, comment } = require('../controllers/postController');
const{authMiddleware} = require('../middlewares/authUserMiddlewar')

router.post('/create', authMiddleware, createPost);
router.get('/all', authMiddleware, getAllPost);
router.delete('/delete', authMiddleware, deletePost)
router.post('/comment/:id', authMiddleware, comment);
router.get('/:id', authMiddleware, seeSinglePost);



module.exports = router;
