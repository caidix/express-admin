const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment');
const moment = require('moment');
const schema = mongoose.Schema({
  title: { type: String, required: true, validate: /\S+/ },  //文章标题

  articleContent: { type: String, require: true, validata: /\S+/ }, //文章内容

  author: { type: String, required: true, validate: /\S+/ }, // 作者

  /* 文章类型 0 原创，1 转载，2 混合 */
  type: { type: Number, default: 1 },

  //文章来源：转载 原创 混合
  origin: { type: Number, default: 0 },

  // 文章关键字（SEO）
  keyword: [{ type: String, default: '' }],

  // 文章标签
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tag', required: true }],

  /* 文章分类 0 文章分享 2 视频教程 */
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category', required: true
  }],

  img_url: { // 封面图
    type: String,
    default: ''
  },

  like_users: [{  // 点赞的用户
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  }],
  // 关联账户，通过关联的账户导出相应所写的文章
  sssociatedAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

  introduction: { type: String },  //文章简介
  draft: { type: Number, default: 0 }, // 是否为草稿，草稿为1
  addTime: {
    type: Date,
    default: moment()
  },  //添加时间

  viewCount: { type: Number, default: 0 }, //浏览总数

  likes: { // 收藏数
    type: Number,
    default: 0
  }
})

schema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

let Article = mongoose.model('Article', schema);

let articleCreate = (info, cb) => {
  Article.create(info).then(res => {
    cb(res);
  })
}

let articleList = (info, cb) => {
  const queryOptions = {
    populate: ['tags', 'category']
  }
  let params = {}
  if (!info.getContent) {
    params['articleContent'] = false;
  }
  let findconf = info.userId ? { sssociatedAccount: info.userId } : {}
  if (info._id) {
    findconf.tags = { $in: info._id }
  }
  Article.find(findconf, params)
    .setOptions(queryOptions).limit(parseInt(info.limit)).skip(0).then(res => {
      cb(res)
    })
}
let articleFindOne = (info, cb) => {
  const queryOptions = {
    populate: 'category'
  }
  Article.findById(info).setOptions(queryOptions).then(res => {
    cb(res)
  })
}

let delectArticle = (info, cb) => {
  Article.findByIdAndDelete(info).then(res => (cb(res)))
}

let editArticle = (info, cb) => {
  Article.findOneAndUpdate({ _id: info._id }, info).then(res => cb(res))
}

module.exports = {
  articleCreate,
  articleList,
  articleFindOne,
  delectArticle,
  editArticle
}