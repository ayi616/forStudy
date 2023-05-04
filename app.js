const express = require('express')
const cors = require('cors')
const joi = require('joi')
const config = require('./config')
// 解析token的中间件
const expressJWT = require('express-jwt')

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.msg = (message, status = 1, data = {}) => {
    res.send({
      status,
      message,
      ...data
    })
  }
  next()
})

// 使用unless指定哪些接口不需要进行token身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')

app.use('/api', userRouter)
app.use('/my', userinfoRouter)

app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) {
    return res.msg(err.message)
  }
  if (err.name === 'UnauthorizedError') {
    return res.msg('身份认证失败')
  }
  res.msg(err.message)
})

app.listen(8088, () => {
  console.log('running')
})