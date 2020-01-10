const TagModel = require('../models/Tag');
const { splitParams } = require('../utils/utils')
const moment = require('moment')

const add = (req, res, next) => {
  let GET = splitParams(req.url);
  if (GET.name) {
    TagModel.find({ name: GET.name }).then(data => {
      if (data.length > 0) {
        res.send({
          code: -1,
          message: '已有该标签,请重新设定。',
          data
        });
      } else {
        TagModel.create({
          name: GET.name,
          desc: GET.desc ? GET.desc : '',
          update_time: moment().format('LLL')
        }).then(data => {
          res.json({
            code: 0,
            message: '添加成功!'
          })
        }).catch((err) => {
          res.send({
            code: -1,
            message: err
          })
        })
      }
    })
  } else {
    res.json({
      code: 400,
      msg: '未知错误，请重试'
    })
  }
}

const get = (req, res, next) => {
  TagModel.find().limit().then((data) => {
    res.json({
      code: 0,
      data,
      auth: req.session.auth !== undefined ? req.session.auth : 0
    })
  }).catch((err) => {
    res.send({
      code: -1,
      message: err
    })
  })
}

const edit = (req, res, next) => {
  console.log(req.body)
  const { id, name, desc } = req.body;
  TagModel.update({ id }, {
    "$set": { name, desc, update_time: moment().format('YYYY-MM-DD h:mm:ss') }
  }).then((data) => {
    console.log(data)
    res.send({
      code: 0,
      data: data,
      message: '修改成功!'
    }).catch((err) => {
      res.send({
        code: -1,
        message: err
      })
    })
  })
}

const del = (req, res, next) => {
  let GET = splitParams(req.url);
  if (GET.id) {
    TagModel.findOneAndDelete({ id: GET.id }).then(({ name, update_time }) => {
      res.send({
        code: 0,
        data: { name, update_time },
        message: '删除成功!'
      })
    }).catch((err) => {
      res.send({
        code: -1,
        message: err
      })
    })
  } else {
    res.send({
      code: -1,
      message: '未知错误'
    })
  }
}

// 博客页使用接口
const list = (req, res, next) => {
  //name: 'React'
  TagModel.aggregate([
    {
      $match: {
        $or: [
          { name: 'Vue' }, { name: 'React' }
        ]
      }
    },
    {
      $lookup: {
        from: 'articles',
        localField: '_id',
        foreignField: 'tags',
        as: 'articleList',
      }
    }
  ]).then(data => {
    res.send({
      code: 0,
      data,
      message: '获取成功!'
    })
  })
}

module.exports = {
  add,
  get,
  edit,
  del,
  list
}