// 个人中心路由函数模块
// 初始化 路由处理函数 模块
const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const bcrypt = require('bcryptjs')

// 获取用户基本信息
exports.getUserInfo = function (req, res) {
    // 导入数据库操作模块
    const db = require('../db/index')
    const sqlUserInfo = 'select id,username, nickname, email, user_pic from ev_users where id=?'
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sqlUserInfo, req.user.id, (err, results) => {
        if (err) return res.cc(err)

        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc('获取用户信息失败！')

        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })

    })
}

// 更新用户内容处理函数
exports.updateUserInfo = function (req, res) {
    // 导入数据库操作模块
    const db = require('../db/index')
    const sqlUpdate = `update ev_users set ? where id=?`
    db.query(sqlUpdate, [req.body, req.user.id], (err, results) => {
        // res.send(req.body)
        // 执行 SQL 语句失败
        // res.send(req.user)
        if (err) return res.cc(err.message)

        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')

        // 修改用户信息成功 
        return res.cc('修改用户基本信息成功！', 0)
    })
    // res.send("oks")
}

// 重置密码的处理函数
exports.updatePassword = function (req, res) {
    const db = require('../db/index')
    const sqlPwd = `select * from ev_users where id=?`
    db.query(sqlPwd, req.user.id, (err, results) => {
        // res.send(results)
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在！')

        // TODO：判断提交的旧密码是否正确
        // 在头部区域导入 bcryptjs 后，
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        const bcrypt = require('bcryptjs')

        // res.send(req.body)

        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldpwd, results[0].password)
        // res.send(compareResult)  false

        if (!compareResult) return res.cc('原密码错误，请重新输入')

        // TODO：对新密码加密后，更新到数据库中
        // 定义更新用户密码的 SQL 语句
        const sqlNewPwd = `update ev_users set password=? where id=?`

        // 对新密码进行 bcrypt 加密处理
        const newpwd = bcrypt.hashSync(req.body.newpwd, 10)

        // 执行 SQL 语句，根据 id 更新用户的密码
        db.query(sqlNewPwd, [newpwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')

            // 更新密码成功
            res.cc('更新密码成功！', 0)
        })
    })
    // res.send('p')
}

// 更新用户头像按钮
exports.updateIcon = function (req, res) {
    const db = require('../db/index')
    const sqlIcon = 'update ev_users set user_pic=? where id=?'
    db.query(sqlIcon, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')

        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })
    // res.send('ok')
}