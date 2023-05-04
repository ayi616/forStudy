const express = require('express')

const userHandler = require('../router_handler/user')

// 导入验证数据的中间件 
const expressJoi = require('@escook/express-joi')

// 导入需要的验证规则对象
const { formSchema } = require('../schema/user')

const router = express.Router()

router.post('/register', expressJoi(formSchema), userHandler.register)

router.post('/login', expressJoi(formSchema), userHandler.login)

module.exports = router