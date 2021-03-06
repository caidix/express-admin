const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment');
const crypto = require('crypto');
const { argv } = require('yargs');
const adminSchema = new mongoose.Schema({
  // 名字
  username: { type: String, required: true, default: '' },

  // 用户类型 1:拥有所有权限， 0 普通用户
  type: { type: Number, default: 0 },

  // 手机
  phone: { type: String, default: '' },

  //封面
  img_url: { type: String, default: '' },

  // 邮箱
  //email: { type: String, required: true, validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/ },

  // 个人介绍
  introduce: { type: String, default: '' },

  // 头像
  avatar: { type: String, default: '' },

  // 密码
  password: {
    type: String,
    required: true,
    default: crypto
      .createHash('sha256')
      .update(argv.auth_default_password || 'root')
      .digest('hex'),
  },

  // 创建日期
  create_time: { type: Date, default: Date.now },

  // 最后修改日期
  update_time: { type: Date, default: Date.now },
});

// 自增 ID 插件配置
adminSchema.plugin(autoIncrement.plugin, {
  model: 'user',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

let User = mongoose.model('user', adminSchema);

const userSave = (info, cb) => {
  let user = new User(info);
  user.save().then((res) => cb(res))
}

const userFind = (info, cb) => {
  User.findOne(info).then(res => {
    cb(res);
  })
}

const userList = (info, cb) => {
  User.aggregate([{
    $lookup: {
      from: 'articles',
      localField: '_id',
      foreignField: 'sssociatedAccount',
      as: 'articleList'
    }
  }]).then(res => cb(res))
  // User.find({}, { password: 0 }).then(res => cb(res))
}

const userFindByName = (username, cb) => {
  User.findOne({ username }, { password: 0 }).then((res) => {
    cb(res)
  })
}

const userRemove = (id, cb) => {
  User.findByIdAndRemove(id).then(res => {
    cb(res)
  })
}

module.exports = {
  userSave,
  userFind,
  userFindByName,
  userList,
  userRemove
}