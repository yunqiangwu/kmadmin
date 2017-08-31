import React from 'react'
import { Icon } from 'antd'
import styles from './index.less'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Loader } from 'components'

const Error = ({ isHomePage }) => (
  <div className="content-inner">
    <Loader spinning={isHomePage} />
    { !isHomePage && <div className={styles.error}>
      <Icon type="frown-o" />
      <h1>404 Not Found</h1>
    </div>}
  </div>)



Error.propTypes = {
  isHomePage: PropTypes.bool,
}
export default connect(({ routing }) => ({ isHomePage: /^\/(homepage)?$/.test(routing.locationBeforeTransitions.pathname) }))(Error)
