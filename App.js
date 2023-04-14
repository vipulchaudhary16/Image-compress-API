const express = require('express')
const app = express()
require("dotenv").config()
const cors = require('cors')
const PORT = 8001 
app.use(cors())
app.use(express.json()) //to use body json

app.get("/", (req, res) => {
    res.send("API is running fine")
})

app.use('/file', require('./routes/file'))


app.listen(PORT, () => {
    console.log("Listening on ", PORT)
})