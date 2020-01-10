const querystring = require('querystring');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = 'cd的个人博客';
const UserModel = require('../models/User');
/**
 * 切割get请求获取params的方法
 * @param {地址} url 
 */
function splitParams(url) {
  let GET = {};
  if (url.indexOf('?') != -1) {
    let arr = url.split('?');
    GET = querystring.parse(arr[1]);//
  }
  return GET;
}

/**
 * 返回加密后的密码
 * @param {账号密码} password 
 */
function createSha256(password) {
  const hash = crypto.createHash('sha256');
  return hash.update(password).digest('hex')
}

/**
 * 创建/获取token
 * @param {用户名} username 
 */
function setToken(username) {
  return jwt.sign({
    username
  }, secret, { expiresIn: '24h' })
}
function undoJwt(token) {
  return jwt.verify(token, secret);
}


function tokenCompareMiddleWare(req, res, next) {
  const token = req.session.token || '';
  if (token == '') {
    returnClient(res, httpCode = 401, code = -1, message = '请先登录!');
    return false;
  } else {
    const { username } = undoJwt(token);
    if (!username) {
      returnClient(res, httpCode = 401, code = -1, message = '请先登录!')
      return false;
    }
    UserModel.userFind({username}, async (result) => {
      if (result) {
        req.id = result._id;
        next();
      } else {
        returnClient(res, httpCode = 401, code = -1, message = '请先登录!')
      }
    })
  }
}

/**
 * 响应方法
 * @param {响应方法} res 
 * @param {http返回响应值} httpCode 
 * @param {返回是否是成功的值：0为成功} code 
 * @param {返回的提示信息} message 
 * @param {返回的字段内容} data 
 */
function returnClient(res, httpCode = 500, code = 200, message = '服务器异常', data = {}) {
  res.status(httpCode).json({
    code,
    message,
    data
  })
}

module.exports = {
  splitParams,
  createSha256,
  returnClient,
  setToken,
  tokenCompareMiddleWare,
  undoJwt
};