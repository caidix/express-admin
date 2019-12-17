module.exports = app => {
  const mongoose = require('mongoose');
  const consola = require('consola')
  const autoIncrement = require('mongoose-auto-increment');
  mongoose.connect('mongodb://127.0.0.1:27017/myblog', {
    useNewUrlParser: true
  })

  // 连接失败
  mongoose.connection.on('error', error => {
		consola.warn('数据库连接失败!', error)
	})

	// 连接成功
	mongoose.connection.once('open', () => {
		consola.ready('数据库连接成功!')
	})
  autoIncrement.initialize(mongoose.connection)
}