const pool = require('../db')

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
console.log(user_id);


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

module.exports = {createPost, getAllPost}