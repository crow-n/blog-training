const fs = require('fs')
const { join } = require('path')

const Article = require('../model/article')
const Comment = require('../model/comment')
const User = require('../model/user')

// 文章 评论 头像上传
exports.index = async (ctx, next) => {
    if(ctx.session.isNew) {
        return next()
    }
    const path = ctx.params.path
    const fnames = fs.readdirSync(join(__dirname, '../views/admin'))
    
    let exist = false
    fnames.forEach(v => {
        const name = v.replace(/^(admin-)|(\.pug)$/g, '')
        if(name === path) {
            exist = true
        }
    })

    if(exist) {
        await ctx.render('admin/admin-' + path, {
            role: ctx.session.role
        })
    } else {
        return next()
    }
}

// 头像上传功能
exports.upload = async ctx => {
    const filePath = '/avatar/' + ctx.req.file.filename

    const data = {}

    await User
        .updateOne({_id: ctx.session.uid}, {$set: {avatar: filePath}})
        .then(res => {
            data.message = '上传成功'
            ctx.session.avatar = filePath
        })
        .catch(err => data.message = '上传失败')

    ctx.body = data
}

// 评论管理 显示列表
exports.cmtList = async ctx => {
    const uid = ctx.session.uid

    const data = await Comment.find({from: uid}).populate('article', 'title')
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

// 评论管理 删除
exports.delCmt = async ctx => {
    const commentId = ctx.request.body.commentId
    const articleId = ctx.request.body.articleId
    const uid = ctx.session.uid

    let isOk = true

    await Comment
        .deleteOne({_id: commentId})
        .catch(err => isOk = false)

    await Article
        .updateOne({_id: articleId}, {$inc: {commentNum: -1}})
        .catch(err => isOk = false)

    await User
        .updateOne({_id: uid}, {$inc: {commentNum: -1}})
        .catch(err => isOk = false)

    if(isOk) {
        ctx.body = {
            state: 1,
            message: '删除成功'
        }
    } else {
        ctx.body = {
            state: 0,
            message: '删除失败'
        }
    }
}

// 文章管理 显示列表
exports.artList = async ctx => {
    const uid = ctx.session.uid

    const data = await Article.find({author: uid})
    ctx.body = {
        code: 0,
        count: data.length,
        data
    }
}

// 文章管理 删除
exports.delArt = async ctx => {
    const articleId = ctx.request.body._id
    const uid = ctx.session.uid

    let isOk = true

    await new Promise((resolve, reject) => {
        User
            .updateOne({_id: uid}, {$inc: {articleNum: -1}})
            .catch(err => reject(err))

        Article
            .deleteOne({_id: articleId})
            .catch(err => reject(err))

        Comment
            .find({article: articleId})
            .then(data => {
                data.forEach(v => {
                    User
                        .updateOne({_id: v.from}, {$inc: {commentNum: -1}})
                        .catch(err => reject(err))
                        
                    v.remove().catch(err => reject(err))
                })
            })
            .catch(err => reject(err))

        resolve()
    })
    .catch(err => {
        isOk = false
        console.log(err)
    })

    if(isOk) {
        ctx.body = {
            state: 1,
            message: '删除成功'
        }
    } else {
        ctx.body = {
            state: 0,
            message: '删除失败'
        }
    }
}