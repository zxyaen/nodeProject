// 个人中心模块

// 初始化 路由 模块
const express = require('express')
const router = express.Router()
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证数据合法性的模块
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { update_userinfo_schema } = require('../schema/user')
const { update_password_schema } = require('../schema/user')
const { update_avatar_schema } = require('../schema/user')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

// 重置密码
router.post('/updatepwd',expressJoi(update_password_schema), userinfo_handler.updatePassword)

// 更新用户头像
router.post('/updateicon',expressJoi(update_avatar_schema),userinfo_handler.updateIcon)

// // 测试路由
// router.post('/test',userinfo_handler.test)

module.exports = router