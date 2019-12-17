const ArticleModel = require('../models/Article');

const add = (req, res, next) => {
  console.log(req.body);
  res.json({
    code: 200,
    msg: 'ok'
  })
  ArticleModel.articleCreate(req.body, (data) => {
    res.json({
      code: 200,
      data: {
        status: 1,
        info: data
      }
    })
  })
}
const list = (req, res, next) => {
  ArticleModel.articleList(req.body, (data) => {
    res.json({
      code: 200,
      data: {
        status: 1,
        info: data
      }
    })
  })
}
const findOne = (req, res, next) => {
  console.log(req.params)
  ArticleModel.articleFindOne(req.params.id, (data) => {
    res.json({
      code: 200,
      data: {
        status: 1,
        info: data
      }
    })
  })
}

module.exports = {
  add,
  list,
  findOne
}