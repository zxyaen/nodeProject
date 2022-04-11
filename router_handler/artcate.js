
// 获取文章分类列表路由函数
exports.getArtCates = (req, res) => {
    // 获取文章分类列表数据
    const db = require('../db/index')
    const sqlCates = 'select * from ev_article_cate where is_delete=0 order by id'
    db.query(sqlCates, (err, results) => {
        if (err) return res.send(err)
        res.send({
            status: 0,
            mes: '获取文章分类列表成功',
            data: results
        })
    })
    console.log('okhq');
}

// 添加文章分类路由函数
exports.addArtCates = (req, res) => {
    const db = require('../db/index')
    // 查询分类别名是否被占用
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where name=? or alias=?`

    // 执行查重操作
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
    })

    // TODO：新增文章分类
    const sqlAddArtCates = ' insert into ev_article_cate set ? '
    db.query(sqlAddArtCates, req.body, (err, results) => {
        if (err) return res.cc(err.message)

        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')

        // 新增文章分类成功
        res.cc('新增文章分类成功！', 0)

    })
}

// 添加文章删除函数
exports.deleteArtCates = (req, res) => {
    console.log('ok');
    const db = require('../db/index')
    const sql = 'update ev_article_cate set is_delete =1 where id =?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err.message)
        res.send('删除文章分类成功')
    })
    // res.send(req.params)
    // res.send('ok')

}

// 获取文章分类数据
exports.getArtCateById = (req, res) => {
    console.log('fl');
    const db = require('../db/index')
    const sql = `select * from ev_article_cate where id=?`
    // res.send('okkk')
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')

        // 把数据响应给客户端 
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results[0],
        })
    })
}

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 引入数据库
    const db =require('../db/index')

    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`
    // 执行查重操作
    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称 和 分类别名 都被占用
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分类名称 或 分类别名 被占用
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // TODO：更新文章分类
        const sql = `update ev_article_cate set ? where id=?`
        db.query(sql, [req.body, req.body.id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')

            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })
    })
    // res.send('ok')
}