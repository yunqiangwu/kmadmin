import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Loader } from 'components'
import styles from './index.less'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

function Homepage ({ homepage, loading }) {
  return (
    <div style={bodyStyle}>
      <Loader spinning={loading.models.homepage} />
      <div>我是首页</div>
    </div>
  )
}

Homepage.propTypes = {
  homepage: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ homepage, loading }) => ({ homepage, loading }))(Homepage)
