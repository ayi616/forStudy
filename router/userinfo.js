const express = require('express')

const userinfoHandler = require('../router_handler/userinfo')
// 导入验证数据的中间件 
const expressJoi = require('@escook/express-joi')
const { infoSchema, pwdSchema, avatarSchema } = require('../schema/user')

const router = express.Router()

router.get('/userinfo', userinfoHandler.getInfo)

router.post('/update/info', expressJoi(infoSchema), userinfoHandler.updateinfo)

router.post('/update/pwd', expressJoi(pwdSchema), userinfoHandler.updatepwd)

router.post('/update/avatar', expressJoi(avatarSchema), userinfoHandler.updateavatar)

module.exports = router