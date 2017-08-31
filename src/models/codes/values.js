/* global location */
import pathToRegexp from 'path-to-regexp'
import { queryValues } from '../../services/codes'

export default {

  namespace: 'codeValues',

  state: {
    data: {},
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
    * query ({
      payload,
    }, { call, put }) {
      const httpData = yield call(queryValues, payload)
      const { total, data } = httpData
      if (total >= 1) {
        yield put({
          type: 'querySuccess',
          payload: {
            data,
          },
        })
      } else {
        throw httpData
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { data } = payload
      return {
        ...state,
        data,
      }
    },
  },
}
