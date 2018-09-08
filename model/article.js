const { db, Schema, ObjectId } = require('./config')

const ArticleSchema = new Schema({
    tips: String,
    title: String,
    content: String,
    author: {
        type: ObjectId,
        ref: 'users'
    },
    commentNum: {
        type: Number,
        default: 0
    }
}, {versionKey: false, timestamps: {
    updatedAt: 'updated'
}})

// 通过 db 对象创建操作users数据库的模型对象
const Article = db.model('articles', ArticleSchema)

module.exports = Article