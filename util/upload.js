const multer = require('koa-multer')
const { join } = require('path')

const storage = multer.diskStorage({
    // 存储的位置
    destination: join(__dirname, "../static/avatar"),
    // 文件名
    filename(req, file, cb){
      const arr = file.originalname.split(".")
      const ex = arr[arr.length - 1]
      cb(null, `${Date.now()}.${ex}`)
    }
})
  
module.exports = multer({storage})