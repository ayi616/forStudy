const express = require('express')
const app = express()

// const mw = function(req, res, next) {
//   console.log('中间件')
//   next()
// }

// app.use(mw)

// app.get('/user', (req, res) => {
//   console.log('get request')
//   res.send('request success')
// })

const qs = require('querystring')

app.use((req, res, next) => {
  let str = ''

  req.on('data', (chunk) => {
    str += chunk
  })
  
  req.on('end', () => {
    // console.log(str)
    const body = qs.parse(str)
    console.log(body, 'body')
    req.body = body
    next()
  })
})

app.post('/', (req, res) => {
  res.send(req.body)
})

app.listen(80, () => {
  console.log('listen')
})