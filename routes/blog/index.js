module.exports = app => {
  const express = require('express')
  const router = express.Router({
    mergeParams: true
  });
  let blog = require('../../controllers/Article');
  let tag = require('../../controllers/Tag')
  app.use('/blog/api', router);
  router.post('/article/add', blog.add);
  router.get('/article/list', blog.list);
  router.get('/article/findOne/:id', blog.findOne);
  router.get('/tag/list', tag.list);

  // 错误反馈
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
};