module.exports = app => {
  const express = require('express');
  const router = express.Router({
    mergeParams: true
  });
  const multer = require('multer')
  var storage = multer.diskStorage({
    //设置图片的位置 指定文件的路径
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../../public/img')
    },
    //处理图片的名称  指定文件名
    filename: function (req, file, cb) {

      cb(null, Date.now() + '-' + file.originalname)
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