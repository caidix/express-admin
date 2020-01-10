module.exports = app => {
  const express = require('express');
  const router = express.Router({
    mergeParams: true
  });
  const MAO = require('multer-aliyun-oss');
  const multer = require('multer')
  var storage = MAO({
    config: {
      region: 'oss-cn-shenzhen',
      accessKeyId: 'LTAI4FhUmFPc7Nu4yLejhkkb',
      accessKeySecret: 'HHjKvma9tLKRAUysyTdrdVUGwcqEgQ',
      bucket: 'cd-blog'
    }
  })

  //3、使用当前配置
  var upload = multer({ storage: storage })

  //4、设置传递图片的key值，以及这个key值可以传递多少张图片
  // var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }])
  let user = require('../../controllers/User');
  app.use('/api/user', router);
  router.post('/register', upload.single('avatar'), user.register);
  router.post('/login', user.login);
  router.post('/userList', user.userList);
  router.post('/userRemove', user.userRemove);
  router.post('/uploadavator', upload.single('avatar'), user.uploadAvator);
  router.get('/loginOut', user.loginOut);
  router.get('/currentUser', user.currentUser);
  router.get('/getsvgcaptcha', user.getSvgCaptcha);
  // 错误反馈
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}