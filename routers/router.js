const Router = require('koa-router')

// 拿到操作 user 表的逻辑对象
const user = require('../control/user')

const router = new Router

// 主页
router.get('/', async ctx => {
    await ctx.render('index', {
        title: '博客首页',
        session: ctx.session
    })
})

// 用户注册、登录
router.get(/^\/user\/(?=reg|login)/, async ctx => {
    // show 为 true 则显示注册   false 显示登录
    const show = /reg$/.test(ctx.path)

    await ctx.render('register', {show})
})

// 处理用户注册的 post
router.post('/user/reg', user.reg)

// 处理用户登录的 post
router.post('/user/login', user.login)

// 用户退出
router.get('/user/logout', user.logout)

module.exports = router