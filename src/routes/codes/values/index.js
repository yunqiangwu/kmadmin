import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ codeValues, dispatch, codes, loading }) => {
  const { data: list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = codeValues
  // const { pageSize } = pagination
  // const isMotion = true


  return <div>{JSON.stringify(list)}</div>
}

Detail.propTypes = {
  codeValues: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.bool,
}

export default connect(({ codeValues, loading }) => ({ codeValues, loading: loading.models.codeValues }))(Detail)
