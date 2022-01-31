// import dotenv and call config function to load environment
require('dotenv').config()
const express = require('express')

const cors = require('cors')
// Get routes to the variabel
const router = require('./src/routes')

const app = express()

const port = 4000

app.use(express.json())
app.use(cors())
// Add endpoint grouping and router
app.use('/api/v1/', router)
// add route here to serving static file
app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
