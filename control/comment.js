const Comment = require('../model/comment')
const Article = require('../model/article')
const User = require('../model/user')

// 添加评论
exports.add = async ctx => {
    let message = {
        status: 0,
        msg: '登录才能发表'
    }

    if(ctx.session.isNew) return ctx.body = message

    const comment = ctx.request.body
    comment.from = ctx.session.uid

    const _comment = new Comment(comment)

    await _comment
        .save()
        .then(data => {
            message = {
                status: 1,
                msg: '评论成功'
            }

            // 更新当前文章的评论计数器
            Article.updateOne({_id: comment.article}, {$inc: {commentNum: 1}}, err => {
                if(err) return console.log(err)
            })

            // 更新当前用户的评论数
            User.updateOne({_id: comment.from}, {$inc: {commentNum: 1}}, err => {
                if(err) return console.log(err)
            })
        })
        .catch(err => {
            message = {
                status: 0,
                msg: err
            }
        })
    
    ctx.body = message
}