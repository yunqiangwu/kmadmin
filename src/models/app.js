/* global window */
/* global document */
/* global location */
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { getUserInfo, logout } from 'services/app'
import * as menusService from 'services/menus'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: '首页',
        route: '/',
      },
    ],
    menuPopoverVisible: false,
    tokenData: JSON.parse(window.localStorage.getItem(`${prefix}tokenData`)) || {},
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: false,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {

    setup ({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put, select }) {
      let tokenData = yield select(s => s.app.tokenData)
      let pathname = yield select(s => s.routing.locationBeforeTransitions.pathname)
      let from = yield select(s => s.routing.locationBeforeTransitions.query.from)
      tokenData && (window.tokenData = tokenData)
      const userInfo = yield call(getUserInfo, payload)
      console.log(userInfo)
      if (userInfo && userInfo.success) {
        let user = {
          username: userInfo.FullName,
          ...userInfo,
          permissions: {
            role: EnumRoleType.DEVELOPER,
          },
          id: +userInfo.userId,
        }
        const { list } = yield call(menusService.query)
        const { permissions } = user
        let menu = list
        permissions.visit = list.map(item => item.id)

        if (permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER) {
          permissions.visit = list.map(item => item.id)
        } else {
          menu = list.filter((item) => {
            const cases = [
              permissions.visit.includes(item.id),
              item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
              item.bpid ? permissions.visit.includes(item.bpid) : true,
            ]
            return cases.every(_ => _)
          })
        }
        yield put({
          type: 'updateState',
          payload: {
            user,
            permissions,
            menu,
          },
        })
        if (pathname === '/login') {
          if (from) {
            yield put(routerRedux.push(from))
          } else {
            yield put(routerRedux.push('/homepage'))
          }
        }
      } else if (config.openPages && config.openPages.indexOf(pathname) < 0) {
        // console.log(`登录失败！\t${`/login${/\s*\/\s*/.test(from) ? '?from=/' : `?from=${from}`}`}\t:\t${from}`)
        // window.location = `${location.origin}/login?from=${from}`
        yield put(routerRedux.replace(`/login?from=${pathname}`))
      } else {
        yield put(routerRedux.replace(`/login?from=${pathname}`))
        throw userInfo
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({ type: 'clearTokenData' })
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },

    * changeNavbar (action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    putTokenData (state, { payload }) {
      window.localStorage.setItem(`${prefix}tokenData`, JSON.stringify(payload))
      return {
        ...state,
        tokenData: payload,
      }
    },
    clearTokenData (state) {
      window.localStorage.removeItem(`${prefix}tokenData`)
      return {
        ...state,
        tokenData: {},
      }
    },
    switchSider (state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      return state
      // window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      // return {
      //   ...state,
      //   darkTheme: !state.darkTheme,
      // }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
