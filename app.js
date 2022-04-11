// 项目入口文件
const express = require('express')
const app = express()

const joi = require('joi')

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 配置跨域
const cors = require('cors')
app.use(cors())



// 优化res.send（）
// 封装了一个err中间件，并全局注册
app.use(function (req, res, next) {
    // status默认值为1，表示失败情况
    // err的值可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            mes: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 导入数据库模块
const db = require('./db/index')

// 解析token中间件
// ！！！ 在配置token中间件时，会将user属性自动挂载到req上，全局配置
const expressJWT =require('express-jwt')
const config =require('./config')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入并注册登录注册路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并注册个人中心路由模块
const userInfoRouter =require('./router/userinfo')
// 以my开头的接口，都需要权限，需要带token
app.use('/my',userInfoRouter)

// 导入并注册文章分类模块
const artCateRouter =require('./router/artcate')
app.use('/my/article',artCateRouter)

// 导入注册文章管理模块
const articlesRouter =require('./router/article')
app.use('/my/article',articlesRouter)



// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err) 
     // 未知错误
    res.cc(err)
})

app.listen(3080, () => {
    console.log('app is running');
})
