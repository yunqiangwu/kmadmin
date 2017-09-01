/* global location */
import pathToRegexp from 'path-to-regexp'
import { queryValues, query as queryCodes, save as saveCodes, saveValues } from '../../services/codes'
import modelExtend from 'dva-model-extend'
import { pageModel } from '../common'

const PrimaryKeyFiled = 'lookUpId'

export default modelExtend(pageModel, {

  namespace: 'codeValues',

  state: {
    currentItem: {},
    codesItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/codes/values/:lookUpType').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { lookUpType: match[1] } })
        }
      })
    },
  },
  effects: {
    * saveCodes ({ payload }, { call, put }) {
      const data = yield call(saveCodes, [payload])
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * query ({
      payload,
    }, { call, put }) {
      yield put({ type: 'clearSelectRowKeys' })
      const match = pathToRegexp('/codes/values/:lookUpType').exec(location.pathname)
      if (!match) {
        throw new Error(`Error Url: ${location.pathname}`)
      }
      payload = { ...payload, lookUpType: match[1] }
      const httpDataCodes = yield call(queryCodes, payload)
      if (!httpDataCodes || !httpDataCodes.rows) {
        throw httpDataCodes
      }
      const httpData = yield call(queryValues, payload)
      if (!httpData || !httpData.rows) {
        throw httpDataCodes
      }
      const { total, rows: list } = httpData
      const { rows: codesDatas } = httpDataCodes
      yield put({ type: 'updateState',
        payload: {
          codesItem: codesDatas[0] || {},
        } })
      yield put({
        type: 'querySuccess',
        payload: {
          list,
          pagination: {
            total,
          },
        },
      })
    },
    * create ({ payload }, { call, put }) {
      const match = pathToRegexp('/codes/values/:lookUpType').exec(location.pathname)
      if (!match) {
        throw new Error(`Error Url: ${location.pathname}`)
      }
      payload.lookUpType = match[1]
      const data = yield call(saveValues, [payload])
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * update ({ payload }, { call, put }) {
      const data = yield call(saveValues, [payload])
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * delete ({ payload }, { call, put, select }) {
      const id = payload
      let list = yield select(s => s.codeValues.list)
      let deleteItem = list.find(item => item[PrimaryKeyFiled] === id)
      deleteItem = { ...deleteItem, deleted: true }
      const data = yield call(saveValues, [deleteItem])
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * multiDelete ({ payload }, { call, put, select }) {
      const { ids } = payload
      let list = yield select(s => s.codeValues.list)
      let deleteDatas = list.filter((item) => {
        console.log(ids, item[PrimaryKeyFiled])
        if (ids && ids.indexOf(item[PrimaryKeyFiled]) >= 0) {
          return true
        }
        return false
      }).map(item => ({ ...item, deleted: true }))
      const data = yield call(saveValues, deleteDatas)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    clearSelectRowKeys (state) {
      return { ...state, selectedRowKeys: [] }
    },

    updateState (state, { payload }) {
      return { ...state, ...payload }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
  },

})
