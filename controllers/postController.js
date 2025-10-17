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
        'SELECT * FROM post WHERE title = ? AND content = ?',
        [title, content]
    );

    post = rows.length > 0;

} catch (error) {
    console.error('Error checking existence:', error);
    throw error;
}

if (post) {
    return res.status(400).json({
        "success": false,
        "message": "Post already exists" 
    });
}


}