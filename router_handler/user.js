const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')


exports.register = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // const { username, password } = req.body
  if (!userinfo.username || !userinfo.password) {
    // return res.send({ status: 1, message: '用户名或密码不合法！' })
    return res.msg('用户名或密码不合法！')
  }
  const sqlStr = 'select * from node_users where username = ?'
  db.query(sqlStr, [userinfo.username], (err, result) => {
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.msg(err.message)
    }
    // 判断用户名是否被占用
    if (result.length > 0) {
      // return res.send({ status: 1, message: '该用户名已被占用！' })
      return res.msg('该用户名已被占用！')
    }

    // 对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    const insertUserSql = 'insert into node_users set ?'
    db.query(insertUserSql, { username: userinfo.username, password: userinfo.password }, (err, result) => {
      if (err) {
        // return res.send({ status: 1, message: err.message })
        return res.msg(err.message)
      }

      if (result.affectedRows !== 1) {
        // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
        return res.msg('注册用户失败，请稍后再试！')
      }

      // res.send({ status: 0, message: '注册成功！' })
      res.msg('注册成功！', 0)
    })
  })
}

exports.login = (req, res) => {
  // const userinfo = req.body
  const { username, password } = req.body
  const loginSql = 'select * from node_users where username = ?'
  db.query(loginSql, [username], (err, result) => {
    if (err) {
      return res.msg(err.message)
    }

    if (result.length !== 1) {
      return res.msg('登录失败！')
    }

    const correct = bcrypt.compareSync(password, result[0].password)
    if (!correct) {
      return res.msg('密码错误，登录失败！')
    }

    const user = { ...result[0], password: '', user_pic: '' }
    // 对用户信息进行加密，生成token
    const token = `Bearer ${jwt.sign(user, config.jwtSecretKey, { expiresIn: '24h' })}`
    res.msg('登录成功！', 0, { token })
  })
}