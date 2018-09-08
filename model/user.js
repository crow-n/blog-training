const { db, Schema } = require('./config')

const UserSchema = new Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: '/avatar/default.jpg'
    },
    role: {
        type: String,
        default: 1
    },
    articleNum: {
        type: Number,
        default: 0
    },
    commentNum: {
        type: Number,
        default: 0
    },
}, {versionKey: false})

// 通过 db 对象创建操作users数据库的模型对象
const User = db.model('users', UserSchema)

module.exports = User