const { db, Schema, ObjectId } = require('./config')

const CommentSchema = new Schema({
    content: String,
    from: {
        type: ObjectId,
        ref: 'users'
    },
    article: {
        type: ObjectId,
        ref: 'articles'
    }
}, {versionKey: false, timestamps: {
    createdAt: 'created'
}})

// 通过 db 对象创建操作users数据库的模型对象
const Comment = db.model('comments', CommentSchema)

module.exports = Comment