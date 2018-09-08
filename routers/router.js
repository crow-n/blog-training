// 拿到操作各个表的 控制器
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')

// admin 控制器
const admin = require('../control/admin')
// 404 页面处理
const notFound = require('../control/notfound')

// 文件上传 组件
const upload = require('../util/upload')

const Router = require('koa-router')
const router = new Router

// 主页
router.get('/', article.getList)


// 用户注册、登录
router.get(/^\/user\/(reg|login)$/, user.user)

// 处理用户注册的 post
router.post('/user/reg', user.reg)

// 处理用户登录的 post
router.post('/user/login', user.login)

// 用户退出
router.get('/user/logout', user.logout)


// 文章发表页面
router.get('/article', article.addPage)

// 文章发表的 post
router.post('/article', article.add)

// 获取文章列表分页
router.get('/page/:page', article.getList)

// 获取文章详情页
router.get('/article/:id', article.detail)


// 发表评论
router.post('/comment', comment.add)


// 文章 评论 头像上传
router.get('/admin/:path', admin.index)

// 头像上传功能
router.post('/admin/userface/upload', upload.single('file'), admin.upload)

// 评论管理 显示列表
router.get('/admin/comment/list', admin.cmtList)

// 评论管理 删除
router.post('/admin/comment/del', admin.delCmt)

// 文章管理 显示列表
router.get('/admin/article/list', admin.artList)

// 文章管理 删除
router.post('/admin/article/del', admin.delArt)


// 404
router.get('*', notFound)

module.exports = router