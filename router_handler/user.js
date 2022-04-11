// 处理路由处理函数
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../db/index')
// 导入jwt包，用来生成jwt
const jwt = require('jsonwebtoken')


exports.regUser = (req, res) => {
    // 注册
    // 1.检测表单数据是否合法
    const userinfo = req.body

    if (!userinfo.username || !userinfo.password) {
        // return res.send({
        //     status: 1,
        //     mes: '用户名和密码不能为空'
        // })
        return res.cc('用户名和密码不能为空')
    }
    // 2.检测用户名是否被占用
    const db = require('../db/index')
    const sqlSelect = `select * from ev_users where username=?`
    db.query(sqlSelect, [userinfo.username], (err, results) => {
        if (err) {
            // return res.send({
            //     status: 1,
            //     mes: err.message
            // })
            return res.cc('err')
        }
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     mes: '用户名被占用，请换用其他用户名'
            // })
            return res.cc('用户名被占用，请换用其他用户名')
        }
    })
    // 3.对密码进行加密处理
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    // 4.插入新用户
    const sqlSertin = `insert into ev_users set ?`
    db.query(sqlSertin, { username: userinfo.username, password: userinfo.password }, (err, results) => {
        if (err) {
            // return res.send({
            //     status: 1,
            //     mes: err.message
            // })
            return res.cc(err)
        }
        if (results.affectedRows !== 1) {
            return res.send({
                status: 1,
                mes: '注册失败'
            })
        }
        res.send({
            status: 0,
            mes: '注册成功'
        })
    })
    // res.send('reguser OK')
}

exports.login = (req, res) => {
    // 登录模块
    // 1.检测表单数据是否合法
    // TODO：在user router模块路由中定义
    // 2.根据用户名查询用户的数据
    const userinfo = req.body
    const sqlLogin = `select * from ev_users where username=?`
    db.query(sqlLogin, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return req.cc(err)
        }
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！用户名不匹配')
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致

        // 3.判断用户输入的密码是否正确
        // 核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致  返回值是布尔值（true 一致、false 不一致）
        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)

        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！密码不匹配')
        }
        // TODO：登录成功，生成 Token 字符串



        // 4.生成 JWT 的 Token 字符串
        // 剔除密码和头像的值，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '', user_pic: '' }

        // console.log('login OK');

        // 将用户对象生成加密token字符串
        const config = require('../config')
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // token 有效期为 10 个小时
        })

        // 将生成token字符串响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
        })
        // console.log(userinfo);
    })
}
