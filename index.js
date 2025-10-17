const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).json({
        "sucess": true,
        "message": "Welcome to my blog post"
    })
})



const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
    
})