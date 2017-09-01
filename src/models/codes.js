import * as codesService from 'services/codes'
import modelExtend from 'dva-model-extend'
import { pageModel } from './common'

const PrimaryKeyFiled = 'lookUpType'
const { query, save } = codesService
export default modelExtend(pageModel, {
  namespace: 'codes',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },
  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
  },
  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.rows,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },
    * create ({ payload }, { call, put }) {
      const data = yield call(save, [payload])
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * update ({ payload }, { call, put }) {
      const data = yield call(save, [payload])
      if (data.success) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * delete ({ payload }, { call, put, select }) {
      const id = payload
      let list = yield select(s => s.codes.list)
      let deleteItem = list.find(item => item[PrimaryKeyFiled] === id)
      deleteItem = { ...deleteItem, deleted: true }
      const data = yield call(save, [deleteItem])
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * multiDelete ({ payload }, { call, put, select }) {
      const { ids } = payload
      let list = yield select(s => s.codes.list)
      let deleteDatas = list.filter((item) => {
        console.log(ids, item[PrimaryKeyFiled])
        if (ids && ids.indexOf(item[PrimaryKeyFiled]) >= 0) {
          return true
        }
        return false
      }).map(item => ({ ...item, deleted: true }))
      const data = yield call(save, deleteDatas)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/codes') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },
})
