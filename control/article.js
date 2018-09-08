const Article = require('../model/article')
const Comment = require('../model/comment')
const User = require('../model/user')

// 文章发表页面
exports.addPage = async ctx => {
    await ctx.render('add-article', {
        title: '文章发表页',
        session: ctx.session
    })
}

// 文章发表
exports.add = async ctx => {
    if(ctx.session.isNew) {
        // 没登录 提示
        return ctx.body = {
            msg: '用户未登录',
            status: 0
        }
    }

    const data = ctx.request.body
    data.author = ctx.session.uid

    await new Promise((resolve, reject) => {
        new Article(data).save((err, res) => {
            if(err) return reject(err)
            
            User.updateOne({_id: data.author}, {$inc: {articleNum: 1}}, err => {
                if(err) return console.log(err)
            })
            resolve(res)
        })
    })
    .then(res => {
        ctx.body = {
            msg: '发表成功',
            status: 1
        }
    })
    .catch(err => {
        ctx.body = {
            msg: '发表失败',
            status: 0
        }
    })
}

// 显示文章
exports.getList = async (ctx, next) => {
    let page = ctx.params.page || 1

    const onePageNum = 5
    const maxNum = await  Article.estimatedDocumentCount((err, data) => err ? console.log(err) : data)

    if(isNaN(parseInt(page)) || page <= 0) return next()

    const artList = await Article
        .find()
        .sort('-updated')
        .skip(onePageNum * (page - 1))
        .limit(onePageNum)
        // 通过author属性联表(要联的表已经在schema该属性的ref中写明),
        // 查找username和avatar(_id默认也会获取)
        .populate('author', 'username avatar')
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render('index', {
        title: '博客首页',
        session: ctx.session,
        artList,
        maxNum
    })
}

// 显示文章详情页
exports.detail = async (ctx, next) => {
    const _id = ctx.params.id

    const article = await Article
        .findById(_id)
        .populate('author', 'username')
        .then(data => data)
        .catch(err => console.log(err))

    if(!article) return next()
    
    const comment = await Comment
        .find({article: _id})
        .sort('-created')
        .populate('from', 'username avatar')
        .then(data => data)
        .catch(err => console.log(err))

    await ctx.render('article', {
        title: article.title,
        session: ctx.session,
        article,
        comment
    })
}