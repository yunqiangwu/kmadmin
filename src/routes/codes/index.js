import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const User = ({ location, dispatch, codes, loading }) => {
  const { list, pagination, currentItem, modalVisible, modalType, selectedRowKeys } = codes
  const { pageSize } = pagination
  const isMotion = true

  const modalProps = {
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects['codes/update'],
    title: `${modalType === 'create' ? '创建快码' : '更新快码'}`,
    wrapClassName: 'vertical-center-modal',
    onOk (data) {
      dispatch({
        type: `codes/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: 'codes/hideModal',
      })
    },
  }

  const listProps = {
    dataSource: list,
    isMotion,
    loading: loading.effects['codes/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'codes/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'codes/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: 'codes/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        })
      },
    },
  }

  const filterProps = {
    isMotion,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/codes',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/codes',
      }))
    },
    onAdd () {
      dispatch({
        type: 'codes/showModal',
        payload: {
          modalType: 'create',
        },
      })
    },
    switchIsMotion () {
      dispatch({ type: 'codes/switchIsMotion' })
    },
  }

  const handleDeleteItems = () => {
    dispatch({
      type: 'codes/multiDelete',
      payload: {
        ids: selectedRowKeys,
      },
    })
  }

  // return (
  //   <div>
  //     <pre>{JSON.stringify(list, null, 2)}</pre>
  //   </div>
  // )

  return (
    <div className="content-inner">
      <Filter {...filterProps}>
        {
          selectedRowKeys.length > 0 &&
            <span>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm title={'Are you sure delete these items?'} placement="left" onConfirm={handleDeleteItems}>
                <Button type="primary" size="large" style={{ marginLeft: 8 }}>Remove</Button>
              </Popconfirm>
            </span>
        }
      </Filter>
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

User.propTypes = {
  codes: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ codes, loading }) => ({ codes, loading }))(User)
