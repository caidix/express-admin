module.exports = app => {
  const express = require('express')
  const router = express.Router({
    mergeParams: true
  });
  const { tokenCompareMiddleWare } = require('../../utils/utils')
  let admin = require('../../controllers/Article');
  let adminCategory = require('../../controllers/Category');
  let adminTag = require('../../controllers/Tag');

  app.use('/api/admin', tokenCompareMiddleWare, router);

  // 文章路由
  router.post('/article/add', admin.add);
  router.post('/article/edit', admin.editArticle);
  router.get('/article/list', admin.list);
  router.get('/article/findOne/:id', admin.findOne);
  router.delete('/article/delOne/:id', admin.delOne);
  
  // 分类路由
  router.get('/category/add', adminCategory.add)
  router.get('/category/get', adminCategory.get)
  router.get('/category/del', adminCategory.del)
  router.post('/category/edit', adminCategory.edit)
  
  // 标签路由
  router.get('/tag/add', adminTag.add)
  router.get('/tag/get', adminTag.get)
  router.get('/tag/del', adminTag.del)
  router.post('/tag/edit', adminTag.edit)
  // 错误反馈
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
};