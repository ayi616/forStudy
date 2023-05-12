const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: false }))
const router = require('./apiRouter')

app.use(router)

app.use('/api', router)


app.listen(80, () => {
  console.log('lisetn')
})