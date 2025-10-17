const pool = require('../db')
const bcrypt = require('bcrypt')

async function loginMiddleware(req, res, next){
    const {email, password} = req.body

    let exists = false;
    let user = []
    

try {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    exists = rows.length > 0;
    user = rows


    

} catch (error) {
    console.error('Error checking existence:', error);
    throw error;
}





    if (!exists) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const passMatch = await bcrypt.compare(password, user[0].password)
     if (!passMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    req.user = passMatch
    req.data = user[0]
    next()
}


module.exports = {
    loginMiddleware
}