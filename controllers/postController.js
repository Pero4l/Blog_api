const pool = require('../db');

async function createPost(req, res) {
    const {title, content} = req.body

    if(!title, !content){
        return res.status(400).json({
            success: false,
            message: "All field are required"
        });
    }

let post = false;

try {
    const [rows] = await pool.execute(
        'SELECT * FROM posts WHERE title = ? AND content = ?',
        [title, content]
    );

    post = rows.length > 0;

} catch (error) {
    console.error('Error checking existence:', error);
    throw error;
}

const user = req.user
const user_id = user.userId


if (post) {
    return res.status(400).json({
        "success": false,
        "message": "Post already exists" 
    });
}else{
    try{
        const [result] = await pool.execute('INSERT INTO posts(user_id, title, content)VALUES(?,?,?)',
            [user_id,title,content]
        )


    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      postId: result.insertId
    })

    } catch (error){
        console.error('Error making post:', error);
        throw error;
    }
}


}


async function getAllPost(req, res) {
    

    try{
        const [rows] = await pool.query('SELECT * FROM posts')

        return res.status(200).json({
            "success": true,
            "message": "Gotten all post successfully",
            "posts": rows
        })
    } catch(err){
        console.error(err);
    return res.status(500).json({ 
        "success": false, 
        "message": 'Error getting posts' });
  
    }

}


async function seeSinglePost(req, res) {
    const {id} = req.params

    try{
        const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?',
            [id]
        )

        return res.status(200).json({
            "success": true,
            "message": "Post gotten successfully",
            "posts": rows[0]
        })
    } catch(err){
        console.error(err);
    return res.status(500).json({ 
        "success": false, 
        "message": 'Error getting post' });
  
    }


}


async function deletePost(req, res) {
    const {id} = req.body

    const user_id = req.user.userId

    try{
        const[result] = await pool.execute('DELETE FROM posts WHERE id = ? AND user_id = ?',
            [id, user_id]
        )


        if (result.affectedRows === 0) {
           
            return res.status(404).json({ 
                "sucess": false,
                "message": `Post with ID ${id} not found.` 
            });
        }

        
        res.status(200).json({ 
            "sucess": true,
            "message": `Post with ID ${id} deleted successfully.`,
            "deletedRows": result.affectedRows
        });
    } catch(err){
        console.error('Database delete error:', err);
        res.status(500).json({ 
            "success": false,
            "message": 'Error during deletion.' });
    }


}


async function comment(req, res) {
    const {id} = req.params
    const {comment} = req.body
    const user_id = req.user.userId

    try {
        // Check if post exists
        const [post] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        
        if (post.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Add comment
        const [result] = await pool.execute(
            'INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)',
            [id, user_id, comment]
        );

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            commentId: result.insertId
        });

    } catch(err) {
        console.error('Error adding comment:', err);
        return res.status(500).json({
            success: false,
            message: 'Error adding comment'
        });
    }
}

module.exports = {createPost, getAllPost, seeSinglePost, deletePost, comment}