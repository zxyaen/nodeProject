const express = require('express')
const router = express.Router()

const router_handler = require('../router_handler/artcate')

// 导入验证数据中间件
const expressJoi = require('@escook/express-joi')
// 导入表单验证模块
const { add_cate_schema } = require('../schema/artcate')

const {get_cate_schema}=require('../schema/artcate')
const{delete_cate_schema_id}=require('../schema/artcate')
const{update_cate_schema}=require('../schema/artcate')



// 获取文章分类列表路由
router.get('/cates', router_handler.getArtCates)

// 新增文章分类路由
router.post('/addcates', expressJoi(add_cate_schema), router_handler.addArtCates)



// 根据id获取文章接口
router.get('/cates/:id',expressJoi(get_cate_schema),router_handler.getArtCateById)

// 根据id更新编辑文章分类
router.post('/updatecates',expressJoi(update_cate_schema),router_handler.updateCateById)

// 文章删除路由
router.get('/deletecates/:id',expressJoi(delete_cate_schema_id),router_handler.deleteArtCates)

// router.post('/app',router_handler.addArtCates)




module.exports = router