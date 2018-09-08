const Koa = require('koa')
const session = require('koa-session')
const body = require('koa-body')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/router')
const { join } = require('path')

const app = new Koa

app.keys = ['crow-n']

// session 的配置对象
const CONFIG = {
    key: 'Sid',
    maxAge: 36e5,       // 过期时间一个小时
    overwrite: true,
    httpOnly: true,    // 前端不可见
    signed: true,       // 签名
    rolling: true       // 访问站点会更新 session 过期时间
}

// 注册 session
app.use(session(CONFIG, app))

// 配置 koa-body 处理 post 请求数据
app.use(body())

// 配置静态资源目录
app.use(static(join(__dirname, 'static')))

// 配置视图模板
app.use(views(join(__dirname, 'views'), {
    extension: 'pug'
}))

// 注册路由信息
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
    console.log('项目启动成功,监听在3000端口')
})

{
    const user = require('./control/user')
    user.detectAdmin()
}