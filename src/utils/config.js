let menusData = require('./menus2.json')

const APIV1 = '/api/v1'
const APIV2 = '/api/v2'
let url = 'https://test.zhishinet.com'
// url = ''

module.exports = {
  name: '芝士网后台管理',
  prefix: 'antdAdmin_',
  footerText: 'Ant Design Admin  © 2017 zuiidea',
  logo: './logo.png',
  iconFontCSS: './iconfont.css',
  iconFontJS: './iconfont.js',
  CORS: ['https://dev2.zhishinet.com'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  api: {
    userLogin: `${url}/api/zauth/v1/token/access`,
    userLogout: `${APIV1}/user/logout`,
    userInfo: `${url}/api/HomePageAPI/GetUserInfo`,
    users: `${APIV1}/users`,
    posts: `${APIV1}/posts`,
    teacherInfo: `${url}/api/user-profile/v1/sec/users/teacher`,
    dashboard: `${APIV1}/dashboard`,
    menus: `${APIV1}/menus`,
    weather: `${APIV1}/weather`,
    v1test: `${APIV1}/test`,
    v2test: `${APIV2}/test`,
    codesList: `${url}/api/sys/sec/listLookUpType`,
    codesSave: `${url}/api/sys/sec/saveLookUpType`,
    codesValuesList: `${url}/api/sys/sec/listLookupValues`,
    codesValuesSave: `${url}/api/sys/sec/saveLookupValues`,
    promptsList: `${url}/api/sys/sec/listFindMessages`,
    promptsSave: `${url}/api/sys/sec/saveFindMessages`,
  },
  menusData,
}
