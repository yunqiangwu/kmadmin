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
    primaryKeyEditable: modalType === 'create',
    confirmLoading: loading,
    title: `${modalType === 'create' ? '新建快码' : '编辑快码'}`,
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
    loading,
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

  return (
    <div className="content-inner">
      <Filter {...filterProps}>
        {
          selectedRowKeys.length > 0 &&
            <span>
              {`已选中 ${selectedRowKeys.length} 个数据 `}
              <Popconfirm title={'确认要删除已选中的数据?'} placement="left" onConfirm={handleDeleteItems}>
                <Button type="primary" size="large" style={{ marginLeft: 8 }}>删除</Button>
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
  loading: PropTypes.bool,
}

export default connect(({ codes, loading }) => ({ codes, loading: loading.effects['codes/query'] }))(User)
