const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment')
const categorySchema = new mongoose.Schema({
  // 分类名称
  name: { type: String, required: true, validate: /\S+/ },

  // 分类描述
  desc: { type: String, default: '' },

  // 创建日期
  create_time: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },

  // 最后修改日期
  update_time: { type: String, default: moment().format('YYYY-MM-DD HH:mm:ss') },
});

categorySchema.plugin(autoIncrement.plugin, {
  model: 'tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});
module.exports = mongoose.model('tag', categorySchema);