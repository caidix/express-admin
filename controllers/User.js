const UserModel = require('../models/User');
const svgCaptcha = require('svg-captcha');
const { createSha256, returnClient, setToken, undoJwt } = require('../utils/utils')
const getSvgCaptcha = (req, res, next) => {
  const captcha = svgCaptcha.create({
    color: true,
    noise: 2,
    ignoreChars: '0o1i',
    size: 4
  })
  req.session.captcha = captcha.text.toLocaleLowerCase();
  // res.cookie('captcha',captcha.text.toLocaleLowerCase())
  res.type('svg');
  res.status(200).send(captcha.data);
  console.log(req.session)
}

const register = (req, res, next) => {
  const { username, password, captcha } = req.body;
  if (captcha.toLocaleLowerCase() !== req.session.captcha) {
    returnClient(res, 200, -1, '验证码填写错误，请重新填写!');
    return false;
  }
  req.session._login = true;
  let avatar = req.file ? req.file.filename : 'avatar.jpg';
  UserModel.userFind({ username }, (result) => {
    if (result.length === 0) {
      let data = { ...req.body };
      data['password'] = createSha256(password);
      data['avatar'] = avatar;
      UserModel.userSave(data, () => {
        returnClient(res, 200, 0, '注册成功!')
      }).catch((err) => {
        res.json({
          code: -1,
          message: err
        })
      })
    } else {
      returnClient(res, 200, -1, '用户名重复!')
    }
  })
}

const login = (req, res, next) => {
  const { username, password } = req.body;
  UserModel.userFind({ username }, (result) => {
    if (result) {
      let comparePsd = (createSha256(password) === result.password);
      if (comparePsd) {
        let token = setToken(username);
        req.session.token = token;
        returnClient(res, 200, 0, '登陆成功!', data = { token });
      } else {
        returnClient(res, 200, -1, '用户名或密码错误!');
      }
    } else {
      returnClient(res, 200, -1, '用户名错误或该账号不存在!')
    }
  })
}

const loginOut = (req, res, next) => {
  if (req.session.token) {
    req.session.token = null;
    returnClient(res, 200, 0, '登出成功!');
  } else {
    returnClient(res, 200, -1, '您还未登陆!');
  }
}

const currentUser = (req, res, next) => {
  let token = req.session.token || req.headers.token;
  if (token) {
    const { username } = undoJwt(token);
    if (!username) {
      returnClient(res, httpCode = 200, code = -1, message = '请先登录!')
    }
    UserModel.userFind({ username }, async (result) => {
      if (result) {
        returnClient(res, httpCode = 200, code = 0, message = '已登陆!', data = result)
      } else {
        returnClient(res, httpCode = 200, code = -1, message = '请先登录!')
      }
    })
  } else {
    returnClient(res, httpCode = 200, code = -1, message = '请先登录!')
  }
}

const uploadAvator = (req, res, next) => {
  res.send({ msg: 'ok' })
}

module.exports = {
  login,
  register,
  loginOut,
  currentUser,
  getSvgCaptcha,
  uploadAvator
}