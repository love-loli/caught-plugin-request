const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
// 200
app.get('/200', (req, res) => {
  res.status(200).json({
    success: true,
    code: '02000100',
    data: null,
  })
})
app.post('/200', (req, res) => {
  res.status(200).json({
    success: true,
    code: '02000100',
    data: null,
  })
})

// 500
app.get('/500', (_, res) => {
  res.status(500).send('Internal Server Error')
})

// 401
app.get('/401', (_, res) => {
  res.status(401).send('Please login in')
})

app.listen(port, () => {
  console.info('Test server has been started')
})
