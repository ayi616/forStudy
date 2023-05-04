// 导入定义验证规则的包
const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()


const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()


const avatar = joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则
exports.formSchema = {
  body: {
    username,
    password
  }
}


exports.infoSchema = {
  body: {
    id,
    nickname,
    email
  }
}


// 修改密码的验证规则
exports.pwdSchema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref('oldPwd')).concat(password)
  }
}

exports.avatarSchema = {
  body: {
    avatar
  }
}