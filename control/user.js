const User = require('../model/user')

const encrypt = require('../util/encrypt')

// 用户注册
exports.reg = async ctx => {
    // 用户注册时 post 发过来的数据
    const user = ctx.request.body
    const username = user.username
    const password = user.password

    // 1. 查询数据库 username 是否存在
    await new Promise((resolve, reject) => {
        // 去 users 表中查询
        User.find({username}, (err, data) => {
            if(err) return reject(err)
            
            // 用户名已存在
            if(data.length !== 0) return resolve('')

            const _user = new User({
                username,
                password: encrypt(password)
            })

            _user.save()
            .then(async data => resolve(data))
            .catch(async err => reject(err))
        })
    })
    .then(async data => {
        let status = null
        if(data) {
            status = '注册成功'
        } else {
            status = '用户名已存在'
        }
        await ctx.render('isOk', { status })
    })
    .catch(async err => {
        await ctx.render('isOk', {status: '注册失败, 请重试'})
    })
}

// 用户登录
exports.login = async ctx => {
    const user = ctx.request.body
    const username = user.username
    const password = user.password

    await new Promise((resolve, reject) => {
        User.find({username}, (err, data) => {
            if(err) return reject(err)
            if(data.length === 0) return reject('用户名不存在')

            // 把用户传过来的密码 加密后跟数据库中密码比对
            if(data[0].password === encrypt(password)) {
                return resolve(data)
            }
            resolve('')
        })
    })
    .then(async data => {
        let status = null
        if(!data) {
            status = '密码不正确, 登录失败'
        } else {
            status = '登录成功'

            // 保存用户session
            ctx.session = {
                username,
                uid: data[0]._id
            }
        }
        await ctx.render('isOk', { status })
    })
    .catch(async err => {
        await  ctx.render('isOk', {
            status: '登录失败'
        })
    })
}

// 用户退出
exports.logout = async ctx => {
    ctx.session = null
    ctx.redirect('/')
}