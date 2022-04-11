// 对于文章类表单数据的验证规则模块
const joi = require('joi')

// 定义 分类名称 和 分类别名 的校验规则
// const username =joi.string().required()
const name = joi.string().required()
const alias = joi.string().alphanum().required()

exports.add_cate_schema = {
    body: {
        name,
        alias,
    }

}

// 对id验证规则定义
const id = joi.number().integer().min(1).required()
exports.delete_cate_schema_id = {
    params: {
        id,
    }
}

// 对name验证
exports.delete_cate_schema_name = {
    params: {
        name
    }
}

//校验规则对象 - 根据 Id 获取分类
exports.get_cate_schema = {
    params: {
        id,
    },
}

// 校验规则对象 - 更新分类
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias,
    },
}



