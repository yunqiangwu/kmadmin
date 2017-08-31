const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { api: { userLogin, user } } = config

module.exports = {

  [`POST ${userLogin}`] (req, res) {
    res.status(200).json({
      access_token: '0dac55ff-3df2-3e87-8cfb-92e7bf297993',
      refresh_token: '2fb33e5d-1313-36e9-a8fd-a5a327566676',
      token_type: 'Bearer',
    })
  },

  [`GET ${user}`] (req, res) {
    if (req.headers.authorization !== 'Bearer 0dac55ff-3df2-3e87-8cfb-92e7bf297993') {
      res.status(403).json({ success: false, message: 'Token Error！' })
    } else {
      res.status(200).json({
        userId: 5842,
        ubuserId: 5842,
        username: 'SH000003',
        givename: '章雪燕 ',
        gender: 2,
        email: 'yunqiang.wu@hand-china.com',
        cellNumber: '15121069436',
        avatar: 'https://ubjchinaprostorage.blob.core.chinacloudapi.cn/userdata/tenant/13/profile/5842_ddcdf771-4ee0-428c-8236-55bb4d9c9f33.jpg',
        themeId: 1,
        changePasswordOnLogon: false,
        roles: [
          'administrator',
          'teacher',
          'student',
        ],
        details: [
          {
            schoolId: 3,
            schoolName: '芝士网皇家学院',
          },
          {
            schoolId: 184,
            schoolName: '芝士网线上学习中心',
          },
        ],
      })
    }
  },

}
