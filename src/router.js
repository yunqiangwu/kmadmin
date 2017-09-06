import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'dva/router'
import App from 'routes/app'


// dispatch({ type: 'app/asynRequireStart' })
// dispatch({ type: 'app/asynRequireEnd' })

const Routers = function ({ history, app }) {
  const dispatch = app._store.dispatch

  const registerModel = (a, model) => {
    if (!(a._models.filter(m => m.namespace === model.namespace).length === 1)) {
      a.model(model)
    }
  }
  let asycRequire = (depends, cb, o) => {
    dispatch({ type: 'app/asynRequireStart' })
    const myCb = (_require) => {
      dispatch({ type: 'app/asynRequireEnd' })
      cb(_require)
    }
    require.ensure(depends, myCb, o)
  }

  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        dispatch({ type: 'app/asynRequireStart' })
        require.ensure([], (require) => {
          dispatch({ type: 'app/asynRequireEnd' })
          registerModel(app, require('models/homepage'))
          cb(null, { component: require('routes/homepage/') })
        }, 'homepage')
      },
      childRoutes: [
        {
          path: 'codes/values/:lookupType',
          getComponent (nextState, cb) {
            dispatch({ type: 'app/asynRequireStart' })
            require.ensure([], (require) => {
              dispatch({ type: 'app/asynRequireEnd' })
              registerModel(app, require('models/codes/values'))
              cb(null, require('routes/codes/values/'))
            }, 'codes-values')
          },
        },
        {
          path: 'prompts',
          getComponent (nextState, cb) {
            dispatch({ type: 'app/asynRequireStart' })
            require.ensure([], (require) => {
              dispatch({ type: 'app/asynRequireEnd' })
              registerModel(app, require('models/prompts'))
              cb(null, require('routes/prompts/'))
            }, 'prompts')
          },
        },
        {
          path: 'codes',
          getComponent (nextState, cb) {
            dispatch({ type: 'app/asynRequireStart' })
            require.ensure([], (require) => {
              dispatch({ type: 'app/asynRequireEnd' })
              registerModel(app, require('models/codes'))
              cb(null, require('routes/codes/'))
            }, 'codes')
          },
        }, {
          path: 'homepage',
          getComponent (nextState, cb) {
            dispatch({ type: 'app/asynRequireStart' })
            require.ensure([], (require) => {
              dispatch({ type: 'app/asynRequireEnd' })
              registerModel(app, require('models/homepage'))
              cb(null, require('routes/homepage/'))
            }, 'homepage')
          },
        }, {
          path: 'login*',
          getComponent (nextState, cb) {
            dispatch({ type: 'app/asynRequireStart' })
            require.ensure([], (require) => {
              dispatch({ type: 'app/asynRequireEnd' })
              registerModel(app, require('models/login'))
              cb(null, require('routes/login/'))
            }, 'login')
          },
        }, {
          path: '*',
          getComponent (nextState, cb) {
            dispatch({ type: 'app/asynRequireStart' })
            require.ensure([], (require) => {
              dispatch({ type: 'app/asynRequireEnd' })
              cb(null, require('routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
