const ArticleModel = require('../models/Article');

const add = (req, res, next) => {
  ArticleModel.articleCreate(req.body, (data) => {
    if (data.length > 0) {
      res.json({
        code: 200,
        data: {
          status: 1,
          info: data
        }
      })
    } else {
      res.json({
        code: 200,
        data: {
          status: -1,
          info: '未知错误'
        }
      })
    }

  })
}
const list = (req, res, next) => {
  if (req.url.indexOf('getContent') > -1) {
    req.params = {
      getContent: true
    }
  }
  ArticleModel.articleList(req.params, (data) => {
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

const delOne = (req, res, next) => {
  ArticleModel.delectArticle(req.params.id, (data) => {
    res.json({
      code: 200,
      data: {
        status: 1,
        data
      }
    })
  })
}

const editArticle = (req, res, next) => {
  ArticleModel.editArticle(req.body, (data) => {
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
  findOne,
  delOne,
  editArticle
}