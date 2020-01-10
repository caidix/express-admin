const ArticleModel = require('../models/Article');
const { splitParams } = require('../utils/utils')
const add = (req, res, next) => {
  if (req.id) {
    req.body.sssociatedAccount = req.id;
  }
  ArticleModel.articleCreate(req.body, (data) => {
    if (data) {
      res.json({
        code: 0,
        data: {
          status: 1,
          info: data
        }
      })
    } else {
      res.json({
        code: 0,
        data: {
          status: -1,
          info: '未知错误'
        }
      })
    }

  })
}
const list = (req, res, next) => {
  let GET = splitParams(req.url);
  if (!GET['userId'] && req.id) {
    GET['userId'] = req.id;
  }
  console.log(GET)
  ArticleModel.articleList(GET, (data) => {
    res.json({
      code: 0,
      data: {
        status: 1,
        info: data
      },
      auth: req.session.auth !== undefined ? req.session.auth : 0
    })
  })
}
const findOne = (req, res, next) => {
  ArticleModel.articleFindOne(req.params.id, (data) => {
    res.json({
      code: 0,
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
      code: 0,
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
      code: 0,
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