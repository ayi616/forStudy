const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')


exports.getInfo = (req, res) => {
  const infoSql = 'select id, username, nickname, email, user_pic from node_users where id = ?'
  db.query(infoSql, [req.user.id], (err, result) => {
    if (err) {
      return res.msg(err.message)
    }
    if (result.length !== 1) {
      return res.msg('获取用户信息失败')
    }

    res.msg('获取用户信息成功', 0, { data: result[0] })
  })
}

exports.updateinfo = (req, res) => {
  const updateSql = 'update node_users set ? where id = ?'
  db.query(updateSql, [req.body, req.body.id], (err, result) => {
    if (err) {
      return res.msg(err.message)
    }
    if (result.affectedRows !== 1) {
      return res.msg('修改用户基本信息失败！')
    }

    res.msg('修改用户基本信息成功', 0)
  })
}

exports.updatepwd = (req, res) => {
  const searchSql = 'select * from node_users where id = ?'
  db.query(searchSql, [req.user.id], (err, result) => {
    if (err) {
      return res.msg(err.message)
    }
    if (result.length !== 1) {
      return res.msg('用户不存在！')
    }

    const correct = bcrypt.compareSync(req.body.oldPwd, result[0].password)
    if (!correct) {
      return res.msg('旧密码错误！')
    }

    const updateSql = 'update node_users set password = ? where id = ?'
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(updateSql, [newPwd, req.user.id], (err, result) => {
      if (err) {
        return res.msg(err.message)
      }
      if (result.affectedRows !== 1) {
        return res.msg('更新密码失败！')
      }

      res.msg('更新密码成功！', 0)
    })
  })
}

exports.updateavatar = (req, res) => {
  const searchSql = 'update node_users set user_pic = ? where id = ?'
  db.query(searchSql, [req.body.avatar, req.user.id], (err, result) => {
    if (err) {
      return res.msg(err.message)
    }
    if (result.affectedRows !== 1) {
      return res.msg('更新头像失败！')
    }

    res.msg('更新头像成功！', 0)
  })
}