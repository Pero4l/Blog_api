const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())

const authUser = require('./router/user.route')
const getUsers = require('./router/user.route')

app.get('/', (req, res) => {
    res.status(200).json({
        "sucess": true,
        "message": "Welcome to my blog post"
    })
})


app.use('/auth', authUser)
app.use('/users', getUsers)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
    
})