const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


require('dotenv').config()


async function register(req, res){
     const {name, email, gender, password} = req.body;

     if (!name || !email || !gender || !password) {
        return res.status(400).json({message: "All fields are required"});
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });

    } else if ( !/[A-Z]/.test(password) || !/[a-z]/.test(password)){
         return res.status(400).json({
            message: "Password must contain both uppercase and lowercase letters"
        });

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({message: "Invalid email format"});

    } else if (name.length < 3) {
        return res.status(400).json({message: "Name must be at least 3 characters"});
    }


let exists = false;

try {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    exists = rows.length > 0;

} catch (error) {
    console.error('Error checking existence:', error);
    throw error;
}

if (exists) {
    return res.status(400).json({
        "success": false,
        "message": "User already exists"
    });
}

  
    const hashedPassword = await bcrypt.hash(password, 12)
    

try {
    const [result] = await pool.execute(
  'INSERT INTO users (name, email, password, gender) VALUES (?, ?, ?, ?)', 
  [name, email, hashedPassword, gender]
);
 
return res.status(201).json({
      success: true,
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }

    
}


async function login(req, res) {

    const token = jwt.sign({userId: req.data.id, currentUser: req.data.name}, process.env.JWT_SECRET, {expiresIn: '1h'})

    const userId = req.data.id
    const currentUser = req.data.name
    
    if(req.user){
        return res.status(200).json({
        "success": true,
        "message": "Login Successfully",
        "token": token,
        "userId": userId,
        "currentUser": currentUser
    })
    }
    
}



module.exports = {
    register,
    login
}